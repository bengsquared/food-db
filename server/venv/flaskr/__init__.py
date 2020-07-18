import os
from flask import Flask
from flask import request
from flask_cors import CORS, cross_origin
import SqlFunctions as cql
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT, ConsistencyLevel
from cassandra.policies import WhiteListRoundRobinPolicy, DowngradingConsistencyRetryPolicy
from cassandra.query import dict_factory
import json
import inflection

profile = ExecutionProfile(
    load_balancing_policy=WhiteListRoundRobinPolicy(['127.0.0.1']),
    request_timeout=15,
    row_factory=dict_factory
)
cluster = Cluster(execution_profiles={EXEC_PROFILE_DEFAULT: profile})
sesh = cluster.connect("fooddb")

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

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
            recipeIngredients = cql.get_recipe_ingredients(session=sesh,recipeid=recipe_id) #id, ingredientid, ingredient, amount, listorder
            if result:
                recipe={
                    "id":result["id"],
                    "title":result["title"],
                    "tags":list(result["tags"] if result["tags"] is not None else []),
                    "description":result["description"],
                    "image":result["image"],
                    "chefid":result["chefid"],
                    "instructions":result["instructions"],
                    "ingredients":recipeIngredients,
                    "minutes":result["minutes"]
                    }
                return recipe
            else:
                return ("recipe not found",404)

        if request.method == 'POST':
            data = request.get_json()
            tagset=set(data["tags"])
            recipeIngredients = data["ingredients"]
            result = cql.update_recipe(session=sesh,id=data["id"],title=data["title"],description=data["description"],image=data["image"],tags=tagset,instructions=data["instructions"],minutes=data["minutes"])
            delres = cql.remove_recipe_ingredients(session=sesh,recipeid=data["id"])
            for i in recipeIngredients:
                cql.add_ingredient_to_recipe(session=sesh,recipeid=data["id"],ingredientid=i["ingredientid"],amount=i["amount"],name=i["name"],listorder=i["listorder"],notes=i["notes"]);
            if result:
                return "recipe updated"
            else:
                return ("recipe not found",404)

        if request.method == 'DELETE':
            res=cql.delete_recipe(session=sesh,id=recipe_id)
            ires=cql.delete_recipe_ingredients()
            print(res)
            print(ires)
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

@app.route('/ingredients', methods = ['GET','POST'])
def ingredients():
    try:
        if request.method == 'GET':
            term=request.args.get("searchterm").lower()
            procterm = inflection.singularize(term)
            result = cql.search_ingredients(session=sesh,searchTerm=procterm)
            print(result)
            if result:
                procresult = []
                if term != procterm:
                    for r in result:
                        procresult.append({"ingredientid":r["id"],"name":inflection.pluralize(r["id"])})
                else:
                    for r in result:
                        procresult.append({"ingredientid":r["id"],"name":r["id"]})
                return json.dumps(procresult)

            else:
                return ("No Results",404)

        if request.method == 'POST':
            name = request.get_json()["name"].lower()
            ingredientprocessed = inflection.singularize(name)
            result = cql.create_ingredient(session=sesh,id=ingredientprocessed)
            return {"name":name, "ingredientid":ingredientprocessed}

        else:
            return ("Method Not Allowed", 405)
    except:
        raise
        return ("internal server error - data issue", 500)
