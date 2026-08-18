import urllib.request
import json

# 1. Login to get JWT token
login_url = "https://srv1902704.hstgr.cloud/api/catering/auth/login"
login_data = json.dumps({"username": "admin_toceps", "password": "Zwedru4gedeh"}).encode('utf-8')

req = urllib.request.Request(login_url, data=login_data, headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=10) as response:
    res = json.loads(response.read().decode('utf-8'))
    token = res.get("token")
    print("JWT Token obtained:", bool(token))

# 2. Dispatch email for invoice ID 4 (INV-TOCEPS-880219)
send_url = "https://srv1902704.hstgr.cloud/api/catering/invoices/4/send"
send_req = urllib.request.Request(send_url, data=b"{}", headers={
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
})

with urllib.request.urlopen(send_req, timeout=15) as send_res:
    send_data = json.loads(send_res.read().decode('utf-8'))
    print("LIVE EMAIL DISPATCH RESULT:", send_data)
