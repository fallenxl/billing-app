import requests

def requestWithToken(url, token, method='GET', data=None, params=None, headers=None):
    headers = headers or {}
    headers['Authorization'] = f'Bearer {token}'
    if method == 'GET':
        return requests.get(url, headers=headers, params=params)
    elif method == 'POST':
        return requests.post(url, headers=headers, json=data)
    elif method == 'PUT':
        return requests.put(url, headers=headers, json=data)
    elif method == 'DELETE':
        return requests.delete(url, headers=headers)
    return None
