#!/bin/bash

set -o errexit
set -o xtrace

cat >app.py <<EOF
import http.server
import socketserver

PORT = 5000

httpd = socketserver.TCPServer(("", PORT), http.server.SimpleHTTPRequestHandler)
print("Listening http://localhost:{}".format(PORT))
httpd.serve_forever()
EOF

rm -f alwaysai.app.json
alwaysai app init --yes
alwaysai app models search
alwaysai app models add alwaysai/squeezenet alwaysai/SqueezenetSSD
