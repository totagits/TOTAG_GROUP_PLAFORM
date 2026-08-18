import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    code = f.read()

# Add invoice query inside AccountManagerView
account_mgr_search = 'function AccountManagerView({ requests, events, staff, allTasks, quotations, loading, onUpdateRequest, onCreateEvent, onCreateTask, onCreateQuotation, onUpdateQuotation }: any) {'
account_mgr_replace = '''function AccountManagerView({ requests, events, staff, allTasks, quotations, loading, onUpdateRequest, onCreateEvent, onCreateTask, onCreateQuotation, onUpdateQuotation }: any) {
  const { data: invoicesData, refetch: refetchInvoices } = useQuery({
    queryKey: ["/api/catering/invoices"],
    queryFn: () => cateringFetch("/api/catering/invoices"),
  });
  const invoices = invoicesData?.invoices || [];'''

if account_mgr_search in code:
    code = code.replace(account_mgr_search, account_mgr_replace)
    print("Fixed AccountManagerView invoice query & refetchInvoices definition!")
else:
    print("Could not find AccountManagerView search string!")

# Add invoice query inside OperationsSupervisorView
ops_sup_search = 'function OperationsSupervisorView({ events, allTasks, staff, requests, quotations, loading, onCreateTask, onUpdateTask, onUpdateEvent, onCreateEvent, onUpdateRequest, onDeleteRequest, onCreateQuotation, onUpdateQuotation, onSaveAndSendQuotation, onSendQuotation, isSending }: any) {'
ops_sup_replace = '''function OperationsSupervisorView({ events, allTasks, staff, requests, quotations, loading, onCreateTask, onUpdateTask, onUpdateEvent, onCreateEvent, onUpdateRequest, onDeleteRequest, onCreateQuotation, onUpdateQuotation, onSaveAndSendQuotation, onSendQuotation, isSending }: any) {
  const { data: invoicesData, refetch: refetchInvoices } = useQuery({
    queryKey: ["/api/catering/invoices"],
    queryFn: () => cateringFetch("/api/catering/invoices"),
  });
  const invoices = invoicesData?.invoices || [];'''

if ops_sup_search in code:
    code = code.replace(ops_sup_search, ops_sup_replace)
    print("Fixed OperationsSupervisorView invoice query & refetchInvoices definition!")
else:
    print("Could not find OperationsSupervisorView search string!")

# Also add TabsContent for invoice-builder & invoices-vault in OperationsSupervisorView if missing
ops_tabs_content = '''
      <TabsContent value="invoice-builder">
        <InvoiceBuilder requests={requests} quotations={quotations} onSaveInvoice={refetchInvoices} />
      </TabsContent>

      <TabsContent value="invoices-vault">
        <InvoicesVault invoices={invoices} onRefresh={refetchInvoices} />
      </TabsContent>
'''

if '<TabsContent value="resource-plan">' in code and ops_tabs_content not in code.split('function OperationsSupervisorView')[1]:
    parts = code.split('function OperationsSupervisorView')
    parts[1] = parts[1].replace('<TabsContent value="resource-plan">', ops_tabs_content + '\n      <TabsContent value="resource-plan">', 1)
    code = 'function OperationsSupervisorView'.join(parts)
    print("Added TabsContent for invoice-builder & invoices-vault to OperationsSupervisorView!")

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Saved fix to dashboard.tsx!")
