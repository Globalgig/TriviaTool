from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_socketio import SocketIO,emit

app = Flask(__name__)
CORS(app)

teams = []
unbuzzedTeams = []
buzzedTeams = []

#API
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if data == None or data == "":
        return "Team Name not found!", 400
    if data["teamName"] in [x[0] for x in teams]:
        return "Team name already exists!", 400
    
    teams.append([data["teamName"], data["password"]])
    unbuzzedTeams.append(data["teamName"])

    return "Registered!", 200

@app.route('/buzz', methods=['POST'])
def buzz():
    data = request.get_json()
    if data == None or data == "":
        return "Buzz does not belong to any team!", 400
    if data["teamName"] not in [x[0] for x in teams]:
        return "Buzz belongs to an unregistered team!", 400
    
    buzzedTeams.append(data["teamName"])
    return "Buzzed!", 200

@app.route('/fetchStatus', methods=['GET'])
def fetchQueue():

    return jsonify([buzzedTeams, unbuzzedTeams])

@app.route('/clearBuzzes', methods=['POST'])
def clearBuzzes():
    for _ in range(len(buzzedTeams)):
        unbuzzedTeams.append(buzzedTeams.pop())

    return "Buzzes Cleared", 200

@app.route('/clearTeams', methods=['POST'])
def clearTeams():
    teams, buzzedTeams, unbuzzedTeams = [], [], []

    return "Cleared", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, ssl_context='adhoc')