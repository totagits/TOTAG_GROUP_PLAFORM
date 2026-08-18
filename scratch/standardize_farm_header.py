import os, re

farm_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\farm"

for filename in os.listdir(farm_dir):
    if filename.endswith(".tsx"):
        filepath = os.path.join(farm_dir, filename)
        with open(filepath, "r", encoding="utf-8") as f:
            content = f.read()

        # Ensure Header is imported
        if 'import Header from "@/components/header";' not in content:
            content = 'import Header from "@/components/header";\n' + content

        # Remove FarmNavbar import
        content = re.sub(r'import\s+FarmNavbar\s+from\s+["\']@/components/farm-navbar["\'];?\n?', '', content)

        # Replace <FarmNavbar /> or <Header /> <FarmNavbar /> with just <Header />
        content = re.sub(r'<Header\s*/>\s*<FarmNavbar\s*/>', '<Header />', content)
        content = re.sub(r'<FarmNavbar\s*/>', '<Header />', content)

        with open(filepath, "w", encoding="utf-8") as f:
            f.write(content)

print("Standardized header across all farm pages successfully!")
