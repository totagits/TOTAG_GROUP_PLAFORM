import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\stationery"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787034587926.png": "stationery_office_supplies_set.png",
    "media_1787034632992.png": "stationery_desktop_organizer.png",
    "media_1787034798464.png": "stationery_double_a_box.png",
    "media_1787034847736.png": "stationery_paper_cartons.png",
    "media_1787035025792.png": "stationery_lever_arch_binders.png"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Update client/src/pages/stationery.tsx hero carousel slides & imports
stationery_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\stationery.tsx"

with open(stationery_path, "r", encoding="utf-8") as f:
    content = f.read()

# Add Badge import if missing
if 'import { Badge }' not in content:
    content = content.replace(
        'import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";',
        'import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";\nimport { Badge } from "@/components/ui/badge";'
    )

old_slides = '''          slides={[
            { url: "/images/hero/farm-surveyor-field.jpg", caption: "B2B Corporate Stationery & Office Inventory Depot" },
            { url: "/images/hero/farm-surveyor-field.jpg", caption: "Educational & Institutional Paper Supply Warehouse" },
            { url: "/images/hero/farm-surveyor-field.jpg", caption: "Commercial High-Speed Offset Printing & Binding" }
          ]}'''

new_slides = '''          slides={[
            { url: "/images/stationery/stationery_office_supplies_set.png", caption: "Premium B2B Corporate Office Supplies & Executive Stationery Set" },
            { url: "/images/stationery/stationery_desktop_organizer.png", caption: "Executive Desktop Organization Suite & Office Accessories" },
            { url: "/images/stationery/stationery_double_a_box.png", caption: "Double A Premium 80gsm High-Whiteness A4 Copy Paper Reams" },
            { url: "/images/stationery/stationery_paper_cartons.png", caption: "Bulk Wholesale Double A Copy Paper Pallets & Boxed Cartons" },
            { url: "/images/stationery/stationery_lever_arch_binders.png", caption: "Heavy-Duty Lever Arch Binders & Archival Ring File Storage" }
          ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    print("Updated stationery.tsx hero slides successfully!")
else:
    print("Warning: old slides pattern not found in stationery.tsx!")

with open(stationery_path, "w", encoding="utf-8") as f:
    f.write(content)
