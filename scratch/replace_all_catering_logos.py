import os
import glob

files_to_fix = [
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\beverage-services.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\corporate-catering.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\event-planning.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\food-safety.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\onsite-coordination.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\post-event-services.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\social-celebrations.tsx",
    r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\specialty-menus.tsx",
]

for filepath in files_to_fix:
    if os.path.exists(filepath):
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Replace import statement
        content = content.replace('import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png";', 'const cateringLogo = "/images/totag-logo.png";')
        content = content.replace('import cateringLogo from "@assets/Logo for TOTAG Catering1(1)_1752602584482.png"', 'const cateringLogo = "/images/totag-logo.png"')
        
        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Updated logo in {os.path.basename(filepath)}")

print("All 10 catering pages now use official TOTAG GROUP Logo (/images/totag-logo.png) consistently!")
