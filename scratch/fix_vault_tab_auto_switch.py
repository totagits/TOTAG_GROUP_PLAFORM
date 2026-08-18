import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    code = f.read()

# Replace onSaveInvoice={refetchInvoices} with onSaveInvoice={() => { refetchInvoices(); setActiveTab("invoices-vault"); }}
code = code.replace(
    '<InvoiceBuilder requests={requests} quotations={quotations} onSaveInvoice={refetchInvoices} />',
    '<InvoiceBuilder requests={requests} quotations={quotations} onSaveInvoice={() => { refetchInvoices(); setActiveTab("invoices-vault"); }} />'
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully updated onSaveInvoice in dashboard.tsx to auto-switch tab to invoices-vault!")
