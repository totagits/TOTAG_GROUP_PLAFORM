import urllib.request
import re

url = "https://totag.network/"
try:
    req = urllib.request.urlopen(url)
    html = req.read().decode('utf-8')
    print("Status:", req.status)
    js_matches = re.findall(r'src="(/assets/[^"]+)"', html)
    print("JS assets:", js_matches)
    
    # Check 404 page
    req404 = urllib.request.urlopen("https://totag.network/404.html")
    print("404.html status:", req404.status)
except Exception as e:
    print("Error:", e)
