import urllib.request
import json
import random

# 1. Login
login_url = "https://srv1902704.hstgr.cloud/api/catering/auth/login"
login_data = json.dumps({"username": "admin_toceps", "password": "Zwedru4gedeh"}).encode('utf-8')

req = urllib.request.Request(login_url, data=login_data, headers={"Content-Type": "application/json"})
with urllib.request.urlopen(req, timeout=10) as response:
    res = json.loads(response.read().decode('utf-8'))
    token = res.get("token")

# 2. Create invoice
inv_number = f"INV-TOCEPS-{random.randint(100000, 999999)}"
invoice_payload = {
    "invoiceNumber": inv_number,
    "clientName": "UNIDO Project Management Office",
    "clientCompany": "United Nations Industrial Development Organization (UNIDO)",
    "clientEmail": "rtalk4348@gmail.com",
    "clientPhone": "+231-777-900-100",
    "invoiceDate": "2026-08-18",
    "dueDate": "2026-08-28",
    "paymentTerms": "Net 30",
    "contractRef": "UNIDO Contract - Catering & Training Support (Article 4 Deliverable C)",
    "datesOfService": "5 August 2026 – 21 August 2026",
    "locationsServed": "Monrovia, Kakata & Buchanan Training Centers",
    "quantitiesDelivered": "1,450 Lunch Portions & Water Packs",
    "currency": "USD",
    "subtotal": "900.00",
    "totalAmount": "900.00",
    "paymentDetails": "Bank Transfer: TOTAG Group of Companies Ltd | Ecobank Liberia | Account: 6100984712 | SWIFT: ECOCLRMM",
    "status": "sent",
    "lineItems": [
        {
            "description": "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 5-10)",
            "serviceDates": "August 5-10, 2026",
            "location": "Monrovia Training Center",
            "quantity": 18,
            "unitPrice": 15.00,
            "total": 270.00
        },
        {
            "description": "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 14-17)",
            "serviceDates": "August 14-17, 2026",
            "location": "Kakata Technical Center",
            "quantity": 16,
            "unitPrice": 15.00,
            "total": 240.00
        },
        {
            "description": "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 18-21)",
            "serviceDates": "August 18-21, 2026",
            "location": "Buchanan Regional Center",
            "quantity": 26,
            "unitPrice": 15.00,
            "total": 390.00
        }
    ]
}

create_url = "https://srv1902704.hstgr.cloud/api/catering/invoices"
create_req = urllib.request.Request(create_url, data=json.dumps(invoice_payload).encode('utf-8'), headers={
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
})

with urllib.request.urlopen(create_req, timeout=15) as create_res:
    created_inv = json.loads(create_res.read().decode('utf-8'))
    print("NEW INVOICE CREATED:", created_inv.get("invoice", {}).get("invoiceNumber"), "ID:", created_inv.get("invoice", {}).get("id"))
    inv_id = created_inv.get("invoice", {}).get("id")

# 3. Dispatch Email
send_url = f"https://srv1902704.hstgr.cloud/api/catering/invoices/{inv_id}/send"
send_req = urllib.request.Request(send_url, data=b"{}", headers={
    "Content-Type": "application/json",
    "Authorization": f"Bearer {token}"
})

with urllib.request.urlopen(send_req, timeout=15) as send_res:
    send_data = json.loads(send_res.read().decode('utf-8'))
    print("DISPATCH RESULT FOR NEW INVOICE:", send_data)
