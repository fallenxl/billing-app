# Go example response, err := utils.Request(config.ThingsboardApiURL+"entityGroup/ce0482e0-5425-11ef-aa15-a127638e3a77/customers?pageSize=100&page=0", "GET", "", token)
import requests
from services.attributes_services import getAttributesService
from config import TB_API

def getAssetsGroupService(token):
    url = f"{TB_API}/entityGroup/ce0482e0-5425-11ef-aa15-a127638e3a77/customers?pageSize=100&page=0"
    response = requests.get(url, headers={'Authorization': f'Bearer {token}'})
    assets = response.json()["data"]
    for asset in assets:
        entity_id = asset["id"]["id"]
        entity_type = asset["id"]["entityType"]
        attributes =  getAttributesService(token, entity_type, entity_id)
        asset["img"] = findKeyInAttributes(attributes, "img")
    if response.status_code == 200:
        return assets
    return None


def getCustomerByIdService(token, entity_id):
    url = f"{TB_API}/customer/info/{entity_id}"
    response = requests.get(url, headers={'Authorization': f'Bearer {token}'})
    asset = response.json()
    entity_id = asset["id"]["id"]
    entity_type = asset["id"]["entityType"]
    attributes =  getAttributesService(token, entity_type, entity_id)
    asset["img"] = findKeyInAttributes(attributes, "img")
    if response.status_code == 200:
        return asset
    return None

def findKeyInAttributes(attributes, key):
    for attribute in attributes:
        if attribute["key"] == key:
            return attribute["value"]
    return None

