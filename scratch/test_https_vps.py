import urllib.request
import ssl
import json

# Ignore SSL self-signed / hostname mismatch if any for testing
ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE

urls = [
    "https://srv1902704.hstgr.cloud/api/catering/auth/login",
    "https://2.24.115.245/api/catering/auth/login",
]

login_data = json.dumps({"username": "admin_toceps", "password": "Zwedru4gedeh"}).encode('utf-8')

for url in urls:
    print(f"Testing HTTPS endpoint: {url}")
    req = urllib.request.Request(url, data=login_data, headers={"Content-Type": "application/json"})
    try:
        with urllib.request.urlopen(req, context=ctx, timeout=10) as response:
            res_data = json.loads(response.read().decode('utf-8'))
            print(f"✅ HTTPS SUCCESS on {url}:", res_data.get("success"))
    except Exception as e:
        print(f"❌ HTTPS FAILED on {url}:", e)
