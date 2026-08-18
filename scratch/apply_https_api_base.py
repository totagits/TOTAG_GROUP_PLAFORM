import re

config_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\lib\config.ts"
dashboard_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\dashboard.tsx"
login_path = r"c:\Users\MichaelGwoah\Videos\TOTAGGROUP\client\src\pages\catering\ops\login.tsx"

# Update config.ts to HTTPS URL
with open(config_path, "r", encoding="utf-8") as f:
    config_code = f.read()

config_code = config_code.replace("http://srv1902704.hstgr.cloud", "https://srv1902704.hstgr.cloud")

with open(config_path, "w", encoding="utf-8") as f:
    f.write(config_code)
print("Updated config.ts to HTTPS base URL!")

# Update dashboard.tsx to HTTPS URL
with open(dashboard_path, "r", encoding="utf-8") as f:
    dash_code = f.read()

dash_code = dash_code.replace("http://srv1902704.hstgr.cloud", "https://srv1902704.hstgr.cloud")

with open(dashboard_path, "w", encoding="utf-8") as f:
    f.write(dash_code)
print("Updated dashboard.tsx to HTTPS base URL!")

# Update login.tsx to HTTPS URL
with open(login_path, "r", encoding="utf-8") as f:
    login_code = f.read()

login_code = login_code.replace("http://srv1902704.hstgr.cloud", "https://srv1902704.hstgr.cloud")

with open(login_path, "w", encoding="utf-8") as f:
    f.write(login_code)
print("Updated login.tsx to HTTPS base URL!")
