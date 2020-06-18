from cassandra.cluster import Cluster
import SqlFunctions as sql
import uuid
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT, ConsistencyLevel
from cassandra.policies import WhiteListRoundRobinPolicy, DowngradingConsistencyRetryPolicy
from cassandra.query import dict_factory

profile = ExecutionProfile(
    load_balancing_policy=WhiteListRoundRobinPolicy(['127.0.0.1']),
    retry_policy=DowngradingConsistencyRetryPolicy(),
    consistency_level=ConsistencyLevel.LOCAL_QUORUM,
    serial_consistency_level=ConsistencyLevel.LOCAL_SERIAL,
    request_timeout=15,
    row_factory=dict_factory
)
cluster = Cluster(execution_profiles={EXEC_PROFILE_DEFAULT: profile})
sesh = cluster.connect("fooddb")

######## GET A CHEF
#
# chefid = sql.get_chef_id(session=sesh,username="jam")
# print(chefid)

# if chefid != 0:
#     seth=sql.get_chef(session=sesh,id=chefid)
#     try:
#         print(seth)
#     except:
#         print("no chef with this id")
# else:
#     print("newboii does not exist")
#


######## CREATE CHEF
#
# newchefid = sql.create_chef(session=sesh,username="jam",name="ben",bio="the maker",image=None)
#
# print(newchefid)
# newchef = sql.get_chef(session=sesh,id=newchefid)

# try:
#     print(newchef)
# except:
#     print("no results found")


####### UPDATE CHEF

chefid = sql.get_chef_id(session=sesh,username="there")
print(chefid)

res = sql.update_chef(session=sesh,id="34",username="there",bio=None,name=None,image=None)
print(res)
print(res.one())

cluster.shutdown()
