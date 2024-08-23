#Go example response, err := utils.Request(config.ThingsboardApiURL+"relations/info?fromId="+id+"&fromType="+entityType, "GET", "", token)
import requests
from config import TB_API

def getRelationInfoByFromId(token, fromId, fromType):
    url = f"{TB_API}/relations/info?fromId={fromId}&fromType={fromType}"
    headers = {
        'Content-Type': 'application/json',
        'X-Authorization': f"Bearer {token}"
    }
    response = requests.get(url, headers=headers)
    if response.status_code == 200:
        return response.json()
    return None