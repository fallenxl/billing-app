#example GO code: response, err := utils.Request(config.ThingsboardApiURL+"device/"+id, "GET", "", token)
import requests
from config import TB_API

def getDeviceByIdService(token, deviceId):
    url = f"{TB_API}/device/{deviceId}"
    headers = {
        'Content-Type': 'application/json',
        'X-Authorization': f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    
    return None