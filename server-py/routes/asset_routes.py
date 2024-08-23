from flask import Blueprint, jsonify, g
from services import getAssetsGroupService, getRelationInfoByFromId, getDeviceByIdService
from middleware import auth_middleware
asset_bp = Blueprint('asset_routes', __name__)

@asset_bp.route('/group', methods=['GET'])
@auth_middleware
def getAssets():
    assets = getAssetsGroupService(g.token)
    if assets:
        return assets, 200
    
    return jsonify({'message': 'Error fetching assets'}), 500
    

@asset_bp.route('/<string:entity_id>/relation', methods=['GET'])
@auth_middleware
def getAssetRelation(entity_id):
    response = getRelationInfoByFromId(g.token, entity_id, 'ASSET')
    relations = []
    for relation in response:
        relation["type"] = "SITE"
        if relation['to']['entityType'] == 'DEVICE':
                deviceInfo = getDeviceByIdService(g.token, relation['to']['id'])
                # relation["label"] = deviceInfo['name']
                # if deviceInfo["label"]:
                #     relation["label"] = deviceInfo['label']
                relation["type"] = deviceInfo['type']
                    
        
        relations.append({
            "entityType": relation['to']['entityType'],
            "id": relation['to']['id'],
            "type": relation['type'],
            "label": relation['toName']
        })
    if response:
        return relations, 200
    return jsonify({'message': 'Error fetching asset relation'}), 500
