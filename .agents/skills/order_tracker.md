---
name: order_tracker
description: Fetch tracking status, delivery dates, and fulfillment stages by an alphanumeric order_id for TOTAG Group shipments, proforma invoices, and equipment deliveries.
parameters:
  type: object
  properties:
    order_id:
      type: string
      description: Alphanumeric order reference ID (e.g., TOT-8891, TOT-1042, ORD-9921)
  required:
    - order_id
---

# Order Tracker MCP Skill

This tool queries the TOTAG Group Order & Logistics Database to retrieve real-time fulfillment status, tracking dates, carrier information, and current milestone location.
