import json
import socket
import subprocess
import threading
import time

# Define the LSP client class
class LSPClient:
    def __init__(self, server_command):
        self.server_command = server_command
        self.process = None
        self.socket = None

    def start_server(self):
        # Start the language server process
        self.process = subprocess.Popen(
            self.server_command,
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        time.sleep(1)  # Give the server time to start

    def connect(self):
        # Create a socket connection to the language server
        self.socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        self.socket.connect(('localhost', 2087))  # Assuming the server listens on port 2087

    def send_request(self, method, params):
        request_id = 1  # Simple request ID
        request = {
            'jsonrpc': '2.0',
            'id': request_id,
            'method': method,
            'params': params
        }
        self.socket.sendall(json.dumps(request).encode('utf-8') + b'\n')

    def receive_response(self):
        response = self.socket.recv(4096).decode('utf-8')
        return json.loads(response)

    def close(self):
        if self.socket:
            self.socket.close()
        if self.process:
            self.process.terminate()

# Example usage
if __name__ == "__main__":
    # Replace with the actual command to start your language server
    lsp_server_command = ['path/to/your/language-server', '--stdio']

    client = LSPClient(lsp_server_command)
    client.start_server()
    client.connect()

    # Example request to initialize the LSP server
    client.send_request('initialize', {
        'processId': None,
        'rootUri': 'file:///path/to/your/project',
        'capabilities': {}
    })

    response = client.receive_response()
    print("Initialize Response:", response)


    # Example request to shutdown the LSP server
    client.send_request('shutdown', {})
    response = client.receive_response()
    print("Shutdown Response:", response)

    client.close()
