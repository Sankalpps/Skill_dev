from flask import Flask, jsonify, render_template

app = Flask(__name__)

@app.get("/") 
def home(): 
    return render_template("index.html")

@app.get("/health")
def health(): 
    return jsonify(status="ok", application="Mevi Flask Demo")

@app.get("/api/greet/<name>") 
def greet(name): 
    return jsonify(message=f"Hello, {name}!")

if __name__=="__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)