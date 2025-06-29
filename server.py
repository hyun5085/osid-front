#!/usr/bin/env python3
import http.server
import socketserver
import os
import threading
import time

class StableHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path == '/':
            self.path = '/index.html'
        return super().do_GET()
    
    # def end_headers(self):
    #     self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
    #     self.send_header('Pragma', 'no-cache')
    #     self.send_header('Expires', '0')
    #     super().end_headers()
    def end_headers(self):
        # 모든 텍스트 파일(Type startswith 'text/')에 charset 지정
        ctype = self.guess_type(self.path)
        if ctype and ctype.startswith('text/'):
            self.send_header('Content-Type', f'{ctype}; charset=utf-8')
        # 캐시 방지 헤더
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        self.send_header('Pragma', 'no-cache')
        self.send_header('Expires', '0')
        http.server.SimpleHTTPRequestHandler.end_headers(self)
    
    def log_message(self, format, *args):
        # Suppress verbose logging
        pass

def start_server():
    PORT = int(os.environ.get("PORT", 5000))
    workspace = os.environ.get('GITHUB_WORKSPACE', os.getcwd())
    os.chdir(workspace)

    try:
        with socketserver.TCPServer(("0.0.0.0", PORT), StableHandler) as httpd:
            print(f"프리미어 자동차 서버 시작 - 포트 {PORT}")
            httpd.serve_forever()
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"포트 {PORT}이 이미 사용 중입니다")
        else:
            print(f"서버 시작 오류: {e}")

if __name__ == "__main__":
    start_server()