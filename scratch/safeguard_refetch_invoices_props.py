import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    code = f.read()

# Pass refetchInvoices and invoices props to AccountManagerView & OperationsSupervisorView in CateringOpsDashboard
code = code.replace(
    '<AccountManagerView requests={requests}',
    '<AccountManagerView invoices={invoices} refetchInvoices={refetchInvoices} requests={requests}'
)

code = code.replace(
    '<OperationsSupervisorView events={events}',
    '<OperationsSupervisorView invoices={invoices} refetchInvoices={refetchInvoices} events={events}'
)

# Update component parameter signatures to include refetchInvoices and invoices
code = code.replace(
    'function AccountManagerView({ requests, events, staff, allTasks, quotations, loading, onUpdateRequest, onCreateEvent, onCreateTask, onCreateQuotation, onUpdateQuotation }: any) {',
    'function AccountManagerView({ invoices: propInvoices, refetchInvoices: propRefetchInvoices, requests, events, staff, allTasks, quotations, loading, onUpdateRequest, onCreateEvent, onCreateTask, onCreateQuotation, onUpdateQuotation }: any) {'
)

code = code.replace(
    'function OperationsSupervisorView({ events, allTasks, staff, requests, quotations, loading, onCreateTask, onUpdateTask, onUpdateEvent, onCreateEvent, onUpdateRequest, onDeleteRequest, onCreateQuotation, onUpdateQuotation, onSaveAndSendQuotation, onSendQuotation, isSending }: any) {',
    'function OperationsSupervisorView({ invoices: propInvoices, refetchInvoices: propRefetchInvoices, events, allTasks, staff, requests, quotations, loading, onCreateTask, onUpdateTask, onUpdateEvent, onCreateEvent, onUpdateRequest, onDeleteRequest, onCreateQuotation, onUpdateQuotation, onSaveAndSendQuotation, onSendQuotation, isSending }: any) {'
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Safeguarded refetchInvoices and invoices props across all dashboard views!")
