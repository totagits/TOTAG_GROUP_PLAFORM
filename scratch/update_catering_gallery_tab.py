import os

catering_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering.tsx"

with open(catering_path, "r", encoding="utf-8") as f:
    content = f.read()

old_gallery = '''              {[
                { src: event1, title: "Conference Catering", desc: "Professional catering for workshops and conferences" },
                { src: event2, title: "Corporate Events", desc: "Full-service corporate meeting and event support" },
                { src: event3, title: "Venue Setup", desc: "Conference room setup with AV and catering" },
                { src: event4, title: "Institutional Service", desc: "Catering for UN agencies and INGO partners" },
                { src: event5, title: "Reception Service", desc: "Professional cocktail and reception events" },
                { src: event6, title: "Outdoor Events", desc: "Catering for outdoor events and field operations" }
              ]}'''

new_gallery = '''              {[
                { src: "/images/catering/catering_ballroom_luxury.jpg", title: "Luxury Grand Ballroom", desc: "Tall crystal centerpieces and elegant round table arrangement" },
                { src: "/images/catering/catering_gala_canopy.jpg", title: "State Gala & Draped Canopy", desc: "Flowing ceiling drapes, floral archway, and white aisle runner" },
                { src: "/images/catering/catering_navy_banquet.jpg", title: "Executive Summit Banquet", desc: "Navy blue table runners, white chair covers, and formal dining" },
                { src: "/images/catering/catering_gold_hall.jpg", title: "Illuminated Celebration Hall", desc: "Panoramic windowed hall with golden tablecloths and chair sashes" },
                { src: "/images/catering/catering_buffet_setting.jpg", title: "Gourmet Buffet & Tableware", desc: "Polished stainless chafing dishes and fine glassware table setup" },
                { src: event1, title: "Institutional Workshop Catering", desc: "HACCP-compliant catering for UN agencies, INGOs and corporate summits" }
              ]}'''

if old_gallery in content:
    content = content.replace(old_gallery, new_gallery)
    with open(catering_path, "w", encoding="utf-8") as f:
        f.write(content)
    print("Updated catering gallery tab successfully!")
else:
    print("Warning: old gallery pattern not found in catering.tsx!")
