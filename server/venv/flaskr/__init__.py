import os
from flask import Flask
from flask import request
from flask_cors import CORS
import SqlFunctions as cql
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT, ConsistencyLevel
from cassandra.policies import WhiteListRoundRobinPolicy, DowngradingConsistencyRetryPolicy
from cassandra.query import dict_factory

profile = ExecutionProfile(
    load_balancing_policy=WhiteListRoundRobinPolicy(['127.0.0.1']),
    request_timeout=15,
    row_factory=dict_factory
)
cluster = Cluster(execution_profiles={EXEC_PROFILE_DEFAULT: profile})
sesh = cluster.connect("fooddb")

app = Flask(__name__)
cors = CORS(app)

@app.route('/chef/<user_id>', methods = ['GET', 'POST', 'DELETE'])
def chef(user_id):
    try:
        if request.method == 'GET':
            result = cql.get_chef(session=sesh,id=user_id)
            if result:
                return result
            else:
                return ("chef not found",404)

        if request.method == 'POST':
            data = request.get_json()
            result = cql.update_chef(session=sesh,id=user_id,username=data["username"],name=data["name"],bio=data["bio"],image=data["image"])
            if result:
                return "user updated"
            else:
                return ("chef not found",404)

        if request.method == 'DELETE':
            cql.delete_chef(session=sesh,id=user_id)
            return "user deleted"

        else:
            return ("Method Not Allowed", 405)

    except:
        return ("internal server error - data issue", 500)


@app.route('/login', methods = ['POST'])
def login():
    try:
        if request.method == 'POST':
            print('ok')
            print(request)
            data = request.get_json()
            un=data["username"]
            result = cql.get_chef_id(session=sesh,username=un)
            if result:
                return result
            else:
                return ("user not found",404)

        else:
            return ("Method Not Allowed", 405)

    except:
        return ("internal server error - data issue", 500)

@app.route('/signup', methods = ['POST'])
def signup():
    try:
        if request.method == 'POST':
            data = request.get_json()
            result = cql.create_chef(session=sesh,username=data["username"],name=data["name"],bio=data["bio"],image=data["image"])
            if result:
                return result
            else:
                return ("username taken",401)
        else:
            return ("Method Not Allowed", 405)
    except:
        return ("internal server error - data issue", 500)

@app.route('/recipes/new-recipe', methods = ['POST'])
def signup():
    try:
        if request.method == 'POST':
            data = request.get_json()
            result = cql.create_recipe(session=sesh,title=data["title"],name=data["name"],description=data["bio"],image=data["image"],tags=data["tags"],chefid=data["chefid"],instructions=data["instructions"],minutes=data["minutes"])
            if result:
                return result
            else:
                return ("Internal server error when creating recipe in database",401)
        else:
            return ("Method Not Allowed", 405)
    except:
        return ("internal server error - data issue", 500)

@app.route('/recipes/browse/<recipe_id>', methods = ['GET', 'POST', 'DELETE'])
def recipe(recipe_id):
    try:
        if request.method == 'GET':
            result = cql.get_recipe(session=sesh,id=recipe_id)
            if result:
                return result
            else:
                return ("chef not found",404)

        if request.method == 'POST':
            data = request.get_json()
            result = cql.update_recipe(session=sesh,id=data["id"],title=data["title"],name=data["name"],description=data["bio"],image=data["image"],tags=data["tags"],chefid=data["chefid"],instructions=data["instructions"],minutes=data["minutes"])
            if result:
                return "user updated"
            else:
                return ("chef not found",404)

        if request.method == 'DELETE':
            cql.delete_chef(session=sesh,id=user_id)
            return "user deleted"

        else:
            return ("Method Not Allowed", 405)

    except:
        return ("internal server error - data issue", 500)

@app.route('/recipes/browse', methods = ['GET'])
def browse():
    try:
        if request.method == 'GET':
            data = request.get_json()
            result = cql.create_chef(session=sesh,searchterms=data["searchterms"],tags=data["tags"],chefid=data["chefid"])
            if result:
                return result
            else:
                return ("username taken",401)
        else:
            return ("Method Not Allowed", 405)
    except:
        return ("internal server error - data issue", 500)
