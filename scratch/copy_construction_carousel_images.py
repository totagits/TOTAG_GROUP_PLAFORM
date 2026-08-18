import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\construction"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787033733130.png": "construction_modern_villa_pool.png",
    "media_1787033565300.jpg": "construction_rebar_foundation.jpg",
    "media_1787033400328.png": "construction_column_formwork.png",
    "media_1787033450340.jpg": "construction_townhouses_completed.jpg",
    "media_1787033634607.png": "construction_housing_estate.png"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Update client/src/pages/construction.tsx hero carousel slides
construction_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\construction.tsx"

with open(construction_path, "r", encoding="utf-8") as f:
    content = f.read()

old_slides = '''            slides={[
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "Heavy Civil Works & Road Infrastructure Project" },
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "Structural Steel Commercial Complex" },
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "Heavy Equipment Fleet & Excavation Site" }
            ]}'''

new_slides = '''            slides={[
              { url: "/images/construction/construction_modern_villa_pool.png", caption: "Luxury Contemporary Architectural Villa & Pool Construction" },
              { url: "/images/construction/construction_rebar_foundation.jpg", caption: "Civil Engineering Deep Foundation Rebar Reinforcement & Footings" },
              { url: "/images/construction/construction_column_formwork.png", caption: "Structural Concrete Column Formwork Erection & Masonry" },
              { url: "/images/construction/construction_townhouses_completed.jpg", caption: "Multi-Family Residential Townhouse Development & Security Wall" },
              { url: "/images/construction/construction_housing_estate.png", caption: "Master-Planned Community Housing Estate & Site Earthworks" }
            ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    with open(construction_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated construction.tsx hero slides successfully!")
else:
    print("Warning: old slides pattern not found in construction.tsx!")
