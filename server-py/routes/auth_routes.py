from flask import Blueprint, request,g 
from config import TB_API
from services import loginService, getCurrentUserService
from middleware import auth_middleware
auth_bp = Blueprint('auth_routes', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    body = request.get_json()
    username = body.get('username')
    password = body.get('password')
    response = loginService(username, password)
    if response:
        return response, 200
    return {"message": "Invalid username or password"}, 401
    
    
@auth_bp.route('/current', methods=['GET'])
@auth_middleware
def getCurrentUser():
    response = getCurrentUserService(g.token)
    if response:
        return response, 200
    return {"message": "Unauthorized"}, 401
    
