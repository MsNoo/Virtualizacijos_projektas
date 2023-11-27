import http.server
import socketserver
import requests
import time
import threading

last_checked_time = ""

def check_website_status(url):
    try:
        response = requests.get(url, timeout=5)
        return response.status_code
    except requests.ConnectionError:
        return None

class RequestHandler(http.server.SimpleHTTPRequestHandler):
    def do_GET(self):
        global last_checked_time  

        if self.path == '/':
            vhost1_status = check_website_status("http://vhost1")
            vhost2_status = check_website_status("http://vhost2")
            vhostbackup_status = check_website_status("http://vhostbackup")

            vhost1_color = 'red' if vhost1_status is None else 'green' if vhost1_status == 200 else 'yellow'
            vhost2_color = 'red' if vhost2_status is None else 'green' if vhost2_status == 200 else 'yellow'
            vhostbackup_color = 'red' if vhostbackup_status is None else 'green' if vhostbackup_status == 200 else 'yellow'

            current_time = time.strftime("%Y-%m-%d %H:%M:%S", time.gmtime())
            last_checked_time = current_time 

            response_html = (
                f'<html>'
                f'<head>'
                f'   <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:400,700">'
                f'   <style>'
                f'       body {{ font-family: "Roboto", sans-serif; background-color: #1a1a1a; margin: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; height: 100vh; }}'
                f'       .container {{ display: flex; flex-direction: column; align-items: center; text-align: center; }}'
                f'       .timestamp {{ font-size: 14px; color: white; margin-bottom: 10px; }}'
                f'       .status-box-container {{ display: flex; justify-content: center; }}'
                f'       .status-box {{ width: 200px; height: 200px; font-size: 24px; font-weight: bold; line-height: 200px; text-align: center; border-radius: 5px; margin: 0 10px; }}'
                f'       .status-vhost1 {{ background-color: {vhost1_color}; color: {"black" if vhost1_color == "yellow" else "white"}; }}'
                f'       .status-vhost2 {{ background-color: {vhost2_color}; color: {"black" if vhost2_color == "yellow" else "white"}; }}'
                f'       .status-vhostbackup {{ background-color: {vhostbackup_color}; color: {"black" if vhostbackup_color == "yellow" else "white"}; }}'
                f'   </style>'
                f'       <script>'
                f'           function updateTimestamp() {{'
                f'               var timestampElement = document.getElementById("timestamp");'
                f'               var current_time = new Date().toISOString().slice(0, 19).replace("T", " ");'
                f'               timestampElement.innerText = "Last Checked: " + current_time;'
                f'           }}'
                f'           setInterval(updateTimestamp, 5000);'
                f'           setTimeout(function() {{ location.reload(); }}, 5000);'  
                f'       </script>'
                f'</head>'
                f'<body>'
                f'   <div class="container">'
                f'       <div class="timestamp" id="timestamp">Last Checked: {last_checked_time}</div>'
                f'       <div class="status-box-container">'
                f'           <div class="status-box status-vhost1">vhost1</div>'
                f'           <div class="status-box status-vhost2">vhost2</div>'
                f'           <div class="status-box status-vhostbackup">vhostbackup</div>'
                f'       </div>'
                f'   </div>'
                f'</body>'
                f'</html>'
            )
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(response_html.encode())
        elif self.path == '/vhost1':
            self.handle_website_request("http://vhost1", "vhost1")
        elif self.path == '/vhost2':
            self.handle_website_request("http://vhost2", "vhost2")
        elif self.path == '/vhostbackup':
            self.handle_website_request("http://vhostbackup", "vhostbackup")
        else:
            super().do_GET()

    def handle_website_request(self, url, label):
        website_status = check_website_status(url)
        color = 'red' if website_status is None else 'green' if website_status == 200 else 'yellow'
        text_color = 'black' if color == 'yellow' else 'white'
        self.send_response(200)
        self.send_header('Content-type', 'text/html')
        self.end_headers()
        self.wfile.write(f'<div class="status-box status-{label.lower()} {color}" style="color: {text_color};">{label}</div>'.encode())

def run_server():
    port = 5000
    handler = RequestHandler

    with socketserver.TCPServer(("", port), handler) as httpd:
        print(f"Serving on port {port}")
        httpd.serve_forever()

if __name__ == '__main__':
    server_thread = threading.Thread(target=run_server)
    server_thread.start()

    while True:
        time.sleep(5)
        vhost1_status = check_website_status("http://vhost1")
        vhost2_status = check_website_status("http://vhost2")
        vhostbackup_status = check_website_status("http://vhostbackup")
        print(f"vhost1 Status: {vhost1_status}")
        print(f"vhost2 Status: {vhost2_status}")
        print(f"vhostbackup Status: {vhostbackup_status}")
