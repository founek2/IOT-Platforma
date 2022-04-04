# Python klient

Ukázka využití Pythonu pro ovládání jednotlivých zařízení.

```python
import requests
import time

api_key = "YOUR_SECRET_API_KEY"

def send_action(action: str):
    return requests.post(f"{action}&api_key={api_key}")


action1 = "some_action_url"
action2 = "some_action_url"

r = send_action(action1)
print("status code: ",r.status_code)
print("response obj:",r)

time.sleep(4)
r = send_action(action2)
```
