import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\hero"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787029700724.jpg": "farm_agronomist_gis.jpg",
    "media_1787029700739.jpg": "farm_cocoa_harvest.jpg",
    "media_1787029700767.jpg": "farm_rice_paddy.jpg",
    "media_1787030323008.jpg": "farm_pepper_sorting.jpg",
    "media_1787030396465.jpg": "farm_vegetable_field.jpg"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Now update client/src/pages/farm/home.tsx hero carousel slides
home_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\farm\home.tsx"

with open(home_path, "r", encoding="utf-8") as f:
    content = f.read()

old_slides = '''          slides={[
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Mechanized Rice & Grain Harvest Operations (River Basin Estate)" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Controlled Climate Hydroponic Greenhouse Complex" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Solar Microgrid & Cold Storage Refrigeration NOC" }
          ]}'''

new_slides = '''          slides={[
            { url: "/images/hero/farm_agronomist_gis.jpg", caption: "Precision GIS Field Mapping & Digital Agronomy Operations" },
            { url: "/images/hero/farm_cocoa_harvest.jpg", caption: "Commercial Tree Crops & Sustainable Cocoa Harvest" },
            { url: "/images/hero/farm_rice_paddy.jpg", caption: "Community Outgrower Rice Paddy Harvest & Seed Support" },
            { url: "/images/hero/farm_pepper_sorting.jpg", caption: "Horticulture Harvest Sorting, Quality Grading & Cold Storage" },
            { url: "/images/hero/farm_vegetable_field.jpg", caption: "Organic Vegetable Field Cultivation & Drip Irrigation" }
          ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    with open(home_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated home.tsx carousel slides successfully!")
else:
    print("Warning: old slides pattern not found in home.tsx!")
