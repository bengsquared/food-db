import os
from flask import Flask
from flask import request
from flask_cors import CORS
import SqlFunctions as cql
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT, ConsistencyLevel
from cassandra.policies import WhiteListRoundRobinPolicy, DowngradingConsistencyRetryPolicy
from cassandra.query import dict_factory
import json

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
def new_recipe():
    try:
        if request.method == 'POST':
            data = request.get_json()
            print(data["title"])
            result = cql.create_recipe(session=sesh,title=data["title"],description=data["description"],image=data["image"],tags=data["tags"],chefid=data["chefid"],instructions=data["instructions"],minutes=data["minutes"])
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
                recipe={
                    "id":result["id"],
                    "title":result["title"]
                    ,"tags":list(result["tags"] if result["tags"] is not None else []),
                    "description":result["description"],
                    "image":result["image"],
                    "chefid":result["chefid"],
                    "instructions":result["instructions"],
                    "minutes":result["minutes"]
                    }
                return recipe
            else:
                return ("recipe not found",404)

        if request.method == 'POST':
            print("called success")
            data = request.get_json()
            print("data")
            tagset=set(data["tags"])
            result = cql.update_recipe(session=sesh,id=data["id"],title=data["title"],description=data["description"],image=data["image"],tags=tagset,instructions=data["instructions"],minutes=data["minutes"])
            if result:
                return "recipe updated"
            else:
                return ("recipe not found",404)

        if request.method == 'DELETE':
            res=cql.delete_recipe(session=sesh,id=recipe_id)
            print(res)
            return "recipe deleted"
        else:
            return ("Method Not Allowed", 405)

    except:
        raise
        return ("internal server error - data issue", 500)

@app.route('/recipes/browse', methods = ['GET'])
def browse():
    try:
        if request.method == 'GET':
            print(request.args.get("searchterms"))
            result = cql.search_recipes(session=sesh,searchterms=request.args.get("searchterms"),tags=request.args.get("tags"),chefid=request.args.get("chefid"))
            if result:
                l=[]
                for r in result:
                    l.append({
                        "id":r["id"],
                        "title":r["title"],
                        "tags": list(r["tags"] if r["tags"] is not None else []),
                        "description":r["description"],
                        "image":r["image"],
                        "minutes":r["minutes"]
                        })

                return json.dumps(l)

            else:
                return ("No Results",404)
        else:
            return ("Method Not Allowed", 405)
    except:
        raise
        return ("internal server error - data issue", 500)
