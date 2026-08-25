import PDFDocument from 'pdfkit';

export interface InvoicePdfData {
  id?: number;
  invoiceNumber: string;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  clientCompany?: string | null;
  contractRef?: string | null;
  invoiceDate: string;
  dueDate: string;
  paymentTerms?: string | null;
  currency?: string | null;
  datesOfService?: string | null;
  locationsServed?: string | null;
  quantitiesDelivered?: string | null;
  lineItems?: any;
  subtotal?: string | number | null;
  taxRate?: string | number | null;
  taxAmount?: string | number | null;
  discount?: string | number | null;
  totalAmount?: string | number | null;
  paymentDetails?: string | null;
  notes?: string | null;
  status?: string | null;
}

export interface QuotationPdfData {
  id?: number;
  quotationNumber: string;
  clientName: string;
  clientEmail?: string | null;
  clientPhone?: string | null;
  clientCompany?: string | null;
  eventType?: string | null;
  eventDate?: string | null;
  venue?: string | null;
  guestCount?: number | null;
  numberOfDays?: number | null;
  lineItems?: any;
  subtotal?: string | number | null;
  taxRate?: string | number | null;
  taxAmount?: string | number | null;
  discount?: string | number | null;
  totalAmount?: string | number | null;
  currency?: string | null;
  validUntil?: string | null;
  paymentTerms?: string | null;
  termsAndConditions?: string | null;
  notes?: string | null;
}

export function generateInvoicePdf(invoice: InvoicePdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const currency = invoice.currency || 'USD';
      const items: any[] = Array.isArray(invoice.lineItems) ? invoice.lineItems : [];

      // Primary Brand Header Banner
      doc.rect(40, 40, 515, 75).fill('#0f172a');

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('TOTAG Group of Companies Ltd', 55, 52);
      doc.fillColor('#22c55e').fontSize(10).font('Helvetica-Bold').text('TOTAG Catering & Event Planning Services (TOCEPS)', 55, 72);
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text('Monrovia, Liberia | Email: toceps@totaggroup.com | Web: totaggroup.com', 55, 87);

      doc.fillColor('#22c55e').fontSize(11).font('Helvetica-Bold').text('OFFICIAL INVOICE', 380, 55, { align: 'right', width: 160 });
      doc.fillColor('#f8fafc').fontSize(10).font('Helvetica-Bold').text(invoice.invoiceNumber, 380, 72, { align: 'right', width: 160 });
      doc.fillColor('#94a3b8').fontSize(8).font('Helvetica').text(`Status: ${(invoice.status || 'ISSUED').toUpperCase()}`, 380, 87, { align: 'right', width: 160 });

      let y = 130;

      // Meta Boxes (Billed To & Invoice Details)
      doc.rect(40, y, 250, 80).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#0369a1').fontSize(8).font('Helvetica-Bold').text('BILLED TO (CLIENT / ORGANIZATION):', 50, y + 10);
      doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(invoice.clientName, 50, y + 23);
      if (invoice.clientCompany) {
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(invoice.clientCompany, 50, y + 37);
      }
      doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(`${invoice.clientEmail} ${invoice.clientPhone ? `| ${invoice.clientPhone}` : ''}`, 50, y + 52);

      doc.rect(305, y, 250, 80).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('INVOICE SUMMARY & TERMS:', 315, y + 10);
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(`Invoice Date: ${invoice.invoiceDate}`, 315, y + 23);
      doc.fillColor('#dc2626').fontSize(8.5).font('Helvetica-Bold').text(`Payment Due: ${invoice.dueDate}`, 315, y + 36);
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(`Payment Terms: ${invoice.paymentTerms || 'Net 30'}`, 315, y + 49);
      if (invoice.contractRef) {
        doc.fillColor('#0284c7').fontSize(8).font('Helvetica-Bold').text(`Contract: ${invoice.contractRef.slice(0, 38)}`, 315, y + 62);
      }

      y += 95;

      // UNIDO / Deliverable Box if present
      if (invoice.datesOfService || invoice.locationsServed || invoice.quantitiesDelivered) {
        doc.rect(40, y, 515, 45).fillAndStroke('#f0fdf4', '#bbf7d0');
        doc.fillColor('#15803d').fontSize(8).font('Helvetica-Bold').text('CONTRACT AUDIT DELIVERABLE COMPLIANCE (ARTICLE 4)', 50, y + 8);
        
        let delivText = '';
        if (invoice.datesOfService) delivText += `Dates: ${invoice.datesOfService}   `;
        if (invoice.locationsServed) delivText += `Locations: ${invoice.locationsServed}   `;
        if (invoice.quantitiesDelivered) delivText += `Portions: ${invoice.quantitiesDelivered}`;
        doc.fillColor('#0f172a').fontSize(8).font('Helvetica').text(delivText, 50, y + 22, { width: 495 });
        y += 55;
      }

      // Line Items Table Header
      doc.rect(40, y, 515, 20).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('ITEM / SERVICE DESCRIPTION', 50, y + 6);
      doc.text('DATES / LOCATION', 260, y + 6);
      doc.text('QTY', 390, y + 6, { width: 30, align: 'center' });
      doc.text('UNIT PRICE', 425, y + 6, { width: 55, align: 'right' });
      doc.text('TOTAL', 485, y + 6, { width: 60, align: 'right' });

      y += 22;

      // Line items rows
      items.forEach((item: any, idx: number) => {
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(40, y, 515, 24).fillAndStroke(rowBg, '#f1f5f9');

        doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold').text(item.description || 'Catering Service', 50, y + 5, { width: 205, height: 16 });
        
        const locDate = [item.datesOfService, item.location].filter(Boolean).join(' - ') || '-';
        doc.fillColor('#64748b').fontSize(7.5).font('Helvetica').text(locDate.slice(0, 30), 260, y + 6, { width: 125 });

        const qty = item.quantity || 1;
        const unitPrice = parseFloat(item.unitPrice || 0);
        const total = parseFloat(item.total || (qty * unitPrice) || 0);

        doc.fillColor('#0f172a').fontSize(8).font('Helvetica').text(String(qty), 390, y + 6, { width: 30, align: 'center' });
        doc.text(`${currency} ${unitPrice.toFixed(2)}`, 425, y + 6, { width: 55, align: 'right' });
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${currency} ${total.toFixed(2)}`, 485, y + 6, { width: 60, align: 'right' });

        y += 24;
      });

      y += 10;

      // Totals & Bank Box
      doc.rect(40, y, 290, 90).fillAndStroke('#fefce8', '#fef08a');
      doc.fillColor('#854d0e').fontSize(8).font('Helvetica-Bold').text('OFFICIAL BANK SETTLEMENT DETAILS:', 50, y + 8);
      doc.fillColor('#713f12').fontSize(8).font('Helvetica')
        .text('Bank Transfer: TOTAG Group of Companies Ltd', 50, y + 22)
        .text('Bank: Ecobank Liberia Limited | Account: 6103394551', 50, y + 34)
        .text('SWIFT Code: ECOCLRLM | Branch: 11th Street Sinkor, Monrovia', 50, y + 46)
        .text(`Ref: Please state Invoice ${invoice.invoiceNumber} on transfer.`, 50, y + 58)
        .text('Mobile Money: Orange: +231-777-666-999 | MTN: +231-887-666-999', 50, y + 70);

      // Financial Summary Box
      doc.rect(345, y, 210, 90).fillAndStroke('#f8fafc', '#e2e8f0');
      
      const subtotal = parseFloat(invoice.subtotal as any || invoice.totalAmount as any || 0);
      const taxAmt = parseFloat(invoice.taxAmount as any || 0);
      const discount = parseFloat(invoice.discount as any || 0);
      const totalAmount = parseFloat(invoice.totalAmount as any || 0);

      doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').text('Subtotal:', 355, y + 10);
      doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${currency} ${subtotal.toFixed(2)}`, 450, y + 10, { align: 'right', width: 95 });

      if (taxAmt > 0) {
        doc.fillColor('#64748b').font('Helvetica').text(`Tax (${invoice.taxRate || 0}%):`, 355, y + 24);
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${currency} ${taxAmt.toFixed(2)}`, 450, y + 24, { align: 'right', width: 95 });
      }

      if (discount > 0) {
        doc.fillColor('#dc2626').font('Helvetica').text('Discount:', 355, y + 38);
        doc.fillColor('#dc2626').font('Helvetica-Bold').text(`-${currency} ${discount.toFixed(2)}`, 450, y + 38, { align: 'right', width: 95 });
      }

      doc.rect(345, y + 55, 210, 35).fill('#0f172a');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('Total Due:', 355, y + 67);
      doc.fillColor('#22c55e').fontSize(13).font('Helvetica-Bold').text(`${currency} ${totalAmount.toFixed(2)}`, 430, y + 64, { align: 'right', width: 115 });

      y += 105;

      // Footer Notes & Signature line
      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
        .text('Thank you for partnering with TOTAG Group of Companies Ltd.', 40, y, { align: 'center', width: 515 })
        .text('Archived and compliance verified in TOCEPS Executive Document Vault.', 40, y + 12, { align: 'center', width: 515 });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}

export function generateQuotationPdf(quotation: QuotationPdfData): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ margin: 40, size: 'A4' });
      const buffers: Buffer[] = [];

      doc.on('data', (chunk) => buffers.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', (err) => reject(err));

      const currency = quotation.currency || 'USD';
      const items: any[] = Array.isArray(quotation.lineItems) ? quotation.lineItems : [];

      // Primary Brand Header Banner
      doc.rect(40, 40, 515, 75).fill('#1e1b4b');

      doc.fillColor('#ffffff').fontSize(16).font('Helvetica-Bold').text('TOTAG Group of Companies Ltd', 55, 52);
      doc.fillColor('#a855f7').fontSize(10).font('Helvetica-Bold').text('TOTAG Catering & Event Planning Services (TOCEPS)', 55, 72);
      doc.fillColor('#cbd5e1').fontSize(8).font('Helvetica').text('Monrovia, Liberia | Email: toceps@totaggroup.com | Web: totaggroup.com', 55, 87);

      doc.fillColor('#a855f7').fontSize(11).font('Helvetica-Bold').text('OFFICIAL PROPOSAL', 380, 55, { align: 'right', width: 160 });
      doc.fillColor('#f8fafc').fontSize(10).font('Helvetica-Bold').text(quotation.quotationNumber, 380, 72, { align: 'right', width: 160 });
      doc.fillColor('#cbd5e1').fontSize(8).font('Helvetica').text(`Valid Until: ${quotation.validUntil || '30 Days'}`, 380, 87, { align: 'right', width: 160 });

      let y = 130;

      // Meta Boxes
      doc.rect(40, y, 250, 75).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#6b21a8').fontSize(8).font('Helvetica-Bold').text('PREPARED FOR:', 50, y + 10);
      doc.fillColor('#0f172a').fontSize(11).font('Helvetica-Bold').text(quotation.clientName, 50, y + 23);
      if (quotation.clientCompany) {
        doc.fillColor('#475569').fontSize(9).font('Helvetica').text(quotation.clientCompany, 50, y + 37);
      }
      doc.fillColor('#64748b').fontSize(8).font('Helvetica').text(`${quotation.clientEmail || ''} ${quotation.clientPhone ? `| ${quotation.clientPhone}` : ''}`, 50, y + 50);

      doc.rect(305, y, 250, 75).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fillColor('#64748b').fontSize(8).font('Helvetica-Bold').text('EVENT PARAMETERS:', 315, y + 10);
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(`Event Type: ${quotation.eventType || 'Catering'}`, 315, y + 23);
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(`Date: ${quotation.eventDate || 'Scheduled'}`, 315, y + 35);
      doc.fillColor('#0f172a').fontSize(8.5).font('Helvetica').text(`Venue: ${quotation.venue || 'Client Venue'} | Guests: ${quotation.guestCount || 0}`, 315, y + 47);
      if (quotation.numberOfDays && quotation.numberOfDays > 1) {
        doc.fillColor('#6b21a8').fontSize(8).font('Helvetica-Bold').text(`Duration: ${quotation.numberOfDays} Days`, 315, y + 59);
      }

      y += 90;

      // Line Items Table Header
      doc.rect(40, y, 515, 20).fill('#1e1b4b');
      doc.fillColor('#ffffff').fontSize(8.5).font('Helvetica-Bold');
      doc.text('SERVICE / MENU ITEM', 50, y + 6);
      doc.text('QTY / PARTICIPANTS', 350, y + 6, { width: 65, align: 'center' });
      doc.text('UNIT PRICE', 425, y + 6, { width: 55, align: 'right' });
      doc.text('TOTAL', 485, y + 6, { width: 60, align: 'right' });

      y += 22;

      // Line items rows
      items.forEach((item: any, idx: number) => {
        const rowBg = idx % 2 === 0 ? '#ffffff' : '#f8fafc';
        doc.rect(40, y, 515, 22).fillAndStroke(rowBg, '#f1f5f9');

        doc.fillColor('#0f172a').fontSize(8).font('Helvetica-Bold').text(item.description || item.name || 'Service Package', 50, y + 5, { width: 290, height: 15 });

        const qty = item.quantity || 1;
        const unitPrice = parseFloat(item.unitPrice || 0);
        const total = parseFloat(item.total || (qty * unitPrice) || 0);

        doc.fillColor('#0f172a').fontSize(8).font('Helvetica').text(String(qty), 350, y + 5, { width: 65, align: 'center' });
        doc.text(`${currency} ${unitPrice.toFixed(2)}`, 425, y + 5, { width: 55, align: 'right' });
        doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${currency} ${total.toFixed(2)}`, 485, y + 5, { width: 60, align: 'right' });

        y += 22;
      });

      y += 10;

      // Bank & Deposit Box
      doc.rect(40, y, 290, 80).fillAndStroke('#fdf4ff', '#f5d0fe');
      doc.fillColor('#86198f').fontSize(8).font('Helvetica-Bold').text('CONFIRMATION & DEPOSIT INSTRUCTIONS:', 50, y + 8);
      doc.fillColor('#701a75').fontSize(8).font('Helvetica')
        .text('Bank Transfer: TOTAG Group of Companies Ltd', 50, y + 22)
        .text('Bank: Ecobank Liberia Limited | Account: 6103394551 | SWIFT: ECOCLRLM', 50, y + 34)
        .text(`Terms: ${quotation.paymentTerms || '50% deposit upon confirmation'}`, 50, y + 46)
        .text(`Quote Ref: ${quotation.quotationNumber}`, 50, y + 58);

      // Financial Summary Box
      doc.rect(345, y, 210, 80).fillAndStroke('#f8fafc', '#e2e8f0');
      const subtotal = parseFloat(quotation.subtotal as any || quotation.totalAmount as any || 0);
      const totalAmount = parseFloat(quotation.totalAmount as any || 0);

      doc.fillColor('#64748b').fontSize(8.5).font('Helvetica').text('Subtotal:', 355, y + 10);
      doc.fillColor('#0f172a').font('Helvetica-Bold').text(`${currency} ${subtotal.toFixed(2)}`, 450, y + 10, { align: 'right', width: 95 });

      doc.rect(345, y + 45, 210, 35).fill('#1e1b4b');
      doc.fillColor('#ffffff').fontSize(9).font('Helvetica-Bold').text('Total Quote:', 355, y + 57);
      doc.fillColor('#a855f7').fontSize(13).font('Helvetica-Bold').text(`${currency} ${totalAmount.toFixed(2)}`, 430, y + 54, { align: 'right', width: 115 });

      y += 95;

      doc.fillColor('#64748b').fontSize(7.5).font('Helvetica')
        .text('TOTAG Group of Companies Ltd | Catering & Event Planning Services', 40, y, { align: 'center', width: 515 });

      doc.end();
    } catch (e) {
      reject(e);
    }
  });
}
