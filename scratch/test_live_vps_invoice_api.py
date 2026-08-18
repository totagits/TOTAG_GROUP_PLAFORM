import urllib.request
import json
import time

login_url = "https://totag.network/api/catering/auth/login"
login_data = json.dumps({"username": "admin_toceps", "password": "Zwedru4gedeh"}).encode('utf-8')

req = urllib.request.Request(login_url, data=login_data, headers={"Content-Type": "application/json"})
try:
    with urllib.request.urlopen(req) as response:
        res_data = json.loads(response.read().decode('utf-8'))
        print("LIVE VPS Login response:", res_data)
        token = res_data.get("token")

    if token:
        inv_url = "https://totag.network/api/catering/invoices"
        inv_payload = json.dumps({
            "invoiceNumber": f"INV-UNIDO-TEST-{int(time.time())}",
            "clientName": "UNIDO Project Office Test",
            "clientEmail": "unido-procurement@unido.org",
            "clientPhone": "+231-777-100-200",
            "clientCompany": "UNIDO",
            "contractRef": "UNIDO Contract Article 4 Deliverable C",
            "invoiceDate": "2026-08-18",
            "dueDate": "2026-08-28",
            "paymentTerms": "Net 30",
            "currency": "USD",
            "datesOfService": "5-21 August 2026",
            "locationsServed": "Monrovia, Kakata, Buchanan",
            "quantitiesDelivered": "1,450 Portions & Water Packs",
            "lineItems": [{"description": "Provision & delivery of lunch portions & water packs", "quantity": 10, "unitPrice": 12.5, "total": 125.0}],
            "subtotal": "125.00",
            "taxRate": "0",
            "taxAmount": "0.00",
            "discount": "0.00",
            "totalAmount": "125.00",
            "paymentDetails": "Bank Transfer: TOTAG Group of Companies Ltd | Ecobank Liberia | Account: 6100984712",
            "notes": "Test invoice generation from automated verification script",
            "status": "issued",
            "vaultSaved": True
        }).encode('utf-8')

        inv_req = urllib.request.Request(inv_url, data=inv_payload, headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}"
        })
        with urllib.request.urlopen(inv_req) as inv_response:
            inv_res_data = json.loads(inv_response.read().decode('utf-8'))
            print("LIVE VPS Invoice Creation Response:", inv_res_data)
except Exception as e:
    print("Error during LIVE VPS test:", e)
    if hasattr(e, 'read'):
        print("Error details:", e.read().decode('utf-8'))
