"""Capture the real headed Chrome window from the isolated X11 display.
The PNG includes browser chrome. No CDP screenshot, CSS change, scaling or
image masking is used. Blank body/visible-heading captures fail explicitly.
"""
import ctypes as C
import hashlib
import json
import os
from pathlib import Path
import struct
import sys
import zlib

x=C.CDLL('libX11.so.6')
x.XOpenDisplay.argtypes=[C.c_char_p];x.XOpenDisplay.restype=C.c_void_p
x.XDefaultRootWindow.argtypes=[C.c_void_p];x.XDefaultRootWindow.restype=C.c_ulong
x.XQueryTree.argtypes=[C.c_void_p,C.c_ulong,C.POINTER(C.c_ulong),C.POINTER(C.c_ulong),C.POINTER(C.POINTER(C.c_ulong)),C.POINTER(C.c_uint)]
x.XInternAtom.argtypes=[C.c_void_p,C.c_char_p,C.c_int];x.XInternAtom.restype=C.c_ulong
x.XGetWindowProperty.argtypes=[C.c_void_p,C.c_ulong,C.c_ulong,C.c_long,C.c_long,C.c_int,C.c_ulong,C.POINTER(C.c_ulong),C.POINTER(C.c_int),C.POINTER(C.c_ulong),C.POINTER(C.c_ulong),C.POINTER(C.POINTER(C.c_ubyte))]
x.XGetGeometry.argtypes=[C.c_void_p,C.c_ulong,C.POINTER(C.c_ulong),C.POINTER(C.c_int),C.POINTER(C.c_int),C.POINTER(C.c_uint),C.POINTER(C.c_uint),C.POINTER(C.c_uint),C.POINTER(C.c_uint)]
x.XFree.argtypes=[C.c_void_p];x.XSync.argtypes=[C.c_void_p,C.c_int];x.XCloseDisplay.argtypes=[C.c_void_p]
class XImage(C.Structure):
    _fields_=[('width',C.c_int),('height',C.c_int),('xoffset',C.c_int),('format',C.c_int),('data',C.c_void_p),('byte_order',C.c_int),('bitmap_unit',C.c_int),('bitmap_bit_order',C.c_int),('bitmap_pad',C.c_int),('depth',C.c_int),('bytes_per_line',C.c_int),('bits_per_pixel',C.c_int),('red_mask',C.c_ulong),('green_mask',C.c_ulong),('blue_mask',C.c_ulong),('obdata',C.c_void_p)]
x.XGetImage.argtypes=[C.c_void_p,C.c_ulong,C.c_int,C.c_int,C.c_uint,C.c_uint,C.c_ulong,C.c_int];x.XGetImage.restype=C.POINTER(XImage)
x.XDestroyImage.argtypes=[C.POINTER(XImage)]
d=x.XOpenDisplay(os.environ.get('DISPLAY',':99').encode());assert d
image=None
try:
    atom=x.XInternAtom(d,b'_NET_WM_NAME',0)
    def title(window):
        kind,fmt,n,after=C.c_ulong(),C.c_int(),C.c_ulong(),C.c_ulong();data=C.POINTER(C.c_ubyte)()
        status=x.XGetWindowProperty(d,window,atom,0,4096,0,0,C.byref(kind),C.byref(fmt),C.byref(n),C.byref(after),C.byref(data));value=''
        if status==0 and data:
            if fmt.value==8:value=C.string_at(data,n.value).decode(errors='replace')
            x.XFree(data)
        return value
    stack=[x.XDefaultRootWindow(d)];seen=set();target=None;name=''
    while stack and len(seen)<2000:
        window=stack.pop()
        if window in seen:continue
        seen.add(window);name=title(window)
        if 'storileaf' in name.lower():target=window;break
        root,parent,count=C.c_ulong(),C.c_ulong(),C.c_uint();children=C.POINTER(C.c_ulong)()
        if x.XQueryTree(d,window,C.byref(root),C.byref(parent),C.byref(children),C.byref(count)):
            stack.extend(children[i] for i in range(count.value))
            if children:x.XFree(children)
    assert target is not None,'Named StoriLeaf window required'
    root,left,top,width,height,border,depth=C.c_ulong(),C.c_int(),C.c_int(),C.c_uint(),C.c_uint(),C.c_uint(),C.c_uint()
    assert x.XGetGeometry(d,target,C.byref(root),C.byref(left),C.byref(top),C.byref(width),C.byref(height),C.byref(border),C.byref(depth))
    x.XSync(d,0);image=x.XGetImage(d,target,0,0,width.value,height.value,C.c_ulong(-1).value,2);assert image
    im=image.contents
    assert im.bits_per_pixel==32 and im.byte_order==0 and (im.red_mask,im.green_mask,im.blue_mask)==(0xff0000,0xff00,0xff)
    data=C.string_at(im.data,im.bytes_per_line*im.height)
    rows=[]
    for y in range(im.height):
        row=data[y*im.bytes_per_line:y*im.bytes_per_line+im.width*4];rgb=bytearray(im.width*3)
        rgb[0::3]=row[2::4];rgb[1::3]=row[1::4];rgb[2::3]=row[0::4];rows.append(bytes(rgb))
    def chunk(kind,payload):return struct.pack('>I',len(payload))+kind+payload+struct.pack('>I',zlib.crc32(kind+payload)&0xffffffff)
    png=b'\x89PNG\r\n\x1a\n'+chunk(b'IHDR',struct.pack('>IIBBBBB',im.width,im.height,8,2,0,0,0))+chunk(b'IDAT',zlib.compress(b''.join(b'\0'+row for row in rows)))+chunk(b'IEND',b'')
    dest=Path(sys.argv[1]);dest.write_bytes(png);observed=json.loads(sys.argv[2]);v=observed['viewport'];scale=v['dpr']
    assert abs(im.width-v['innerWidth']*scale)<=2,'Native content width must match actual window pixels'
    chrome_height=im.height-round(v['innerHeight']*scale);assert 0<=chrome_height<200
    def palette(l,t,r,b):
        return len({rows[y][xx*3:xx*3+3] for y in range(max(0,t),min(im.height,b),4) for xx in range(max(0,l),min(im.width,r),4)})
    body_colours=palette(0,chrome_height,im.width,im.height)
    h=observed.get('heading');heading_colours=None;area=None
    if h:
        area=[round(h['x']*scale),max(chrome_height,round(chrome_height+h['y']*scale)),round((h['x']+h['width'])*scale),min(im.height,round(chrome_height+(h['y']+h['height'])*scale))]
        if area[2]>area[0] and area[3]>area[1]:heading_colours=palette(*area)
    result={'method':'X11 XGetImage of the actual named Chrome window','window':hex(target),'title':name,'width':im.width,'height':im.height,'depth':im.depth,'browserChromeHeight':chrome_height,'viewport':v,'headingIntersection':area,'bodySampleColours':body_colours,'headingSampleColours':heading_colours,'sha256':hashlib.sha256(png).hexdigest()}
    dest.with_suffix('.capture.json').write_text(json.dumps(result,indent=2)+'\n')
    assert body_colours>=16,'Blank native browser body is not valid rendering evidence'
    assert heading_colours is None or heading_colours>=8,'Blank visible heading is not valid rendering evidence'
    print(json.dumps(result))
finally:
    if image:x.XDestroyImage(image)
    x.XCloseDisplay(d)
