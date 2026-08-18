import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

passwords_to_test = [
    "Zwedru4@gedeh",
    "Zwedru4gedeh",
]

emails_to_test = [
    "toceps@totaggroup.com",
    "info@totaggroup.com",
    "admin@totaggroup.com"
]

hosts = [
    ("smtppro.zoho.com", 465),
    ("smtp.zoho.com", 465),
    ("smtppro.zoho.com", 587),
]

working_combo = None

for host, port in hosts:
    if working_combo: break
    for email in emails_to_test:
        if working_combo: break
        for pwd in passwords_to_test:
            try:
                print(f"Testing {host}:{port} with {email} / {pwd[:3]}***...")
                if port == 465:
                    server = smtplib.SMTP_SSL(host, port, timeout=10)
                else:
                    server = smtplib.SMTP(host, port, timeout=10)
                    server.starttls()
                server.login(email, pwd)
                print(f"✅ SUCCESSFUL LOGIN: {host}:{port} | {email} | {pwd}")
                working_combo = (host, port, email, pwd)
                server.quit()
                break
            except Exception as e:
                print(f"❌ Failed for {email} on {host}:", e)

if working_combo:
    print("\nFound working Zoho SMTP credentials!")
else:
    print("\nNo automatic match with default passwords. Zoho App Password required.")
