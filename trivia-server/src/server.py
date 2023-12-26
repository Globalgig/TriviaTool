from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin
from waitress import serve

app = Flask(__name__)
CORS(app)

teams = []
unbuzzedTeams = []
buzzedTeams = []

# CLIENT ENDPOINTS
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if data == None or data == "":
        return "Team name not found!", 400
    
    # Scan all teams for a matching team name and password.
    for index in range(len(teams)):
        if data["teamName"] == teams[index][0] and data["password"] == teams[index][1]:
            return "Registered!", 200
    
    # Scan to see if team does not exist. Make a new team if so.
    if data["teamName"] not in [x[0] for x in teams]:
        teams.append([data["teamName"], data["password"]])
        unbuzzedTeams.append(data["teamName"])
        return "Registered!", 200

    # Matching team name was found but password was incorrect.
    return "Incorrect password!", 400


@app.route('/buzz', methods=['POST'])
def buzz():
    data = request.get_json()
    if data == None or data == "":
        return "Buzz does not belong to any team!", 400
    # Can factor into the password check if trying to slim down
    if data["teamName"] not in [x[0] for x in teams]:
        return "Buzz belongs to an unregistered team!", 400
    
    for index in range(len(teams)):
        if data["teamName"] == teams[index][0] and data["password"] == teams[index][1]:
            if data["teamName"] in buzzedTeams:
                return "Already reported", 208
            else:
                unbuzzedTeams.remove(teams[index][0])
                buzzedTeams.append(data["teamName"])
                return "Buzzed!", 200

    # Team name was in list but password was incorrect     
    return "Incorrect password!", 400



# SERVER FRONTEND ENDPOINTS
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
    serve(app, host='0.0.0.0', port="5000")
    #app.run(port=5000, debug=True)