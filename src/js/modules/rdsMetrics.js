export default {
  "BinLogDiskUsage": {
    "units": "bytes",
    "description": "The amount of disk space occupied by binary logs on the master. Applies to MySQL read replicas.",
    "title": "Bin Log Disk Usage"
  },
  "CPUUtilization": {
    "units": "percent",
    "description": "The percentage of CPU utilization.",
    "title": "CPU Utilization"
  },
  "DatabaseConnections": {
    "units": "count",
    "description": "The number of database connections in use.",
    "title": "Database Connections"
  },
  "DiskQueueDepth": {
    "units": "bytes",
    "description": "The number of outstanding IOs (read/write requests) waiting to access the disk.",
    "title": "Disk Queue Depth"
  },
  "FreeStorageSpace": {
    "units": "bytes",
    "description": "The amount of available storage space.",
    "title": "Free Storage Space"
  },
  "FreeableMemory": {
    "units": "bytes",
    "description": "The amount of available random access memory.",
    "title": "Free Memory"
  },
  "NetworkReceiveThroughput": {
    "units": "bytes/second",
    "description": "The incoming (Receive) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.",
    "title": "Network Receive Throughput"
  },
  "NetworkTransmitThroughput": {
    "units": "bytes/second",
    "description": "The outgoing (Transmit) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.",
    "title": "Network Transmit Throughput"
  },
  "ReadIOPS": {
    "units": "count/second",
    "description": "The average number of disk I/O operations per second.",
    "title": "Read IOPS"
  },
  "ReadLatency": {
    "units": "seconds",
    "description": "The average amount of time taken per disk I/O operation.",
    "title": "Read Latency"
  },
  "ReadThroughput": {
    "units": "bytes/second",
    "description": "The average number of bytes read from disk per second.",
    "title": "Read Throughput"
  },
  "ReplicaLag": {
    "units": "seconds",
    "description": "The amount of time a Read Replica DB Instance lags behind the source DB Instance. Applies to MySQL read replicas.",
    "title": "Replica Lag"
  },
  "SwapUsage": {
    "units": "bytes",
    "description": "The amount of swap space used on the DB Instance.",
    "title": "Swap Usage"
  },
  "WriteIOPS": {
    "units": "count/second",
    "description": "The average number of disk I/O operations per second.",
    "title": "Write IOPS"
  },
  "WriteLatency": {
    "units": "seconds",
    "description": "The average amount of time taken per disk I/O operation.",
    "title": "Write Latency"
  },
  "WriteThroughput": {
    "units": "bytes/second",
    "description": "The average number of bytes written to disk per second.",
    "title": "Write Throughput"
  }
}