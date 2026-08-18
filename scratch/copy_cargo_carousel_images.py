import os, shutil

user_dir = r"C:\Users\MichaelGwoah\.gemini\antigravity\brain\7f6adf31-c47e-4dbb-98c8-7e764fa9059c\.user_uploaded"
dest_dir = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\public\images\cargo"

os.makedirs(dest_dir, exist_ok=True)

image_mapping = {
    "media_1787031861435.jpg": "cargo_npa_monrovia_freeport.jpg",
    "media_1787031861393.jpg": "cargo_container_yard_monrovia.jpg",
    "media_1787031861434.png": "cargo_vega_granat_monrovia.png",
    "media_1787031861433.jpg": "cargo_berth_harbor_cranes.jpg",
    "media_1787031861291.jpg": "cargo_terminal_aerial.jpg"
}

for src_name, dest_name in image_mapping.items():
    src_path = os.path.join(user_dir, src_name)
    dest_path = os.path.join(dest_dir, dest_name)
    if os.path.exists(src_path):
        shutil.copy(src_path, dest_path)
        print(f"Copied {src_name} -> {dest_name}")
    else:
        print(f"Warning: {src_name} not found!")

# Update client/src/pages/cargo.tsx hero carousel slides
cargo_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\cargo.tsx"

with open(cargo_path, "r", encoding="utf-8") as f:
    content = f.read()

old_slides = '''          slides={[
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Freeport of Monrovia Berth Stevedoring & Heavy Lift" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "TOTAG Bonded Container Freight Terminal & WMS Yard" },
            { url: "/images/hero/solar-rooftop-team.jpg", caption: "Air Cargo Cold-Chain Ramp Staging (2°C - 8°C)" }
          ]}'''

new_slides = '''          slides={[
            { url: "/images/cargo/cargo_npa_monrovia_freeport.jpg", caption: "Freeport of Monrovia Deepwater Berth & Vessel Stevedoring" },
            { url: "/images/cargo/cargo_container_yard_monrovia.jpg", caption: "Monrovia Container Staging Yard & RoRo Ramp Operations" },
            { url: "/images/cargo/cargo_vega_granat_monrovia.png", caption: "Monrovia-Flagged Ocean Bulk Freighter 'VEGA GRANAT' & Tug Escort" },
            { url: "/images/cargo/cargo_berth_harbor_cranes.jpg", caption: "Mobile Harbor Cranes & Heavy Lift Container Clearing (C&F)" },
            { url: "/images/cargo/cargo_terminal_aerial.jpg", caption: "TOTAG Bonded Container Freight Station & WMS Logistics Yard" }
          ]}'''

if old_slides in content:
    content = content.replace(old_slides, new_slides)
    with open(cargo_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated cargo.tsx hero slides successfully!")
else:
    print("Warning: old slides pattern not found in cargo.tsx!")
