---
name: escalate_ticket
description: Route complex inquiries, refund requests, or unresolved issues to human customer support by generating a structured support ticket payload.
parameters:
  type: object
  properties:
    customer_name:
      type: string
      description: Full name of the customer
    customer_email:
      type: string
      description: Customer email address
    department:
      type: string
      description: Department handling the ticket (e.g., Managed IT & SaaS, Digital Farmer Registry, TOCEPS Catering, FIMS Payment & Billing, Cargo & Logistics)
    subject:
      type: string
      description: Brief title of the issue
    message:
      type: string
      description: Detailed message or customer request
  required:
    - customer_name
    - customer_email
    - department
    - subject
    - message
---

# Support Ticket Escalation MCP Skill

This tool logs an official Customer Service Ticket directly into the TOTAG FIMS/CRM Help Desk system and assigns a reference Ticket ID.
