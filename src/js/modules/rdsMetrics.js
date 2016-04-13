export default {
  BinLogDiskUsage: {
    units: 'bytes',
    description: 'The amount of disk space occupied by binary logs on the master. Applies to MySQL read replicas.'
  },

  CPUUtilization: {
    units: 'percent',
    description: 'The percentage of CPU utilization.'
  },

  DatabaseConnections: {
    units: 'count',
    description: 'The number of database connections in use.'
  },

  DiskQueueDepth: {
    units: 'bytes',
    description: 'The number of outstanding IOs (read/write requests) waiting to access the disk.'
  },

  FreeableMemory: {
    units: 'bytes',
    description: 'The amount of available random access memory.'
  },

  FreeStorageSpace: {
    units: 'bytes',
    description: 'The amount of available storage space.'
  },

  ReplicaLag: {
    units: 'seconds',
    description: 'The amount of time a Read Replica DB Instance lags behind the source DB Instance. Applies to MySQL read replicas.'
  },

  SwapUsage: {
    units: 'bytes',
    description: 'The amount of swap space used on the DB Instance.'
  },

  ReadIOPS: {
    units: 'count/second',
    description: 'The average number of disk I/O operations per second.'
  },

  WriteIOPS: {
    units: 'count/second',
    description: 'The average number of disk I/O operations per second.'
  },

  ReadLatency: {
    units: 'seconds',
    description: 'The average amount of time taken per disk I/O operation.'
  },

  WriteLatency: {
    units: 'seconds',
    description: 'The average amount of time taken per disk I/O operation.'
  },

  ReadThroughput: {
    units: 'bytes/second',
    description: 'The average number of bytes read from disk per second.'
  },

  WriteThroughput: {
    units: 'bytes/second',
    description: 'The average number of bytes written to disk per second.'
  },

  NetworkReceiveThroughput: {
    units: 'bytes/second',
    description: 'The incoming (Receive) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.'
  },

  NetworkTransmitThroughput: {
    units: 'bytes/second',
    description: 'The outgoing (Transmit) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.'
  }
};