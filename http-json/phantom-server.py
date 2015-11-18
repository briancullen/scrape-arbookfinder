import time
import BaseHTTPServer
import subprocess

HOST_NAME = '' # !!!REMEMBER TO CHANGE THIS!!!
PORT_NUMBER = 8000 # Maybe set this to 9000.

class PhantomHTTPServer(BaseHTTPServer.HTTPServer):
    def __init__(self, server_address, RequestHandlerClass, bind_and_activate=True):
        BaseHTTPServer.HTTPServer.__init__(self, server_address, RequestHandlerClass, bind_and_activate)

class SimpleRequestHandler(BaseHTTPServer.BaseHTTPRequestHandler):

    def do_HEAD(s):
        s.send_error(404)
        
    def do_GET(s):
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