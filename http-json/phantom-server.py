import time
import BaseHTTPServer
import subprocess
import re

import pyisbn

HOST_NAME = '' # !!!REMEMBER TO CHANGE THIS!!!
PORT_NUMBER = 8000 # Maybe set this to 9000.

class PhantomHTTPServer(BaseHTTPServer.HTTPServer):
    def __init__(self, server_address, RequestHandlerClass, bind_and_activate=True):
        BaseHTTPServer.HTTPServer.__init__(self, server_address, RequestHandlerClass, bind_and_activate)

class SimpleRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):

    def do_HEAD(s):
        s.send_error(404)
        
    def do_GET(s):
        try:
            # Do a quick tidy up to make sure that there
            # is nothing untoward in the path - might be overkill?
            isbn = re.sub(r'[^\dXx]', '', s.path)
            
            if pyisbn.validate(isbn):
                s.send_error(401);
            else:
                s.send_error(404)
        except ValueError as e:
            s.send_error(404)
            

if __name__ == '__main__':
    httpd = PhantomHTTPServer((HOST_NAME, PORT_NUMBER), SimpleRequestHandler)
    print time.asctime(), "Server Starts - %s:%s" % (HOST_NAME, PORT_NUMBER)

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    
    httpd.server_close()
    print time.asctime(), "Server Stops - %s:%s" % (HOST_NAME, PORT_NUMBER)