#!/bin/bash

set -o errexit
set -o xtrace

rm alwaysai.app.json

cat >app.py <<EOF
import http.server
import socketserver

PORT = 5000

httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print("Listening http://localhost:{}".format(PORT))
httpd.serve_forever()
EOF

alwaysai app init --yes
alwaysai app models search
alwaysai app models add alwaysai/agenet
