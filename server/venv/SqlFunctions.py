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
