from flask import Flask, jsonify, request, send_from_directory
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
FRONTEND = ROOT / "frontend"
app = Flask(__name__, static_folder=str(FRONTEND), static_url_path="/static")


@app.get("/")
def index():
    return send_from_directory(FRONTEND, "index.html")


@app.get("/api/health")
def health_check():
    return jsonify({"status": "ok", "app": "SwasthSaathi demo"})


@app.post("/api/chat")
def chat():
    payload = request.get_json(silent=True) or {}
    message = str(payload.get("message", "")).strip()
    if not message:
        return jsonify({"error": "Please enter a message."}), 400

    # Basic demo response. Connect a vetted healthcare information service
    # only after adding appropriate privacy, safety, and clinical safeguards.
    reply = (
        "Thanks for sharing. I can help you organize general wellness questions "
        "and prepare topics to discuss with a healthcare professional. I can't "
        "diagnose conditions or recommend treatment. If you think this may be "
        "an emergency, contact local emergency services immediately."
    )
    return jsonify({"reply": reply})


if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
