# init flask app
from flask import Flask
from flask_cors import CORS
from routes import files_bp
app = Flask(__name__)
CORS(app, origins=["http://0.0.0.0:4001"])

PREFIX = '/api/v1'
app.register_blueprint(files_bp, url_prefix=f"{PREFIX}/files")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
    