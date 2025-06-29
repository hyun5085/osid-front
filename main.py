import os
from flask import Flask, send_from_directory, jsonify

app = Flask(__name__, static_folder='.', static_url_path='')
app.config['JSON_AS_ASCII'] = False


# Simple routes for static file serving
@app.route('/')
def index():
    resp = send_from_directory('.', 'index.html')
    resp.headers['Content-Type'] = 'text/html; charset=utf-8'
    return resp
    # return send_from_directory('.', 'index.html')


@app.route('/<path:filename>')
def serve_file(filename):
    return send_from_directory('.', filename)

# Health check endpoint
@app.route('/health')
def health():
    resp = jsonify({
        "status": "ok",
        "message": "프리미어 자동차 Frontend is running"
    })
    resp.headers['Content-Type'] = 'application/json; charset=utf-8'
    return resp
    # return jsonify({"status": "ok", "message": "프리미어 자동차 Frontend is running"})

if __name__ == '__main__':
    # Use port 5000 to match the workflow configuration
    app.run(host='0.0.0.0', port=5000, debug=True)