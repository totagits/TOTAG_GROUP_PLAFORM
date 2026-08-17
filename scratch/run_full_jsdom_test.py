import re

# Inspect all route paths in App.tsx and header.tsx and service-card.tsx
with open(r'c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\App.tsx', 'r', encoding='utf-8') as f:
    app_code = f.read()

with open(r'c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\components\header.tsx', 'r', encoding='utf-8') as f:
    header_code = f.read()

with open(r'c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\components\service-card.tsx', 'r', encoding='utf-8') as f:
    card_code = f.read()

print("Checking Route definitions in App.tsx:")
routes = re.findall(r'<Route\s+path="([^"]+)"\s+component={([^}]+)}', app_code)
for r in routes:
    print(f"  Route: {r[0]} -> {r[1]}")

print("\nChecking official9Subsidiaries in header.tsx:")
subs = re.findall(r'href:\s*"([^"]+)"', header_code)
for s in subs:
    print(f"  Header Subsidiary Href: {s}")
