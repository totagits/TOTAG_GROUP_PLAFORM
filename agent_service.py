import os
import re
import json
import uuid
import datetime
from typing import Dict, List, Any, Optional

# --- SIMULATED VERIFIED DATABASE (Order Tracking & Logistics) ---
SIMULATED_ORDERS = {
    "TOT-8891": {
        "order_id": "TOT-8891",
        "customer": "UN FAO Project Office",
        "item": "Liberia Digital Farmer Registry Mobile Validation Terminals",
        "status": "In Transit to Monrovia Free Port",
        "carrier": "TOTAG Cargo Logistics & Shipping",
        "estimated_delivery": "2026-09-08",
        "milestone": "Customs Stevedoring Clearance Completed"
    },
    "TOT-1042": {
        "order_id": "TOT-1042",
        "customer": "Ministry of Agriculture Liberia",
        "item": "Agronomy Soil Testing Kits & GIS Cadastral Scanners",
        "status": "Delivered",
        "carrier": "TOTAG Express Logistics Fleet",
        "estimated_delivery": "2026-08-30",
        "milestone": "Signed & Confirmed at Paynesville Central Depot"
    },
    "ORD-9921": {
        "order_id": "ORD-9921",
        "customer": "Golden Veroleum Liberia",
        "item": "TOCEPS Mining Concession Banquet Supply Package",
        "status": "Processing Dispatch",
        "carrier": "TOCEPS Fleet Operations",
        "estimated_delivery": "2026-09-05",
        "milestone": "Food Safety HACCP Quality Check Passed"
    }
}

# --- KNOWLEDGE BASE DOCUMENTATION ---
KNOWLEDGE_BASE_DOCS = [
    {
        "category": "Proforma Invoices & Billing",
        "keywords": ["proforma", "invoice", "billing", "gst", "tax", "ecobank", "payment", "orange money", "momo"],
        "content": "TOTAG Group generates official Proforma Invoices with itemized breakdowns, 10% statutory GST, and dual USD/LRD currency calculations. Payment accounts: Ecobank Liberia USD Acc: 1010-09823-01, Orange Money: 0770554433, MTN MoMo: 0880554433."
    },
    {
        "category": "Return & Warranty Guidelines",
        "keywords": ["return", "refund", "warranty", "guarantee", "exchange", "policy", "damage"],
        "content": "All hardware and equipment supplied by TOTAG Group (IT hardware, Victron/Deye solar components, stationery supplies) carry a standard 12-month manufacturer warranty. Returns or replacement requests for damaged items must be reported within 14 business days of receipt."
    },
    {
        "category": "Digital Farmer Registry (FAO UN)",
        "keywords": ["farmer", "registry", "fao", "unido", "moa", "agriculture", "counties", "tewor", "voucher"],
        "content": "The Liberia Digital Farmer Registry (FAO UN initiative) registers farmers across all 15 Liberian statutory counties, provides GIS cadastral mapping, classifies producer scales, and distributes mobile money input vouchers."
    },
    {
        "category": "TOCEPS Catering Services",
        "keywords": ["catering", "toceps", "banquet", "buffet", "wedding", "haccp", "unido", "conference"],
        "content": "TOCEPS Catering operates under international HACCP food safety standards, delivering institutional UNIDO workshop catering, corporate banquets, wedding receptions, and conference hospitality."
    },
    {
        "category": "Managed IT & SaaS Solutions",
        "keywords": ["it", "saas", "fims", "hrmis", "software", "cloud", "cybersecurity", "workshop"],
        "content": "TOTAG IT Services (TIS) provides enterprise software engineering, cloud infrastructure, cybersecurity audits, and the 14-module SaaS HRMIS & FIMS Enterprise Suite."
    }
]

# --- ANTIGRAVITY ADK AGENT CLASS ---
class AntigravityCustomerAgent:
    def __init__(self, agent_md_path: str = ".agents/agents/customer_agent.md"):
        self.agent_md_path = agent_md_path
        self.metadata = self._parse_agent_definition()
        self.sessions: Dict[str, List[Dict[str, str]]] = {}
        self.tickets: Dict[str, Dict[str, Any]] = {}

    def _parse_agent_definition(self) -> Dict[str, Any]:
        """Parses the YAML frontmatter and instructions from customer_agent.md."""
        if not os.path.exists(self.agent_md_path):
            return {
                "name": "customer_agent",
                "role": "Elite Customer Support Agent",
                "tone": "Professional, clear, helpful, and concise",
                "guardrails": ["Refuse off-topic questions."]
            }
        
        with open(self.agent_md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Parse YAML frontmatter
        yaml_match = re.search(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
        metadata = {}
        if yaml_match:
            yaml_text = yaml_match.group(1)
            for line in yaml_text.splitlines():
                if ":" in line and not line.strip().startswith("-"):
                    parts = line.split(":", 1)
                    key = parts[0].strip()
                    val = parts[1].strip()
                    metadata[key] = val
        return metadata

    # --- MCP TOOL IMPLEMENTATIONS ---
    def tool_order_tracker(self, order_id: str) -> Dict[str, Any]:
        """MCP Tool: Fetch order status by ID."""
        clean_id = order_id.strip().upper()
        if clean_id in SIMULATED_ORDERS:
            return {
                "found": True,
                "data": SIMULATED_ORDERS[clean_id]
            }
        return {
            "found": False,
            "message": f"No order record found for ID '{clean_id}'. Please verify your alphanumeric order reference."
        }

    def tool_kb_search(self, query: str) -> Dict[str, Any]:
        """MCP Tool: Scan policy and company documentation."""
        lower_q = query.lower()
        results = []
        for doc in KNOWLEDGE_BASE_DOCS:
            if any(kw in lower_q for kw in doc["keywords"]):
                results.append(doc)
        if results:
            return {"found": True, "results": results}
        return {
            "found": False,
            "message": "Standard TOTAG Group policies apply. For specific inquiries, contact support at info@totaggroup.com."
        }

    def tool_escalate_ticket(self, customer_name: str, customer_email: str, department: str, subject: str, message: str) -> Dict[str, Any]:
        """MCP Tool: Create structured support ticket."""
        ticket_id = f"TOT-TKT-{datetime.datetime.now().strftime('%Y')}-{uuid.uuid4().hex[:4].upper()}"
        ticket_payload = {
            "ticket_id": ticket_id,
            "customer_name": customer_name,
            "customer_email": customer_email,
            "department": department,
            "subject": subject,
            "message": message,
            "status": "Logged & Escalated to Human Support",
            "created_at": datetime.datetime.now().isoformat()
        }
        self.tickets[ticket_id] = ticket_payload
        return {
            "success": True,
            "ticket_id": ticket_id,
            "payload": ticket_payload
        }

    # --- RUNTIME CHAT EXECUTOR ---
    def execute_chat(self, session_id: str, message: str) -> Dict[str, Any]:
        """Processes message using agent instructions, tools, and session history."""
        if session_id not in self.sessions:
            self.sessions[session_id] = []

        history = self.sessions[session_id]
        history.append({"role": "user", "content": message, "timestamp": datetime.datetime.now().isoformat()})

        text_lower = message.lower().strip()

        # 1. Concise Professional Greeting
        greetings = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings", "start"]
        if any(text_lower == g or text_lower.startswith(g + " ") for g in greetings):
            response_text = "Hello! How may I assist you today?"
            history.append({"role": "agent", "content": response_text})
            return {"session_id": session_id, "response": response_text, "tools_used": []}

        # 2. Check for Order Tracking Intent (e.g. TOT-8891)
        order_match = re.search(r"\b(TOT-\d{4}|ORD-\d{4})\b", message, re.IGNORECASE)
        if order_match or "track" in text_lower or "order status" in text_lower or "shipment" in text_lower:
            order_id = order_match.group(1) if order_match else "TOT-8891"
            tool_res = self.tool_order_tracker(order_id)
            if tool_res["found"]:
                d = tool_res["data"]
                response_text = f"Order #{d['order_id']} ({d['item']}) is currently '{d['status']}'. Milestone: {d['milestone']}. Estimated Delivery: {d['estimated_delivery']} via {d['carrier']}."
            else:
                response_text = tool_res["message"]
            
            history.append({"role": "agent", "content": response_text})
            return {"session_id": session_id, "response": response_text, "tools_used": ["order_tracker"]}

        # 3. Check for Ticket Escalation Intent
        if "ticket" in text_lower or "escalate" in text_lower or "complaint" in text_lower or "human agent" in text_lower:
            tool_res = self.tool_escalate_ticket(
                customer_name="Valued Customer",
                customer_email="customer@example.com",
                department="Managed IT & Support",
                subject="Customer Escalation Request",
                message=message
            )
            ticket_id = tool_res["ticket_id"]
            response_text = f"Your support ticket #{ticket_id} has been logged successfully. A human customer support representative will review your request and contact you shortly."
            history.append({"role": "agent", "content": response_text})
            return {"session_id": session_id, "response": response_text, "tools_used": ["escalate_ticket"], "ticket": tool_res["payload"]}

        # 4. Check Knowledge Base MCP Tool
        kb_res = self.tool_kb_search(message)
        if kb_res["found"]:
            doc_content = " ".join([r["content"] for r in kb_res["results"]])
            response_text = doc_content
            history.append({"role": "agent", "content": response_text})
            return {"session_id": session_id, "response": response_text, "tools_used": ["kb_search"]}

        # 5. Fallback Guardrail Response
        response_text = "Thank you for reaching out to TOTAG Group. How may I assist you further with that inquiry?"
        history.append({"role": "agent", "content": response_text})
        return {"session_id": session_id, "response": response_text, "tools_used": []}

# Global Singleton Instance
agent_runtime = AntigravityCustomerAgent()
