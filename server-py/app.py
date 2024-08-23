# flask 
from flask import Flask, request, jsonify
from flask_cors import CORS
from routes import auth_bp,asset_bp,customer_bp
from config import API_PREFIX

app = Flask(__name__)
CORS(app)


app.register_blueprint(auth_bp, url_prefix=f"{API_PREFIX}/auth")
app.register_blueprint(asset_bp, url_prefix=f"{API_PREFIX}/assets")
app.register_blueprint(customer_bp, url_prefix=f"{API_PREFIX}/customer")
if __name__ == '__main__':
    app.run(debug=True, host='localhost', port=4001)