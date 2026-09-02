import os
import sys
from agent_service import AntigravityCustomerAgent

def run_tests():
    print("==========================================================")
    print("[INIT] ANTIGRAVITY ADK AGENT & MCP TESTING SUITE")
    print("==========================================================")

    # Test 1: Check .agents structure
    agent_file = ".agents/agents/customer_agent.md"
    skills = [
        ".agents/skills/order_tracker.md",
        ".agents/skills/kb_search.md",
        ".agents/skills/escalate_ticket.md"
    ]

    print("\n[TEST 1] Verifying .agents Folder Structure...")
    if os.path.exists(agent_file):
        print(f"  [OK] Agent definition found: {agent_file}")
    else:
        print(f"  [FAIL] MISSING: {agent_file}")
        sys.exit(1)

    for skill in skills:
        if os.path.exists(skill):
            print(f"  [OK] MCP Skill definition found: {skill}")
        else:
            print(f"  [FAIL] MISSING: {skill}")
            sys.exit(1)

    # Test 2: Initialize Antigravity Customer Agent
    print("\n[TEST 2] Initializing Antigravity ADK Runtime...")
    agent = AntigravityCustomerAgent()
    print(f"  [OK] Agent Name: {agent.metadata.get('name')}")
    print(f"  [OK] Role: {agent.metadata.get('role')}")
    print(f"  [OK] Tone: {agent.metadata.get('tone')}")

    # Test 3: Test Greeting
    print("\n[TEST 3] Testing Succinct Greeting...")
    res1 = agent.execute_chat("test_session_1", "Hello")
    print(f"  User: 'Hello'")
    print(f"  Agent Response: '{res1['response']}'")
    assert "Hello" in res1['response'] or "assist" in res1['response']

    # Test 4: Test MCP Order Tracker Tool
    print("\n[TEST 4] Testing MCP Order Tracker Tool (Order TOT-8891)...")
    res2 = agent.execute_chat("test_session_1", "Where is my shipment for TOT-8891?")
    print(f"  User: 'Where is my shipment for TOT-8891?'")
    print(f"  Tools Executed: {res2['tools_used']}")
    print(f"  Agent Response: '{res2['response']}'")
    assert "order_tracker" in res2['tools_used']

    # Test 5: Test MCP Knowledge Base Tool
    print("\n[TEST 5] Testing MCP Knowledge Base Tool (Return Policy)...")
    res3 = agent.execute_chat("test_session_1", "What is your warranty and return policy?")
    print(f"  User: 'What is your warranty and return policy?'")
    print(f"  Tools Executed: {res3['tools_used']}")
    print(f"  Agent Response: '{res3['response']}'")
    assert "kb_search" in res3['tools_used']

    # Test 6: Test MCP Escalation Tool
    print("\n[TEST 6] Testing MCP Support Ticket Escalation Tool...")
    res4 = agent.execute_chat("test_session_1", "Please open a support ticket for my issue")
    print(f"  User: 'Please open a support ticket for my issue'")
    print(f"  Tools Executed: {res4['tools_used']}")
    print(f"  Agent Response: '{res4['response']}'")
    assert "escalate_ticket" in res4['tools_used']

    print("\n==========================================================")
    print("[SUCCESS] ALL ANTIGRAVITY ADK & MCP AGENT TESTS PASSED!")
    print("==========================================================")

if __name__ == "__main__":
    run_tests()
