import re

dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"

with open(dashboard_path, "r", encoding="utf-8") as f:
    code = f.read()

# Invoice Builder & Invoices Vault components
invoice_components_code = '''
// ===== INVOICE BUILDER & DOCUMENT VAULT =====
function InvoiceBuilder({ requests, quotations, onSaveInvoice, onSendInvoice }: any) {
  const [clientName, setClientName] = useState("UNIDO Project Management Office");
  const [clientEmail, setClientEmail] = useState("unido-procurement@unido.org");
  const [clientPhone, setClientPhone] = useState("+231-777-900-100");
  const [clientCompany, setClientCompany] = useState("United Nations Industrial Development Organization (UNIDO)");
  const [contractRef, setContractRef] = useState("UNIDO Contract - Catering & Training Support (Article 4 Deliverable C)");
  const [invoiceDate, setInvoiceDate] = useState(new Date().toISOString().split("T")[0]);
  const [dueDate, setDueDate] = useState("2026-08-28");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [currency, setCurrency] = useState("USD");
  
  // UNIDO Contract Article 4 Deliverable fields
  const [datesOfService, setDatesOfService] = useState("5 August 2026 – 21 August 2026");
  const [locationsServed, setLocationsServed] = useState("Monrovia, Kakata & Buchanan Training Centers");
  const [quantitiesDelivered, setQuantitiesDelivered] = useState("1,450 Lunch Portions & Water Packs");
  
  const [lineItems, setLineItems] = useState([
    { description: "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 5-10)", datesOfService: "August 5-10, 2026", location: "Monrovia Training Center", quantity: 450, unitPrice: 12.50, total: 5625.00 },
    { description: "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 14-17)", datesOfService: "August 14-17, 2026", location: "Kakata Technical Center", quantity: 500, unitPrice: 12.50, total: 6250.00 },
    { description: "UNIDO Deliverable B: Provision & delivery of lunch portions & drinking water per participant (August 18-21)", datesOfService: "August 18-21, 2026", location: "Buchanan Regional Center", quantity: 500, unitPrice: 12.50, total: 6250.00 },
  ]);
  
  const [subtotal, setSubtotal] = useState(18125.00);
  const [taxRate, setTaxRate] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [totalAmount, setTotalAmount] = useState(18125.00);
  const [paymentDetails, setPaymentDetails] = useState("Bank Transfer: TOTAG Group of Companies Ltd | Ecobank Liberia | Account: 6100984712 | SWIFT: ECOCLRMM");
  const [notes, setNotes] = useState("Final invoice for UNIDO Article 4 Deliverable C. Dates of service, locations served, and quantities delivered confirmed.");
  const [submitting, setSubmitting] = useState(false);
  const { toast } = useToast();

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    (updated[index] as any)[field] = value;
    if (field === "quantity" || field === "unitPrice") {
      const q = parseFloat(updated[index].quantity as any) || 0;
      const u = parseFloat(updated[index].unitPrice as any) || 0;
      updated[index].total = q * u;
    }
    setLineItems(updated);
    recalculateTotals(updated, taxRate, discount);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: "Additional Catering Service", datesOfService: "", location: "", quantity: 1, unitPrice: 10, total: 10 }]);
  };

  const removeLineItem = (index: number) => {
    const updated = lineItems.filter((_, i) => i !== index);
    setLineItems(updated);
    recalculateTotals(updated, taxRate, discount);
  };

  const recalculateTotals = (items: any[], tax: number, disc: number) => {
    const sub = items.reduce((sum, item) => sum + (parseFloat(item.total) || 0), 0);
    const taxAmt = (sub * tax) / 100;
    const tot = sub + taxAmt - disc;
    setSubtotal(sub);
    setTaxAmount(taxAmt);
    setTotalAmount(tot > 0 ? tot : 0);
  };

  const handleCreateInvoice = async (sendImmediately: boolean = false) => {
    setSubmitting(true);
    try {
      const invNumber = `INV-TOCEPS-${Date.now().toString().slice(-6)}`;
      const payload = {
        invoiceNumber: invNumber,
        clientName,
        clientEmail,
        clientPhone,
        clientCompany,
        contractRef,
        invoiceDate,
        dueDate,
        paymentTerms,
        currency,
        datesOfService,
        locationsServed,
        quantitiesDelivered,
        lineItems,
        subtotal: String(subtotal),
        taxRate: String(taxRate),
        taxAmount: String(taxAmount),
        discount: String(discount),
        totalAmount: String(totalAmount),
        paymentDetails,
        notes,
        status: sendImmediately ? "sent" : "issued",
        vaultSaved: true,
      };

      const res = await cateringFetch("/api/catering/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res && res.success) {
        toast({
          title: "Invoice Generated & Saved to Vault",
          description: `Official Invoice ${res.invoice.invoiceNumber} created and saved in Document Vault!`
        });

        if (sendImmediately) {
          await cateringFetch(`/api/catering/invoices/${res.invoice.id}/send`, { method: "POST" });
          toast({
            title: "Invoice Dispatched to Client",
            description: `Emailed invoice to ${clientEmail}`
          });
        }

        if (onSaveInvoice) onSaveInvoice();
      } else {
        toast({ title: "Failed to Create Invoice", description: res?.error || "Error generating invoice", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Connection error", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="border border-slate-200 dark:border-white/10 shadow-xl bg-white/95 dark:bg-slate-900/95">
        <CardHeader className="border-b border-slate-200 dark:border-white/10 pb-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                <FileSpreadsheet className="w-6 h-6 text-emerald-500" />
                TOTAG GROUP Official Invoice Builder
              </CardTitle>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Create binding enterprise invoices with UNIDO contract audit compliance, auto-archive to Document Vault, & client email dispatch
              </p>
            </div>
            <Badge className="bg-emerald-500/20 text-emerald-500 text-xs font-extrabold px-3 py-1 self-start md:self-auto">
              UNIDO Deliverable C Compliant
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="pt-6 space-y-6">
          
          {/* Client & Contract Metadata */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-bold">Client / Organization Name</Label>
              <Input value={clientName} onChange={e => setClientName(e.target.value)} className="text-xs rounded-xl mt-1" required />
            </div>
            <div>
              <Label className="text-xs font-bold">Client Email</Label>
              <Input type="email" value={clientEmail} onChange={e => setClientEmail(e.target.value)} className="text-xs rounded-xl mt-1" required />
            </div>
            <div>
              <Label className="text-xs font-bold">Phone Number</Label>
              <Input value={clientPhone} onChange={e => setClientPhone(e.target.value)} className="text-xs rounded-xl mt-1" />
            </div>
            <div>
              <Label className="text-xs font-bold">Organization / Company</Label>
              <Input value={clientCompany} onChange={e => setClientCompany(e.target.value)} className="text-xs rounded-xl mt-1" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="text-xs font-bold text-amber-500">Contract Reference / Project</Label>
              <Input value={contractRef} onChange={e => setContractRef(e.target.value)} className="text-xs rounded-xl mt-1 border-amber-500/40" />
            </div>
            <div>
              <Label className="text-xs font-bold">Invoice Date</Label>
              <Input type="date" value={invoiceDate} onChange={e => setInvoiceDate(e.target.value)} className="text-xs rounded-xl mt-1" required />
            </div>
            <div>
              <Label className="text-xs font-bold text-red-500">Payment Due Date</Label>
              <Input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="text-xs rounded-xl mt-1 border-red-500/40" required />
            </div>
            <div>
              <Label className="text-xs font-bold">Payment Terms & Currency</Label>
              <div className="grid grid-cols-2 gap-2 mt-1">
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger className="text-xs rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 30">Net 30</SelectItem>
                    <SelectItem value="Net 15">Net 15</SelectItem>
                    <SelectItem value="Due Upon Receipt">Due Upon Receipt</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="text-xs rounded-xl"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="LRD">LRD (L$)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* UNIDO Contract Audit Compliance Fields */}
          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-extrabold text-emerald-500 uppercase tracking-wider flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                UNIDO Contract Audit Deliverable Compliance (Dates, Locations & Quantities)
              </h4>
              <Badge className="bg-emerald-500 text-slate-950 text-[10px] font-black">Audit Verified</Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <Label className="text-[11px] font-bold text-slate-300">Dates of Service Rendered</Label>
                <Input value={datesOfService} onChange={e => setDatesOfService(e.target.value)} placeholder="e.g. 5 August 2026 – 21 August 2026" className="text-xs rounded-xl mt-1 bg-slate-900/80 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-slate-300">Locations Served</Label>
                <Input value={locationsServed} onChange={e => setLocationsServed(e.target.value)} placeholder="e.g. Monrovia, Kakata & Buchanan" className="text-xs rounded-xl mt-1 bg-slate-900/80 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-[11px] font-bold text-slate-300">Quantities Delivered</Label>
                <Input value={quantitiesDelivered} onChange={e => setQuantitiesDelivered(e.target.value)} placeholder="e.g. 1,450 Meals & Water Packs" className="text-xs rounded-xl mt-1 bg-slate-900/80 border-white/10 text-white" />
              </div>
            </div>
          </div>

          {/* Itemized Line Items Table */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-black uppercase text-slate-700 dark:text-slate-300">Itemized Invoice Line Items</Label>
              <Button type="button" variant="outline" size="sm" onClick={addLineItem} className="text-xs font-bold rounded-xl flex items-center gap-1">
                <Plus className="w-3.5 h-3.5" /> Add Line Item
              </Button>
            </div>

            <div className="space-y-2">
              {lineItems.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 md:grid-cols-12 gap-2 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-white/10 items-center">
                  <div className="md:col-span-5">
                    <Input value={item.description} onChange={e => handleLineItemChange(idx, "description", e.target.value)} placeholder="Service description..." className="text-xs rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <Input value={item.datesOfService || ""} onChange={e => handleLineItemChange(idx, "datesOfService", e.target.value)} placeholder="Dates..." className="text-xs rounded-lg" />
                  </div>
                  <div className="md:col-span-2">
                    <Input value={item.location || ""} onChange={e => handleLineItemChange(idx, "location", e.target.value)} placeholder="Location..." className="text-xs rounded-lg" />
                  </div>
                  <div className="md:col-span-1">
                    <Input type="number" value={item.quantity} onChange={e => handleLineItemChange(idx, "quantity", e.target.value)} placeholder="Qty" className="text-xs rounded-lg text-center" />
                  </div>
                  <div className="md:col-span-1">
                    <Input type="number" value={item.unitPrice} onChange={e => handleLineItemChange(idx, "unitPrice", e.target.value)} placeholder="Price" className="text-xs rounded-lg text-right" />
                  </div>
                  <div className="md:col-span-1 flex items-center justify-between">
                    <span className="text-xs font-bold">{currency} {parseFloat(item.total as any || 0).toFixed(2)}</span>
                    {lineItems.length > 1 && (
                      <button type="button" onClick={() => removeLineItem(idx)} className="text-red-500 hover:text-red-400 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Totals & Bank Instructions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-200 dark:border-white/10">
            <div>
              <Label className="text-xs font-bold text-amber-500">Payment & Bank Transfer Settlement Instructions</Label>
              <Textarea value={paymentDetails} onChange={e => setPaymentDetails(e.target.value)} rows={3} className="text-xs rounded-xl mt-1 font-mono" />
            </div>

            <div className="space-y-2 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
              <div className="flex justify-between text-xs font-bold">
                <span>Subtotal:</span>
                <span>{currency} {subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Tax Amount:</span>
                <span>{currency} {taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs text-red-500">
                <span>Discount:</span>
                <span>-{currency} {discount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-black pt-2 border-t border-slate-300 dark:border-white/10 text-emerald-600 dark:text-emerald-400">
                <span>Total Amount Due:</span>
                <span>{currency} {totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-white/10">
            <Button 
              type="button" 
              onClick={() => handleCreateInvoice(false)}
              disabled={submitting}
              className="w-full sm:w-auto bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs px-5 py-2.5 rounded-xl shadow-md flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Save to Document Vault
            </Button>
            <Button 
              type="button" 
              onClick={() => handleCreateInvoice(true)}
              disabled={submitting}
              className="w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs px-6 py-2.5 rounded-xl shadow-lg flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Generate, Save Vault & Dispatch Email to Client
            </Button>
          </div>

        </CardContent>
      </Card>
    </div>
  );
}

function InvoicesVault({ invoices, onRefresh }: { invoices: any[]; onRefresh?: () => void }) {
  const [selectedInvoice, setSelectedInvoice] = useState<any | null>(null);
  const [sending, setSending] = useState(false);
  const { toast } = useToast();

  const handleSendInvoiceEmail = async (invId: number) => {
    setSending(true);
    try {
      const res = await cateringFetch(`/api/catering/invoices/${invId}/send`, { method: "POST" });
      if (res && res.success) {
        toast({ title: "Invoice Dispatched", description: res.message });
        if (onRefresh) onRefresh();
      } else {
        toast({ title: "Email Failed", description: res?.error || "Could not send email", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to dispatch email", variant: "destructive" });
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (invId: number, newStatus: string) => {
    try {
      const res = await cateringFetch(`/api/catering/invoices/${invId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (res && res.success) {
        toast({ title: "Invoice Updated", description: `Marked invoice as ${newStatus.toUpperCase()}` });
        if (onRefresh) onRefresh();
      }
    } catch {
      toast({ title: "Error", description: "Failed to update invoice", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between p-4 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 shadow-lg">
        <div>
          <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5 text-emerald-500" />
            TOCEPS Executive Document & Invoice Vault
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Archived enterprise invoices, UNIDO contract audit compliance logs, & billing settlement tracker
          </p>
        </div>
        <Badge className="bg-emerald-500/20 text-emerald-500 font-bold text-xs">
          {invoices.length} Invoices Archived
        </Badge>
      </div>

      {invoices.length === 0 ? (
        <Card><CardContent className="py-12 text-center text-slate-500">No archived invoices in Document Vault yet</CardContent></Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {invoices.map((inv: any) => (
            <Card key={inv.id} className="border border-slate-200 dark:border-white/10 rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden bg-white/95 dark:bg-slate-900/95">
              <CardContent className="p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-mono font-bold text-emerald-500 text-xs">
                      INV
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                        {inv.invoiceNumber}
                        <Badge className={inv.status === "paid" ? "bg-emerald-500 text-slate-950 text-[10px] font-extrabold" : "bg-amber-500/20 text-amber-400 text-[10px] font-extrabold"}>
                          {inv.status.toUpperCase()}
                        </Badge>
                      </h4>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300">{inv.clientName} ({inv.clientCompany || "Client"})</p>
                      {inv.contractRef && <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">Contract: {inv.contractRef}</p>}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-lg font-black text-emerald-600 dark:text-emerald-400 block">{inv.currency} {parseFloat(inv.totalAmount || 0).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                    <span className="text-[11px] text-slate-400 block">Due: {inv.dueDate}</span>
                  </div>
                </div>

                {/* Audit details snippet */}
                {(inv.datesOfService || inv.locationsServed) && (
                  <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-white/5 text-xs space-y-1">
                    {inv.datesOfService && <p className="text-slate-600 dark:text-slate-300">📅 <strong>Service Dates:</strong> {inv.datesOfService}</p>}
                    {inv.locationsServed && <p className="text-slate-600 dark:text-slate-300">📍 <strong>Locations:</strong> {inv.locationsServed}</p>}
                    {inv.quantitiesDelivered && <p className="text-slate-600 dark:text-slate-300">📦 <strong>Quantities Delivered:</strong> {inv.quantitiesDelivered}</p>}
                  </div>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-white/5">
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setSelectedInvoice(inv)} className="text-xs font-bold rounded-xl">
                      <Eye className="w-3.5 h-3.5 mr-1 text-emerald-500" /> View & Print Invoice
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => handleSendInvoiceEmail(inv.id)} disabled={sending} className="text-xs font-bold rounded-xl text-sky-400 border-sky-400/30">
                      <Send className="w-3.5 h-3.5 mr-1" /> {sending ? "Sending..." : "Resend Email"}
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {inv.status !== "paid" && (
                      <Button size="sm" onClick={() => handleUpdateStatus(inv.id, "paid")} className="text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white">
                        <CheckCircle className="w-3.5 h-3.5 mr-1" /> Mark Paid
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* PRINTABLE INVOICE MODAL */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-3xl bg-white text-slate-900 border border-slate-200 rounded-3xl p-8 max-h-[90vh] overflow-y-auto">
          {selectedInvoice && (
            <div className="space-y-6">
              
              {/* Header */}
              <div className="flex justify-between items-start border-b pb-6">
                <div className="flex items-center gap-3">
                  <img src="/images/totag-logo.png" alt="TOTAG Group" className="h-14 w-auto object-contain bg-white p-1 rounded-xl border" />
                  <div>
                    <h2 className="text-xl font-black text-slate-900">TOTAG Group of Companies Ltd</h2>
                    <p className="text-xs text-emerald-600 font-bold">TOCEPS Catering & Events Services</p>
                    <p className="text-[11px] text-slate-500">Monrovia, Liberia | Email: toceps@totaggroup.com</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                    {selectedInvoice.status.toUpperCase()} INVOICE
                  </span>
                  <p className="text-lg font-mono font-bold mt-2 text-slate-900">{selectedInvoice.invoiceNumber}</p>
                </div>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-6 bg-slate-50 p-4 rounded-2xl border">
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Billed To</h4>
                  <p className="text-sm font-bold text-slate-900 mt-1">{selectedInvoice.clientName}</p>
                  <p className="text-xs text-slate-600 font-semibold">{selectedInvoice.clientCompany}</p>
                  <p className="text-xs text-slate-500">{selectedInvoice.clientEmail} | {selectedInvoice.clientPhone}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-500 uppercase">Billing Details</h4>
                  <p className="text-xs text-slate-700 mt-1"><strong>Invoice Date:</strong> {selectedInvoice.invoiceDate}</p>
                  <p className="text-xs text-slate-700"><strong>Due Date:</strong> {selectedInvoice.dueDate}</p>
                  <p className="text-xs text-slate-700"><strong>Terms:</strong> {selectedInvoice.paymentTerms}</p>
                  {selectedInvoice.contractRef && <p className="text-xs text-emerald-700 font-bold mt-1"><strong>Contract:</strong> {selectedInvoice.contractRef}</p>}
                </div>
              </div>

              {/* Audit Details */}
              {(selectedInvoice.datesOfService || selectedInvoice.locationsServed || selectedInvoice.quantitiesDelivered) && (
                <div className="bg-emerald-50 p-4 rounded-2xl border border-emerald-200 text-xs space-y-1">
                  <h4 className="font-bold text-emerald-800 uppercase text-[11px]">UNIDO Contract Audit Deliverables</h4>
                  {selectedInvoice.datesOfService && <p><strong>Dates of Service:</strong> {selectedInvoice.datesOfService}</p>}
                  {selectedInvoice.locationsServed && <p><strong>Locations Served:</strong> {selectedInvoice.locationsServed}</p>}
                  {selectedInvoice.quantitiesDelivered && <p><strong>Quantities Delivered:</strong> {selectedInvoice.quantitiesDelivered}</p>}
                </div>
              )}

              {/* Line Items Table */}
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-900 text-white text-left">
                    <th className="p-2.5 rounded-l-lg">Description</th>
                    <th className="p-2.5 text-center">Qty</th>
                    <th className="p-2.5 text-right">Unit Price</th>
                    <th className="p-2.5 text-right rounded-r-lg">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {Array.isArray(selectedInvoice.lineItems) && selectedInvoice.lineItems.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-2">
                        <strong>{item.description}</strong>
                        {item.datesOfService && <div className="text-[11px] text-slate-500">Service Dates: {item.datesOfService}</div>}
                        {item.location && <div className="text-[11px] text-slate-500">Location: {item.location}</div>}
                      </td>
                      <td className="py-2.5 px-2 text-center">{item.quantity}</td>
                      <td className="py-2.5 px-2 text-right">{selectedInvoice.currency} {parseFloat(item.unitPrice || 0).toFixed(2)}</td>
                      <td className="py-2.5 px-2 text-right font-bold">{selectedInvoice.currency} {parseFloat(item.total || 0).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Settlement Instructions & Total */}
              <div className="grid grid-cols-2 gap-6 pt-4 border-t">
                <div className="bg-amber-50 p-3.5 rounded-xl border border-amber-200 text-xs text-amber-900">
                  <h4 className="font-bold text-[11px] uppercase mb-1">Settlement Details</h4>
                  <p className="whitespace-pre-line text-[11px]">{selectedInvoice.paymentDetails}</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-slate-600">Subtotal: <strong>{selectedInvoice.currency} {parseFloat(selectedInvoice.subtotal || 0).toFixed(2)}</strong></p>
                  <p className="text-lg font-black text-emerald-700">Total Amount Due: {selectedInvoice.currency} {parseFloat(selectedInvoice.totalAmount || 0).toFixed(2)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={() => window.print()} className="text-xs font-bold">
                  <Printer className="w-4 h-4 mr-1.5" /> Print / Save as PDF
                </Button>
              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
'''

# Insert InvoiceBuilder & InvoicesVault before AccountManagerView
if "function AccountManagerView" in code:
    code = code.replace("function AccountManagerView", invoice_components_code + "\nfunction AccountManagerView")
    print("Added InvoiceBuilder & InvoicesVault components!")
else:
    print("Could not find AccountManagerView!")

# Now add Invoice Builder & Invoices Vault tabs to AccountManagerView & OperationsSupervisorView
code = code.replace(
    '<TabsTrigger value="quotation-builder">Quotation Builder</TabsTrigger>',
    '<TabsTrigger value="quotation-builder">Quotation Builder</TabsTrigger>\n        <TabsTrigger value="invoice-builder">Invoice Builder</TabsTrigger>\n        <TabsTrigger value="invoices-vault">Document & Invoice Vault</TabsTrigger>'
)

# Fetch invoices state in AccountManagerView & OperationsSupervisorView
code = code.replace(
    'const { data: staffData } = useQuery({',
    'const { data: invoicesData, refetch: refetchInvoices } = useQuery({\n    queryKey: ["/api/catering/invoices"],\n    queryFn: () => cateringFetch("/api/catering/invoices"),\n  });\n  const invoices = invoicesData?.invoices || [];\n\n  const { data: staffData } = useQuery({'
)

# Render InvoiceBuilder & InvoicesVault TabsContent in AccountManagerView
tabs_content_snippet = '''
      <TabsContent value="invoice-builder">
        <InvoiceBuilder requests={requests} quotations={quotations} onSaveInvoice={refetchInvoices} />
      </TabsContent>

      <TabsContent value="invoices-vault">
        <InvoicesVault invoices={invoices} onRefresh={refetchInvoices} />
      </TabsContent>
'''

code = code.replace(
    '<TabsContent value="staff">',
    tabs_content_snippet + '\n      <TabsContent value="staff">'
)

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(code)

print("Successfully integrated Invoice Builder & Invoices Vault into TOCEPS Dashboard UI!")
