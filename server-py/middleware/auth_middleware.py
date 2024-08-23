from flask import request, jsonify,g
from functools import wraps

def auth_middleware(func):
    @wraps(func)
    def decorated(*args, **kwargs):
        token = request.headers.get('Authorization')
        
        if not token or not token.startswith('Bearer '):
            return jsonify({"error": "Token missing or invalid"}), 401
        
        token = token.split(" ")[1]
                
        # Guardar el token globalmente usando 'g'
        g.token = token
        
        return func(*args, **kwargs)
    
    return decorated