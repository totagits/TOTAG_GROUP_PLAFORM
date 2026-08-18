import smtplib
import sys

app_pass = "fdq3s5SdrBx0"

emails_to_test = [
    "toceps@totaggroup.com",
    "info@totaggroup.com",
    "admin@totaggroup.com",
    "support@totaggroup.com",
    "sales@totaggroup.com",
    "contact@totaggroup.com"
]

hosts = [
    ("smtppro.zoho.com", 465),
    ("smtp.zoho.com", 465),
    ("smtppro.zoho.com", 587),
    ("smtp.zoho.com", 587)
]

working_credentials = None

for host, port in hosts:
    if working_credentials: break
    for email in emails_to_test:
        try:
            print(f"Testing {host}:{port} with {email}...")
            if port == 465:
                server = smtplib.SMTP_SSL(host, port, timeout=10)
            else:
                server = smtplib.SMTP(host, port, timeout=10)
                server.starttls()
            server.login(email, app_pass)
            print(f"SUCCESSFUL ZOHO SMTP LOGIN: {host}:{port} | {email}")
            working_credentials = (host, port, email, app_pass)
            server.quit()
            break
        except Exception as e:
            print(f"Failed for {email} on {host}:{port}: {e}")

if working_credentials:
    print(f"\nSUCCESS! Working credentials: {working_credentials}")
else:
    print("\nCould not authenticate with listed email prefixes. Testing generic...")
