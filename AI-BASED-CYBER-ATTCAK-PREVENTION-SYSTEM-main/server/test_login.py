import urllib.request
import urllib.error
import json

data = json.dumps({"username":"admin", "password":"admin123"}).encode('utf-8')
req = urllib.request.Request("http://127.0.0.1:8000/api/login/", data=data, headers={"Content-Type": "application/json"})
try:
    res = urllib.request.urlopen(req)
    print("SUCCESS")
    print(res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print(f"HTTP ERROR {e.code}")
    print(e.read().decode('utf-8'))
except urllib.error.URLError as e:
    print(f"CONNECTION ERROR: {e.reason}")
    print("Django might not be running or is crashing on startup.")
except Exception as e:
    print("ERROR", str(e))
