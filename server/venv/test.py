import os
from flask import Flask
from flask import request
from flask_cors import CORS
import SqlFunctions as cql
from cassandra.cluster import Cluster, ExecutionProfile, EXEC_PROFILE_DEFAULT, ConsistencyLevel
from cassandra.policies import WhiteListRoundRobinPolicy, DowngradingConsistencyRetryPolicy
from cassandra.query import dict_factory
from cassandra.query import tuple_factory


profile = ExecutionProfile(
    load_balancing_policy=WhiteListRoundRobinPolicy(['192.168.1.23']),
    request_timeout=15,
    row_factory=dict_factory
)
cluster = Cluster(['192.168.1.23'])
sesh = cluster.connect()
