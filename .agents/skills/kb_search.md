---
name: kb_search
description: Search TOTAG Group knowledge base policy documents, return windows, warranty guidelines, FAO UN Digital Farmer Registry info, TOCEPS Catering, IT Services, and payment methods.
parameters:
  type: object
  properties:
    query:
      type: string
      description: Search query or topic to look up in company documentation
  required:
    - query
---

# Knowledge Base Search MCP Skill

This tool performs semantic and keyword search across TOTAG Group knowledge base documentation, return policies, warranty guidelines, payment instructions (Ecobank USD / Mobile Money), and service specifications.
