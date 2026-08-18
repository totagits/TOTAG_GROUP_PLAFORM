import urllib.request
import json

url = "https://srv1902704.hstgr.cloud/api/catering/auth/login"
data = json.dumps({"username": "admin_toceps", "password": "Zwedru4gedeh"}).encode('utf-8')
req = urllib.request.Request(url, data=data, method="POST")
req.add_header("Origin", "https://totag.network")
req.add_header("Content-Type", "application/json")

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        print("POST STATUS:", response.status)
        print("POST HEADERS:", dict(response.headers))
        print("POST RESPONSE:", response.read().decode('utf-8'))
except Exception as e:
    print("POST FAILED:", e)
    if hasattr(e, 'headers'):
        print("Error headers:", dict(e.headers))
