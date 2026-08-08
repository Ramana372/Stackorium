## Introduction to Elasticsearch

Elasticsearch is a distributed, RESTful search and analytics engine built on top of Apache Lucene. It stores data as JSON documents and is designed for full-text search, log analytics, and real-time data exploration at scale, powering everything from e-commerce search bars to observability platforms.

### Why Choose Elasticsearch?

- **Full-Text Search**: Fast, relevance-ranked search across massive text datasets
- **Distributed by Design**: Horizontally scalable across many nodes with automatic sharding
- **Near Real-Time**: Documents become searchable within about a second of being indexed
- **Schema Flexibility**: Dynamic mapping infers field types from JSON documents
- **Powerful Aggregations**: Analytics engine for metrics, histograms, and bucketed data
- **Rich Ecosystem**: Pairs with Kibana for visualization and Logstash/Beats for ingestion (the "ELK Stack")

### Key Features

- **Inverted Index**: The core data structure enabling fast full-text search
- **RESTful API**: Every operation is a simple HTTP request with JSON
- **Aggregations Framework**: Bucket, metric, and pipeline aggregations for analytics
- **Relevance Scoring**: BM25 algorithm ranks results by relevance out of the box
- **Multi-Tenancy**: Indices, aliases, and index lifecycle management for organizing data
- **Vector Search**: Dense vector fields for semantic and kNN search
- **Security**: Role-based access control, encryption, and audit logging (via Elastic Stack security)

## Installation

### Windows Installation

```bash
# Download from https://www.elastic.co/downloads/elasticsearch
# Extract the archive, then run:
.\bin\elasticsearch.bat

# Or using Chocolatey:
choco install elasticsearch

# Verify it's running
curl http://localhost:9200
```

### macOS Installation

```bash
# Using Homebrew
brew tap elastic/tap
brew install elastic/tap/elasticsearch-full

# Start Elasticsearch
elasticsearch

# Or run via Docker (recommended for local dev)
docker run -p 9200:9200 -p 9300:9300 \
  -e "discovery.type=single-node" \
  -e "xpack.security.enabled=false" \
  docker.elastic.co/elasticsearch/elasticsearch:8.15.0

# Verify installation
curl http://localhost:9200
```

### Linux (Ubuntu/Debian) Installation

```bash
# Import the Elastic GPG key
wget -qO - https://artifacts.elastic.co/GPG-KEY-elasticsearch | sudo gpg --dearmor -o /usr/share/keyrings/elastic.gpg

# Add the repository
echo "deb [signed-by=/usr/share/keyrings/elastic.gpg] https://artifacts.elastic.co/packages/8.x/apt stable main" | \
  sudo tee /etc/apt/sources.list.d/elastic-8.x.list

# Install Elasticsearch
sudo apt update
sudo apt install elasticsearch

# Start the service
sudo systemctl start elasticsearch
sudo systemctl enable elasticsearch

# Verify installation
curl -X GET "localhost:9200"
```

## Getting Started

### Connecting to Elasticsearch

```bash
# Basic health check
curl http://localhost:9200

# Cluster health
curl http://localhost:9200/_cluster/health?pretty

# With authentication (when security is enabled)
curl -u elastic:password http://localhost:9200

# List all indices
curl http://localhost:9200/_cat/indices?v
```

### Kibana (GUI Tool)

```bash
# Run via Docker alongside Elasticsearch
docker run -p 5601:5601 \
  -e "ELASTICSEARCH_HOSTS=http://localhost:9200" \
  docker.elastic.co/kibana/kibana:8.15.0

# Access at http://localhost:5601
```

## Core Concepts

```
Cluster    -> A collection of nodes working together
Node       -> A single running instance of Elasticsearch
Index      -> A collection of documents (similar to a database)
Document   -> A single JSON record (similar to a row)
Field      -> A key-value pair within a document (similar to a column)
Shard      -> A subdivision of an index for horizontal scaling
Replica    -> A copy of a shard for redundancy and read throughput
```

## Index Operations

### Creating and Managing Indices

```bash
# Create an index
curl -X PUT "localhost:9200/products" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "number_of_shards": 3,
    "number_of_replicas": 1
  }
}'

# Create an index with explicit mapping
curl -X PUT "localhost:9200/posts" -H 'Content-Type: application/json' -d'
{
  "mappings": {
    "properties": {
      "title":     { "type": "text" },
      "content":   { "type": "text" },
      "author":    { "type": "keyword" },
      "tags":      { "type": "keyword" },
      "views":     { "type": "integer" },
      "published": { "type": "date" }
    }
  }
}'

# View index mapping
curl "localhost:9200/posts/_mapping?pretty"

# Delete an index
curl -X DELETE "localhost:9200/products"

# List all indices with stats
curl "localhost:9200/_cat/indices?v&s=index"
```

## CRUD Operations

### Indexing (Insert) Documents

```bash
# Index a document with a specific ID
curl -X PUT "localhost:9200/posts/_doc/1" -H 'Content-Type: application/json' -d'
{
  "title": "Getting Started with Elasticsearch",
  "content": "Elasticsearch is a distributed search engine...",
  "author": "jane_doe",
  "tags": ["search", "elasticsearch"],
  "views": 0,
  "published": "2025-01-15"
}'

# Index a document with an auto-generated ID
curl -X POST "localhost:9200/posts/_doc" -H 'Content-Type: application/json' -d'
{
  "title": "Advanced Query DSL",
  "content": "Learn how to write complex queries...",
  "author": "john_doe"
}'

# Bulk insert multiple documents
curl -X POST "localhost:9200/_bulk" -H 'Content-Type: application/json' -d'
{ "index": { "_index": "posts", "_id": "2" } }
{ "title": "Second Post", "author": "jane_doe" }
{ "index": { "_index": "posts", "_id": "3" } }
{ "title": "Third Post", "author": "john_doe" }
'
```

### Retrieving Documents

```bash
# Get a document by ID
curl "localhost:9200/posts/_doc/1"

# Check if a document exists
curl -I "localhost:9200/posts/_doc/1"

# Get multiple documents by ID
curl -X GET "localhost:9200/_mget" -H 'Content-Type: application/json' -d'
{
  "docs": [
    { "_index": "posts", "_id": "1" },
    { "_index": "posts", "_id": "2" }
  ]
}'
```

### Updating Documents

```bash
# Partial update
curl -X POST "localhost:9200/posts/_update/1" -H 'Content-Type: application/json' -d'
{
  "doc": { "views": 150 }
}'

# Update with a script
curl -X POST "localhost:9200/posts/_update/1" -H 'Content-Type: application/json' -d'
{
  "script": {
    "source": "ctx._source.views += params.increment",
    "params": { "increment": 1 }
  }
}'

# Update by query (bulk update matching a filter)
curl -X POST "localhost:9200/posts/_update_by_query" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "author": "jane_doe" } },
  "script": { "source": "ctx._source.featured = true" }
}'
```

### Deleting Documents

```bash
# Delete a document by ID
curl -X DELETE "localhost:9200/posts/_doc/1"

# Delete by query
curl -X POST "localhost:9200/posts/_delete_by_query" -H 'Content-Type: application/json' -d'
{
  "query": { "range": { "published": { "lt": "2020-01-01" } } }
}'
```

## Search Queries

### Basic Search

```bash
# Search all documents
curl "localhost:9200/posts/_search?pretty"

# Simple match query
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "title": "elasticsearch" } }
}'

# Exact match on keyword field
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "term": { "author": "jane_doe" } }
}'
```

### Compound Queries

```bash
# Bool query combining multiple conditions
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "bool": {
      "must":     [{ "match": { "content": "search engine" } }],
      "filter":   [{ "term": { "author": "jane_doe" } }],
      "should":   [{ "match": { "tags": "featured" } }],
      "must_not": [{ "range": { "views": { "lt": 10 } } }]
    }
  }
}'

# Range query
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": {
    "range": { "published": { "gte": "2024-01-01", "lte": "2024-12-31" } }
  }
}'

# Fuzzy search (typo tolerance)
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "fuzzy": { "title": { "value": "elasticsarch", "fuzziness": "AUTO" } } }
}'
```

### Sorting and Pagination

```bash
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "match_all": {} },
  "sort": [{ "published": "desc" }],
  "from": 0,
  "size": 10
}'
```

## Aggregations

```bash
# Terms aggregation (like GROUP BY)
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "posts_per_author": {
      "terms": { "field": "author" }
    }
  }
}'

# Metric aggregations
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "avg_views": { "avg": { "field": "views" } },
    "max_views": { "max": { "field": "views" } }
  }
}'

# Date histogram
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "posts_over_time": {
      "date_histogram": { "field": "published", "calendar_interval": "month" }
    }
  }
}'

# Nested aggregations
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "size": 0,
  "aggs": {
    "by_author": {
      "terms": { "field": "author" },
      "aggs": {
        "avg_views": { "avg": { "field": "views" } }
      }
    }
  }
}'
```

## Analyzers and Text Search

```bash
# Test an analyzer
curl -X GET "localhost:9200/_analyze" -H 'Content-Type: application/json' -d'
{
  "analyzer": "standard",
  "text": "The Quick Brown Fox Jumps!"
}'

# Custom analyzer with a mapping
curl -X PUT "localhost:9200/articles" -H 'Content-Type: application/json' -d'
{
  "settings": {
    "analysis": {
      "analyzer": {
        "custom_analyzer": {
          "type": "custom",
          "tokenizer": "standard",
          "filter": ["lowercase", "stop", "snowball"]
        }
      }
    }
  },
  "mappings": {
    "properties": {
      "content": { "type": "text", "analyzer": "custom_analyzer" }
    }
  }
}'

# Highlight matched terms in search results
curl -X GET "localhost:9200/posts/_search" -H 'Content-Type: application/json' -d'
{
  "query": { "match": { "content": "search" } },
  "highlight": { "fields": { "content": {} } }
}'
```

## Index Lifecycle Management

```bash
# Create an ILM policy (rollover after 7 days or 50GB)
curl -X PUT "localhost:9200/_ilm/policy/logs_policy" -H 'Content-Type: application/json' -d'
{
  "policy": {
    "phases": {
      "hot": {
        "actions": {
          "rollover": { "max_age": "7d", "max_size": "50gb" }
        }
      },
      "delete": {
        "min_age": "90d",
        "actions": { "delete": {} }
      }
    }
  }
}'

# Create an index alias
curl -X POST "localhost:9200/_aliases" -H 'Content-Type: application/json' -d'
{
  "actions": [
    { "add": { "index": "posts", "alias": "posts_current" } }
  ]
}'
```

## Backup and Restore (Snapshots)

```bash
# Register a snapshot repository
curl -X PUT "localhost:9200/_snapshot/my_backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": { "location": "/mnt/backups" }
}'

# Take a snapshot
curl -X PUT "localhost:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"

# List snapshots
curl "localhost:9200/_snapshot/my_backup/_all"

# Restore a snapshot
curl -X POST "localhost:9200/_snapshot/my_backup/snapshot_1/_restore"
```

## Security

```bash
# Create a role with restricted access
curl -X POST "localhost:9200/_security/role/posts_reader" -H 'Content-Type: application/json' -d'
{
  "indices": [
    { "names": ["posts"], "privileges": ["read"] }
  ]
}'

# Create a user with that role
curl -X POST "localhost:9200/_security/user/readonly_user" -H 'Content-Type: application/json' -d'
{
  "password": "strongpassword",
  "roles": ["posts_reader"]
}'
```

## Monitoring

```bash
# Cluster health (green/yellow/red)
curl "localhost:9200/_cluster/health?pretty"

# Node stats
curl "localhost:9200/_nodes/stats?pretty"

# Index stats
curl "localhost:9200/posts/_stats?pretty"

# Pending tasks
curl "localhost:9200/_cluster/pending_tasks?pretty"

# Shard allocation
curl "localhost:9200/_cat/shards?v"
```

## Best Practices

- **Design mappings explicitly** rather than relying entirely on dynamic mapping for production indices
- **Use `keyword` for exact matches/aggregations and `text` for full-text search** on the same field via multi-fields when both are needed
- **Right-size shards** — aim for shards between 10–50GB; too many small shards hurts cluster performance
- **Use bulk APIs** for indexing large volumes of documents instead of individual requests
- **Apply ILM policies** to manage the lifecycle of time-series data like logs
- **Avoid deep pagination** with `from`/`size` — use `search_after` for large result sets
- **Monitor cluster health** and set up replicas for fault tolerance

## Resources

- **Official Documentation**: [Elasticsearch Docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- **Query DSL Reference**: [Query DSL](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl.html)
- **Kibana**: [Kibana Docs](https://www.elastic.co/guide/en/kibana/current/index.html)
- **Elastic Community**: [Discuss Forums](https://discuss.elastic.co/)

## Summary

Elasticsearch is the standard for search and analytics at scale:

✅ Fast, relevance-ranked full-text search
✅ Distributed architecture that scales horizontally
✅ Powerful aggregations for real-time analytics
✅ Near real-time indexing and search
✅ Flexible schema with explicit mapping control
✅ Rich ecosystem via the Elastic Stack (Kibana, Logstash, Beats)

Master Elasticsearch to power search bars, log analytics, and observability dashboards!
