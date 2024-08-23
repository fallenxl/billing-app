import requests
from config import TB_API

def getAttributesService(token, entityType, entityId):
    try:
        url = f"{TB_API}/plugins/telemetry/{entityType}/{entityId}/values/attributes"
        response = requests.get(url, headers={'Authorization': f'Bearer {token}', 'accept': 'application/json'})
        if response.status_code == 200:
            return response.json()
        return None
    except Exception as e:
        print(e)
        return None