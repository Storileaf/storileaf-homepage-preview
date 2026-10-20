"""Send ordinary Chrome zoom shortcuts on the isolated Xvfb test display.
No browser policies, extensions, CSS zoom or emulated device scale are changed.
"""
import ctypes as C
import os
import sys
import time

x = C.CDLL('libX11.so.6')
t = C.CDLL('libXtst.so.6')
x.XOpenDisplay.argtypes = [C.c_char_p]
x.XOpenDisplay.restype = C.c_void_p
x.XDefaultRootWindow.argtypes = [C.c_void_p]
x.XDefaultRootWindow.restype = C.c_ulong
x.XQueryTree.argtypes = [C.c_void_p, C.c_ulong, C.POINTER(C.c_ulong), C.POINTER(C.c_ulong), C.POINTER(C.POINTER(C.c_ulong)), C.POINTER(C.c_uint)]
x.XFetchName.argtypes = [C.c_void_p, C.c_ulong, C.POINTER(C.c_char_p)]
x.XFree.argtypes = [C.c_void_p]
x.XStringToKeysym.argtypes = [C.c_char_p]
x.XStringToKeysym.restype = C.c_ulong
x.XKeysymToKeycode.argtypes = [C.c_void_p, C.c_ulong]
x.XKeysymToKeycode.restype = C.c_uint
x.XSetInputFocus.argtypes = [C.c_void_p, C.c_ulong, C.c_int, C.c_ulong]
x.XFlush.argtypes = [C.c_void_p]
x.XCloseDisplay.argtypes = [C.c_void_p]
t.XTestFakeKeyEvent.argtypes = [C.c_void_p, C.c_uint, C.c_int, C.c_ulong]

d = x.XOpenDisplay(os.environ.get('DISPLAY', ':99').encode())
assert d, 'The isolated X11 display must exist'
try:
    root, parent, count = C.c_ulong(), C.c_ulong(), C.c_uint()
    children = C.POINTER(C.c_ulong)()
    assert x.XQueryTree(d, x.XDefaultRootWindow(d), C.byref(root), C.byref(parent), C.byref(children), C.byref(count))
    windows = [children[i] for i in range(count.value)]
    x.XFree(children)
    target = None
    for window in windows:
        name = C.c_char_p()
        if x.XFetchName(d, window, C.byref(name)) and name.value:
            title = name.value.decode(errors='replace')
            x.XFree(name)
            if 'StoriLeaf' in title:
                target = window
                break
    assert target is not None, 'The StoriLeaf browser window must be identified before input'
    x.XSetInputFocus(d, target, 1, 0)
    x.XFlush(d)
    def event(key, down):
        code = x.XKeysymToKeycode(d, x.XStringToKeysym(key.encode()))
        assert code
        assert t.XTestFakeKeyEvent(d, code, down, 0)
    for key in sys.argv[1:]:
        assert key in ('0', 'equal', 'minus'), 'Only zoom shortcuts are permitted'
        event('Control_L', 1)
        event(key, 1)
        event(key, 0)
        event('Control_L', 0)
        x.XFlush(d)
        time.sleep(.15)
finally:
    x.XCloseDisplay(d)
