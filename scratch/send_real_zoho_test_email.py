import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

smtp_host = "smtp.zoho.com"
smtp_port = 465
smtp_user = "info@totaggroup.com"
smtp_pass = "fdq3s5SdrBx0"
recipient = "rtalk4348@gmail.com"

msg = MIMEMultipart("alternative")
msg["Subject"] = "[OFFICIAL INVOICE INV-TOCEPS-880219] TOTAG Group — UNIDO Contract Deliverable C"
msg["From"] = f"TOTAG Group of Companies <{smtp_user}>"
msg["To"] = recipient
msg["Reply-To"] = "toceps@totaggroup.com"

html = """
<!DOCTYPE html>
<html>
<head>
<style>
  body { font-family: Arial, sans-serif; background-color: #f4f6f9; margin: 0; padding: 20px; }
  .container { max-width: 650px; background: #ffffff; margin: 0 auto; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0; box-shadow: 0 10px 25px rgba(0,0,0,0.05); }
  .header { border-bottom: 2px solid #10b981; padding-bottom: 20px; margin-bottom: 20px; display: flex; justify-content: space-between; }
  .brand { font-size: 20px; font-weight: 900; color: #0f172a; }
  .sub-brand { font-size: 13px; font-weight: 700; color: #059669; }
  .badge { background: #dcfce7; color: #166534; padding: 6px 14px; border-radius: 20px; font-weight: 800; font-size: 11px; }
  .audit-box { background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 15px; margin: 20px 0; }
  .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
  .table th { background: #0f172a; color: #ffffff; padding: 10px; text-align: left; font-size: 12px; }
  .table td { padding: 10px; border-bottom: 1px solid #e2e8f0; font-size: 12px; }
  .total-box { background: #f8fafc; padding: 15px; border-radius: 12px; border: 1px solid #e2e8f0; text-align: right; }
  .amount { font-size: 22px; font-weight: 900; color: #047857; }
</style>
</head>
<body>
<div class="container">
  <div class="header">
    <div>
      <div class="brand">TOTAG Group of Companies Ltd</div>
      <div class="sub-brand">TOCEPS Catering & Events Services</div>
    </div>
    <div>
      <span class="badge">OFFICIAL INVOICE</span>
    </div>
  </div>

  <p>Dear UNIDO Project Management Team,</p>
  <p>Please find official Invoice <strong>INV-TOCEPS-880219</strong> for UNIDO Catering & Training Support (Article 4 Deliverable C).</p>

  <div class="audit-box">
    <strong style="color: #065f46;">UNIDO CONTRACT AUDIT DELIVERABLES</strong><br>
    • <strong>Dates of Service:</strong> 5 August 2026 – 21 August 2026<br>
    • <strong>Locations Served:</strong> Monrovia, Kakata & Buchanan Training Centers<br>
    • <strong>Quantities Delivered:</strong> 1,450 Lunch Portions & Water Packs
  </div>

  <table class="table">
    <thead>
      <tr>
        <th>Description</th>
        <th style="text-align: center;">Qty</th>
        <th style="text-align: right;">Unit Price</th>
        <th style="text-align: right;">Total</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>UNIDO Deliverable B: Provision & delivery of lunch portions & water packs (Monrovia)</td>
        <td style="text-align: center;">26</td>
        <td style="text-align: right;">USD 15.00</td>
        <td style="text-align: right;"><strong>USD 390.00</strong></td>
      </tr>
      <tr>
        <td>UNIDO Deliverable B: Provision & delivery of lunch portions & water packs (Kakata)</td>
        <td style="text-align: center;">16</td>
        <td style="text-align: right;">USD 15.00</td>
        <td style="text-align: right;"><strong>USD 240.00</strong></td>
      </tr>
      <tr>
        <td>UNIDO Deliverable B: Provision & delivery of lunch portions & water packs (Buchanan)</td>
        <td style="text-align: center;">18</td>
        <td style="text-align: right;">USD 15.00</td>
        <td style="text-align: right;"><strong>USD 270.00</strong></td>
      </tr>
    </tbody>
  </table>

  <div class="total-box">
    <div style="font-size: 12px; color: #64748b;">Total Amount Due</div>
    <div class="amount">USD 900.00</div>
    <div style="font-size: 11px; color: #64748b; margin-top: 5px;">Payment Due Date: Net 30 | Bank Transfer: Ecobank Liberia Acc 6100984712</div>
  </div>

  <p style="font-size: 12px; color: #64748b; margin-top: 30px;">
    Best regards,<br>
    <strong>TOCEPS Billing & Finance Team</strong><br>
    TOTAG Group of Companies Ltd | Monrovia, Liberia
  </p>
</div>
</body>
</html>
"""

msg.attach(MIMEText(html, "html"))

print(f"Connecting to {smtp_host}:{smtp_port}...")
server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15)
server.login(smtp_user, smtp_pass)
server.sendmail(smtp_user, [recipient], msg.as_string())
server.quit()

print(f"🎉 LIVE INVOICE EMAIL DISPATCHED TO {recipient} SUCCESSFULLY!")
