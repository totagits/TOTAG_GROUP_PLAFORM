import urllib.request
import json

url = "https://srv1902704.hstgr.cloud/api/catering/invoices"
req = urllib.request.Request(url, method="OPTIONS")
req.add_header("Origin", "https://totag.network")
req.add_header("Access-Control-Request-Method", "POST")
req.add_header("Access-Control-Request-Headers", "authorization,content-type")

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        print("OPTIONS STATUS:", response.status)
        print("OPTIONS HEADERS:", dict(response.headers))
except Exception as e:
    print("OPTIONS FAILED:", e)
    if hasattr(e, 'headers'):
        print("Error headers:", dict(e.headers))
