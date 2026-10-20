"""Send ordinary zoom shortcuts to the named Chrome window on isolated Xvfb.
Only test input is sent. Browser policies and page styling remain untouched.
"""
import ctypes as C
import os
import sys
import time

x=C.CDLL('libX11.so.6');t=C.CDLL('libXtst.so.6')
x.XOpenDisplay.argtypes=[C.c_char_p];x.XOpenDisplay.restype=C.c_void_p
x.XDefaultRootWindow.argtypes=[C.c_void_p];x.XDefaultRootWindow.restype=C.c_ulong
x.XQueryTree.argtypes=[C.c_void_p,C.c_ulong,C.POINTER(C.c_ulong),C.POINTER(C.c_ulong),C.POINTER(C.POINTER(C.c_ulong)),C.POINTER(C.c_uint)]
x.XFetchName.argtypes=[C.c_void_p,C.c_ulong,C.POINTER(C.c_char_p)]
x.XInternAtom.argtypes=[C.c_void_p,C.c_char_p,C.c_int];x.XInternAtom.restype=C.c_ulong
x.XGetWindowProperty.argtypes=[C.c_void_p,C.c_ulong,C.c_ulong,C.c_long,C.c_long,C.c_int,C.c_ulong,C.POINTER(C.c_ulong),C.POINTER(C.c_int),C.POINTER(C.c_ulong),C.POINTER(C.c_ulong),C.POINTER(C.POINTER(C.c_ubyte))]
x.XFree.argtypes=[C.c_void_p]
x.XStringToKeysym.argtypes=[C.c_char_p];x.XStringToKeysym.restype=C.c_ulong
x.XKeysymToKeycode.argtypes=[C.c_void_p,C.c_ulong];x.XKeysymToKeycode.restype=C.c_uint
x.XSetInputFocus.argtypes=[C.c_void_p,C.c_ulong,C.c_int,C.c_ulong]
x.XRaiseWindow.argtypes=[C.c_void_p,C.c_ulong]
x.XFlush.argtypes=[C.c_void_p];x.XCloseDisplay.argtypes=[C.c_void_p]
t.XTestFakeKeyEvent.argtypes=[C.c_void_p,C.c_uint,C.c_int,C.c_ulong]
d=x.XOpenDisplay(os.environ.get('DISPLAY',':99').encode());assert d
try:
    atom=x.XInternAtom(d,b'_NET_WM_NAME',0)
    def title(window):
        kind,fmt,n,after=C.c_ulong(),C.c_int(),C.c_ulong(),C.c_ulong()
        data=C.POINTER(C.c_ubyte)()
        status=x.XGetWindowProperty(d,window,atom,0,4096,0,0,C.byref(kind),C.byref(fmt),C.byref(n),C.byref(after),C.byref(data))
        value=''
        if status==0 and data:
            if fmt.value==8:value=C.string_at(data,n.value).decode(errors='replace')
            x.XFree(data)
        if value:return value
        name=C.c_char_p()
        if x.XFetchName(d,window,C.byref(name)) and name.value:
            value=name.value.decode(errors='replace');x.XFree(name)
        return value
    stack=[x.XDefaultRootWindow(d)];seen=set();observed=[];target=None
    while stack and len(seen)<2000:
        window=stack.pop()
        if window in seen:continue
        seen.add(window);name=title(window)
        if name:observed.append((hex(window),name))
        if 'storileaf' in name.lower():target=window;break
        root,parent,count=C.c_ulong(),C.c_ulong(),C.c_uint();children=C.POINTER(C.c_ulong)()
        if x.XQueryTree(d,window,C.byref(root),C.byref(parent),C.byref(children),C.byref(count)):
            stack.extend(children[i] for i in range(count.value))
            if children:x.XFree(children)
    assert target is not None, ('No named StoriLeaf window',observed)
    x.XRaiseWindow(d,target);x.XSetInputFocus(d,target,1,0);x.XFlush(d)
    def event(key,down):
        code=x.XKeysymToKeycode(d,x.XStringToKeysym(key.encode()));assert code
        assert t.XTestFakeKeyEvent(d,code,down,0)
    for key in sys.argv[1:]:
        assert key in ('0','equal','minus')
        event('Control_L',1);event(key,1);event(key,0);event('Control_L',0)
        x.XFlush(d);time.sleep(.15)
finally:
    x.XCloseDisplay(d)
