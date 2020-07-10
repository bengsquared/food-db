CREATE KEYSPACE fooddb WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '2'}  AND durable_writes = true;

CREATE TABLE fooddb.chef (
    id text PRIMARY KEY,
    bio text,
    image text,
    name text,
    username text
) WITH bloom_filter_fp_chance = 0.01
    AND caching = {'keys': 'ALL', 'rows_per_partition': 'NONE'}
    AND comment = ''
    AND compaction = {'class': 'org.apache.cassandra.db.compaction.SizeTieredCompactionStrategy', 'max_threshold': '32', 'min_threshold': '4'}
    AND compression = {'chunk_length_in_kb': '64', 'class': 'org.apache.cassandra.io.compress.LZ4Compressor'}
    AND crc_check_chance = 1.0
    AND dclocal_read_repair_chance = 0.1
    AND default_time_to_live = 0
    AND gc_grace_seconds = 864000
    AND max_index_interval = 2048
    AND memtable_flush_period_in_ms = 0
    AND min_index_interval = 128
    AND read_repair_chance = 0.0
    AND speculative_retry = '99PERCENTILE';
CREATE INDEX chef_username_idx ON fooddb.chef (username);

CREATE TABLE fooddb.recipe (
id text PRIMARY KEY,
chefid text,
title text,
description text,
instructions text,
minutes int,
image text,
tags set<text>
);
CREATE INDEX tags_idx ON fooddb.recipe (tags);
CREATE INDEX chefid_idx ON fooddb.recipe (chefid);
CREATE INDEX title_idx ON fooddb.recipe (title);
CREATE INDEX minutes_idx ON fooddb.recipe (minutes);
