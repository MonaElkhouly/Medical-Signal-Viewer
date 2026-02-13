from flask import Flask, render_template, request, jsonify
import os
import wfdb
import numpy as np

app = Flask(__name__)
UPLOAD_FOLDER = "uploads"
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/upload/<channel>", methods=["POST"])
def upload_file(channel):
    file = request.files["file"]
    filename = file.filename
    filepath = os.path.join(app.config["UPLOAD_FOLDER"], filename)
    file.save(filepath)

    # Remove extension
    record_name = filename.split(".")[0]

    try:
        record = wfdb.rdrecord(os.path.join(UPLOAD_FOLDER, record_name))
        signal = record.p_signal.tolist()
        fs = record.fs

        return jsonify({
            "success": True,
            "signal": signal,
            "fs": fs,
            "channel": channel,
            "label": record_name
        })

    except Exception as e:
        return jsonify({"success": False, "error": str(e)})


if __name__ == "__main__":
    app.run(debug=True)
