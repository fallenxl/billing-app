from flask import Blueprint, jsonify, g
from services import getCustomerByIdService, getRelationInfoByFromId
from middleware import auth_middleware
customer_bp = Blueprint('customer_routes', __name__)

@customer_bp.route('/<string:entity_id>', methods=['GET'])
@auth_middleware
def getCustomer(entity_id):
    response = getCustomerByIdService(g.token, entity_id)
    if response:
        return response, 200
    return jsonify({'message': 'Error fetching customer'}), 500
    
    
@customer_bp.route('/<string:entity_id>/relation', methods=['GET'])
@auth_middleware
def getCustomerRelation(entity_id):
    response = getRelationInfoByFromId(g.token, entity_id, 'CUSTOMER')
    relations = []
    for relation in response:
       
        label = relation['toName'] 
        if relation['to']['entityType'] == 'ASSET':
            relation['type'] = 'SITE'
        relations.append({
            "entityType": relation['to']['entityType'],
            "id": relation['to']['id'],
            "type": relation['type'],
            "label": label
        })
    if response:
        return response, 200
    return jsonify({'message': 'Error fetching customer relation'}), 500