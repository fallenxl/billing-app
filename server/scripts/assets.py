import requests

HEADERS = {}

CREDENTIALS = {
    "username": "axl.santos@lumenenergysolutions.com",
    "password": "Asantos_10",
}


def login():
    response = requests.post(
        "https://dashboard.lumenenergysolutions.com/api/auth/login", json=CREDENTIALS
    )
    HEADERS["Authorization"] = f"Bearer {response.json()['token']}"


login()

ASSETS_NAME = [
    "Pollos el Hondureño",
    "Mayday",
    "Expresso Americano",
    "Baleadas Express",
    "PUG2",
    "Pizza Hut",
    "Kielsa",
    "Jalapeños",
    "DoSantos",
    "Fum Yim",
    "Burger King",
    "Bac",
    "Paseo Universitario",
    "FICOHSA",
    "PFC",
    "Pollos el Exito",
]

PROFILE_ID = "bd05c690-5c0c-11ef-bddc-35cbd8dc8d8e" #Local Profile


def create_assets():
    for name in ASSETS_NAME:
        payload = {
            "name": name,
            "label": name,
            "assetProfileId": {"id": PROFILE_ID, "entityType": "ASSET_PROFILE"},
            "additionalInfo": {},
        }
        response = requests.post(
            "https://dashboard.lumenenergysolutions.com/api/asset",
            json=payload,
            headers=HEADERS,
        )
        create_relations("dd68fc20-5a60-11ef-aa15-a127638e3a77", response.json()["id"]["id"])



def create_relations(from_asset_id, to_asset_id):
    url = "https://dashboard.lumenenergysolutions.com/api/relation"
    payload = {
        "type": "Contains",
        "additionalInfo": None,
        "typeGroup": "COMMON",
        "from": {"entityType": "ASSET", "id": from_asset_id},
        "to": {"entityType": "ASSET", "id": to_asset_id},
    }
    response =requests.post("https://dashboard.lumenenergysolutions.com/api/relation", json=payload, headers=HEADERS)
    print(response)
   
create_assets()



