from flask import Blueprint, jsonify, request
from templates.defaults.pdf_template import create_default_pdf
from templates.defaults.excel_template import create_default_excel
import json
files_bp = Blueprint('files', __name__)

@files_bp.route('/', methods=['POST'])
def generate_file():
    # get body from request
    body =  request.get_json()
    if not body:
        return jsonify({"error": "No data provided"}), 400

    file_template = body.get("template")
    get_file_template(file_template, body)
    return jsonify({"message": "PDF generado con éxito"})



def get_file_template(template_name, data):
   if template_name == "pdf":
        return create_default_pdf(data, "default_pdf")
   elif template_name == "excel":
        from templates.defaults.excel_template import create_default_excel
        return create_default_excel(data, "default_excel")