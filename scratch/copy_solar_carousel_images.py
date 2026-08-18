import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\solar"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787032597707.jpg": "solar_engineer_deye_inverter.jpg",
    "media_1787032597725.jpg": "solar_deye_inverter_room.jpg",
    "media_1787032597767.jpg": "solar_roof_installation_green.jpg",
    "media_1787032597730.jpg": "solar_roof_installation_blue.jpg",
    "media_1787032597724.jpg": "solar_techs_mounting_panels.jpg"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Update client/src/pages/solar.tsx hero carousel slides
solar_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\solar.tsx"

with open(solar_path, "r", encoding="utf-8") as f:
    content = f.read()

old_slides = '''            slides={[
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "Utility & Commercial Ground-Mounted Solar Array" },
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "Lithium Energy Storage Bank & Hybrid Inverters" },
              { url: "/images/hero/solar-rooftop-team.jpg", caption: "TOTAG Smart Energy NOC Telemetry Control Center" }
            ]}'''

new_slides = '''            slides={[
              { url: "/images/solar/solar_engineer_deye_inverter.jpg", caption: "Senior Solar Engineer & Dual Deye Hybrid Inverter Power Room" },
              { url: "/images/solar/solar_deye_inverter_room.jpg", caption: "Enterprise Microgrid Power Room with Deye Inverters & Lithium Storage" },
              { url: "/images/solar/solar_roof_installation_green.jpg", caption: "Rooftop Commercial Solar Array Installation (Green Metal Roof)" },
              { url: "/images/solar/solar_roof_installation_blue.jpg", caption: "Commercial & Residential Rooftop Solar Panel Array Mount" },
              { url: "/images/solar/solar_techs_mounting_panels.jpg", caption: "Certified Solar Technicians Mounting High-Efficiency PV Modules" }
            ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    with open(solar_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated solar.tsx hero slides successfully!")
else:
    print("Warning: old slides pattern not found in solar.tsx!")
