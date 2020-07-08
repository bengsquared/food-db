from cassandra.cluster import Cluster
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
    res = session.execute("""
        select * , WRITETIME(id)
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

def create_recipe(session,chefid,title,description,instructions,minutes,image,tags):
    res=session.execute("select count(username) as count from chef where username = %s;", (username,))
    if res.one()["count"]>0:
        return False
    else:
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
    let filterstring = ''
    let rankstring = ''
    for tag in tags
        filterstring=filterstring + " or tags contains '" + tag + "'"
        rankstring=rankstring + " + case when tags contains '" + tag + "' then 1 else 0 end"
    
    res=session.execute("""
        select id, title, description,minutes,image,tags
        from recipe
        where chefid = %(chefid)s
        and ( title ~ %(searchterms)s
            or description ~ %(searchterms)s
            %(filterstring)s
        )
        order by (
            case when title ~ %(searchterms)s then 2 else 0 end
            + case when description ~ %(searchterms)s then 1 else 0 end
            %(rankstring)s
        ) desc
        ;
        """
        , {'searchterms': searchterms,'filterstring': filterstring,'rankstring': rankstring,'chefid': chefid}
    )
    return


def search_tags(session,tags):

    return
