import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\catering"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787031377301.jpg": "catering_ballroom_luxury.jpg",
    "media_1787031377305.jpg": "catering_gala_canopy.jpg",
    "media_1787031377304.jpg": "catering_navy_banquet.jpg",
    "media_1787031377339.jpg": "catering_gold_hall.jpg",
    "media_1787031433704.jpg": "catering_buffet_setting.jpg"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Update client/src/pages/catering.tsx hero carousel slides
catering_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx"

with open(catering_path, "r", encoding="utf-8") as f:
    content = f.read()

old_slides = '''        slides={[
          { url: "/images/hero/farm-cocoa-harvest.jpg", caption: "TOCEPS Corporate Culinary & Gourmet Banquet Setup" },
          { url: "/images/hero/farm-cocoa-harvest.jpg", caption: "Specialty Wedding & Social Celebration Reception" },
          { url: "/images/hero/farm-cocoa-harvest.jpg", caption: "ISO-Compliant Institutional Food Safety Kitchen" }
        ]}'''

new_slides = '''        slides={[
          { url: "/images/catering/catering_ballroom_luxury.jpg", caption: "TOCEPS Luxury Grand Ballroom & Crystal Centerpiece Setup" },
          { url: "/images/catering/catering_gala_canopy.jpg", caption: "State Banquet & Wedding Gala Draped Canopy Venue" },
          { url: "/images/catering/catering_navy_banquet.jpg", caption: "Corporate Executive Summit & Formal Dinner Reception" },
          { url: "/images/catering/catering_gold_hall.jpg", caption: "Grand Illuminated Celebration Hall & Gold Accents" },
          { url: "/images/catering/catering_buffet_setting.jpg", caption: "Premium Gourmet Buffet Line & Fine Tableware Service" }
        ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    with open(catering_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated catering.tsx hero slides successfully!")
else:
    print("Warning: old slides pattern not found in catering.tsx!")
