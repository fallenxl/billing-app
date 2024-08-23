#Go example
#	response, err := utils.Request(config.ThingsboardApiURL+"userInfos/all?pageSize=1&page=0&includeCustomers=true&textSearch="+username, "GET", "", token)
from config import TB_API
import requests
import json
def getUserInfoService(username, token):
    response = requests.get(f"{TB_API}/userInfos/all?pageSize=1&page=0&includeCustomers=true&textSearch={username}", headers={'Authorization': f'Bearer {token}'})

    if response.status_code == 200:
        return response.json()
    return None

