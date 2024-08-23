import requests
from config import TB_API
from services.user_services import getUserInfoService

def loginService(username, password):
    url = f"{TB_API}/auth/login"
    data = {
        "username": username,
        "password": password
    }
    response = requests.post(url, json=data)
    token = response.json().get('token')
    
    userInfo = getUserInfoService(username, token)["data"][0]
    
    
    if response.status_code == 200:
        return {
            **response.json(),
            "email": userInfo.get('email'),
            "authority": userInfo.get('authority'),
            "firstName": userInfo.get('firstName'),
            "lastName": userInfo.get('lastName'),
            "fullName": f"{userInfo.get('firstName')} {userInfo.get('lastName')}",
            "name": userInfo.get('name'),
            "id": userInfo.get('id')
        }
    return None

def getCurrentUserService(token):
    url = f"{TB_API}/auth/user"
    response = requests.get(url, headers={'Authorization': f'Bearer {token}'})
    userInfo =response.json()
    if response.status_code == 200:
        return {
            "email": userInfo.get('email'),
            "authority": userInfo.get('authority'),
            "firstName": userInfo.get('firstName'),
            "lastName": userInfo.get('lastName'),
            "fullName": f"{userInfo.get('firstName')} {userInfo.get('lastName')}",
            "name": userInfo.get('name'),
            "id": userInfo.get('id')
        }
    return None