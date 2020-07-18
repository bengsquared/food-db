from cassandra.cluster import Cluster
from fuzzywuzzy import fuzz
import uuid

def delete_chef(session,id):
    print(id)
    res = session.execute("""
        DELETE
        from chef
        where id = %s
        ;
        """,
        (id,)
    )
    print(res)
    return

def get_chef_id(session,username):
    res = session.execute("""
        select id
        from chef
        where username = %s
        ;
        """,
        (username,)
    )
    try:
        return res.one()["id"]
    except:
        return False

def get_chef(session,id):
    res = session.execute("""
        select id,username,name,bio,image
        from chef
        where id = %s
        ;
        """,
        (id,)
    )
    if res.one() is not None:
        return res.one()
    else:
        return False

def create_chef(session,username,name,bio,image):
    res=session.execute("select count(username) as count from chef where username = %s;", (username,))
    if res.one()["count"]>0:
        return False
    else:
        newid = str(uuid.uuid1())
        session.execute("""
            insert into chef (id,bio,image,name,username)
            values(%s,%s,%s,%s,%s)
            ;
            """, (newid,bio,image,name,username)
        )
        return newid

def update_chef(session,id,username,name,bio,image):
    res=session.execute("select count(id) as count from chef where id = %s;", (id,))
    if res.one()["count"]!=1:
        return False
    else:
        res=session.execute("update chef set username = %s, name = %s, bio = %s, image = %s where id = %s;"
            , (username,name,bio,image,id))
        return True

def delete_recipe(session,id):
    print(id)
    res = session.execute("""
        DELETE
        from recipe
        where id = %s
        ;
        """,
        (id,)
    )
    print(res)
    return

def get_recipe(session,id):
    print("here1")
    res = session.execute("""
        select *
        from recipe
        where id = %s
        ;
        """,
        (id,)
    )
    if res.one() is not None:
        return res.one()
    else:
        return False

#dd2bd2b6-c250-11ea-88f5-f018986d7a1d
#4508cd9e-c251-11ea-bd61-f018986d7a1d
def create_recipe(session,chefid,title,description,instructions,minutes,image,tags):
    tags={l for l in tags}
    print(tags)
    newid = str(uuid.uuid1())
    session.execute("""
        insert into recipe (id,chefid,title,description,instructions,minutes,image,tags)
        values(%s,%s,%s,%s,%s,%s,%s,%s)
        ;
        """, (newid,chefid,title,description,instructions,minutes,image,tags)
    )
    return newid

def update_recipe(session,id,title,description,instructions,minutes,image,tags):
    res=session.execute("select count(id) as count from recipe where id = %s;", (id,))
    if res.one()["count"]!=1:
        return False
    else:
        res=session.execute("""
        update recipe set title = %(t)s,
        description = %(d)s,
        instructions = %(i)s,
        minutes = %(m)s,
        image = %(img)s,
        tags = %(tag)s
        where id = %(id)s;
        """
            , {'t': title,'d': description,'i': instructions,'m': minutes,'img': image,'tag': tags,'id': id}
        )
        return True

def search_recipes(session,searchterms,chefid,tags):

    res=session.execute("""
        select id, title, description,minutes,image,tags
        from fooddb.recipe
        where chefid = %(chefid)s
        ;
        """
        , {'chefid': chefid,}
    ).all()
    filteredres=list(filter(lambda row: ((fuzz.token_set_ratio(searchterms.lower(),row["title"].lower()) if searchterms.lower()!="" else 100)>80 or (fuzz.token_set_ratio(searchterms.lower(),row["description"].lower()) if searchterms.lower()!="" else 100)>80 or (len(row["tags"].intersection(tags)) if row["tags"] is not None and tags is not None else 0)>0),res))
    return filteredres


def delete_recipe(session,id):
    res = session.execute("""
        DELETE
        from recipe
        where id = %s
        ;
        """,
        (id,)
    )
    return res


def search_ingredients(session,searchTerm):
    term = searchTerm + '%'
    print(term)
    print(type(term))
    res = session.execute("""
        select id from fooddb.ingredient
        where searchname like %s
        ;
        """,
        (term,)
    ).all()
    print(res)
    return res

def create_ingredient(session,id):
    res = session.execute("""
        INSERT INTO fooddb.ingredient(id,searchname)
        values(%s,%s)
        ;
        """,
        (id,id)
    )
    print(res)
    return

def remove_recipe_ingredients(session,recipeid):
    res = session.execute("""
        select id from fooddb.recipeingredientxref
        where recipeid = %s
        ;
        """,
        (recipeid,)
    ).all()
    for row in res:
        remove_ingredient_from_recipe(session=session,id=row["id"])
    return

def remove_ingredient_from_recipe(session,id):
    res = session.execute_async("""
        DELETE from fooddb.recipeingredientxref
        where id = %s
        ;
        """,
        (id,)
    )
    return

def add_ingredient_to_recipe(session,recipeid,ingredientid,amount,name,listorder,notes):
    id = ingredientid + recipeid
    res = session.execute("""
        INSERT INTO fooddb.recipeingredientxref(id,recipeid,ingredientid,amount,name,listorder,notes)
        values(%s,%s,%s,%s,%s,%s,%s)
        ;
        """,
        (id,recipeid,ingredientid,amount,name,listorder,notes)
    )
    return

def get_recipe_ingredients(session,recipeid):
    res = session.execute("""
        select id, ingredientid, amount, name,listorder,notes from fooddb.recipeingredientxref
        where recipeid = %s
        ;
        """,
        (recipeid,)
    );
    return res.all()
