/*eslint-disable quotes*/
export default {
  BinLogDiskUsage: {
    units: "bytes",
    description: "The amount of disk space occupied by binary logs on the master. Applies to MySQL read replicas.",
    title: "Bin Log Disk Usage",
    types: [
      "rds"
    ]
  },
  CPUUtilization: {
    units: "percent",
    description: "The percentage of CPU utilization.",
    title: "CPU Utilization",
    types: [
      "ecc",
      "rds",
      "ecs"
    ]
  },
  DatabaseConnections: {
    units: "count",
    description: "The number of database connections in use.",
    title: "Database Connections",
    types: [
      "rds"
    ]
  },
  DiskQueueDepth: {
    units: "bytes",
    description: "The number of outstanding IOs (read/write requests) waiting to access the disk.",
    title: "Disk Queue Depth",
    types: [
      "rds"
    ]
  },
  FreeStorageSpace: {
    units: "bytes",
    description: "The amount of available storage space.",
    title: "Free Storage Space",
    types: [
      "rds"
    ]
  },
  FreeableMemory: {
    units: "bytes",
    description: "The amount of available random access memory.",
    title: "Free Memory",
    types: [
      "rds"
    ]
  },
  GroupDesiredCapacity: {
    units: "count",
    description: "The number of instances that the Auto Scaling group attempts to maintain.",
    title: "ASG Desired Capacity",
    types: [
      "asg"
    ]
  },
  GroupInServiceInstances: {
    units: "count",
    description: "The number of instances that are running as part of the Auto Scaling group. This metric does not include instances that are pending or terminating.",
    title: "ASG In-Service Instances",
    types: [
      "asg"
    ]
  },
  GroupMinSize: {
    units: "count",
    description: "The minimum size of the Auto Scaling group.",
    title: "ASG Minimum Size",
    types: [
      "asg"
    ]
  },
  GroupMaxSize: {
    units: "count",
    description: "The maximum size of the Auto Scaling group.",
    title: "ASG Maximum Size",
    types: [
      "asg"
    ]
  },
  GroupPendingInstances: {
    units: "count",
    description: "The number of instances that are pending. A pending instance is not yet in service. This metric does not include instances that are in service or terminating.",
    title: "ASG Pending Instances",
    types: [
      "asg"
    ]
  },
  GroupStandbyInstances: {
    units: "count",
    description: "The number of instances that are in a Standby state. Instances in this state are still running but are not actively in service. This metric is not included by default; you must request it specifically.",
    title: "ASG Standby Instances",
    types: [
      "asg"
    ]
  },
  GroupTerminatingInstances: {
    units: "count",
    description: "The number of instances that are in the process of terminating. This metric does not include instances that are in service or pending.",
    title: "ASG Terminating Instances",
    types: [
      "asg"
    ]
  },
  GroupTotalInstances: {
    units: "count",
    description: "The total number of instances in the Auto Scaling group. This metric identifies the number of instances that are in service, pending, and terminating.",
    title: "ASG Total Instances",
    types: [
      "asg"
    ]
  },
  NetworkReceiveThroughput: {
    units: "bytes/second",
    description: "The incoming (Receive) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.",
    title: "Network Receive Throughput",
    types: [
      "rds"
    ]
  },
  NetworkTransmitThroughput: {
    units: "bytes/second",
    description: "The outgoing (Transmit) network traffic on the DB instance, including both customer database traffic and Amazon RDS traffic used for monitoring and replication.",
    title: "Network Transmit Throughput",
    types: [
      "rds"
    ]
  },
  ReadIOPS: {
    units: "count/second",
    description: "The average number of disk I/O operations per second.",
    title: "Read IOPS",
    types: [
      "rds"
    ]
  },
  ReadLatency: {
    units: "seconds",
    description: "The average amount of time taken per disk I/O operation.",
    title: "Read Latency",
    types: [
      "rds"
    ]
  },
  ReadThroughput: {
    units: "bytes/second",
    description: "The average number of bytes read from disk per second.",
    title: "Read Throughput",
    types: [
      "rds"
    ]
  },
  ReplicaLag: {
    units: "seconds",
    description: "The amount of time a Read Replica DB Instance lags behind the source DB Instance. Applies to MySQL read replicas.",
    title: "Replica Lag",
    types: [
      "rds"
    ]
  },
  SwapUsage: {
    units: "bytes",
    description: "The amount of swap space used on the DB Instance.",
    title: "Swap Usage",
    types: [
      "rds"
    ]
  },
  WriteIOPS: {
    units: "count/second",
    description: "The average number of disk I/O operations per second.",
    title: "Write IOPS",
    types: [
      "rds"
    ]
  },
  WriteLatency: {
    units: "seconds",
    description: "The average amount of time taken per disk I/O operation.",
    title: "Write Latency",
    types: [
      "rds"
    ]
  },
  WriteThroughput: {
    units: "bytes/second",
    description: "The average number of bytes written to disk per second.",
    title: "Write Throughput",
    types: [
      "rds"
    ]
  },
  CPUCreditUsage: {
    units: "count",
    description: "The number of CPU credits consumed during the specified period.",
    title: "CPU Credit Usage",
    types: [
      "ecc"
    ]
  },
  CPUCreditBalance: {
    units: "count",
    description: "The number of CPU credits that an instance has accumulated.",
    title: "COU Credit Balance",
    types: [
      "ecc"
    ]
  },
  DiskReadOps: {
    units: "count",
    description: "Completed read operations from all instance store volumes available to the instance in a specified period of time.",
    title: "Disk Read 0ps",
    types: [
      "ecc"
    ]
  },
  DiskWriteOps: {
    units: "count",
    description: "Completed write operations to all instance store volumes available to the instance in a specified period of time.",
    title: "Disk Write 0ps",
    types: [
      "ecc"
    ]
  },
  DiskReadBytes: {
    units: "bytes",
    description: "Bytes read from all instance store volumes available to the instance.",
    title: "Disk Read Bytes",
    types: [
      "ecc"
    ]
  },
  DiskWriteBytes: {
    units: "bytes",
    description: "Bytes written to all instance store volumes available to the instance.",
    title: "Disk Write Bytes",
    types: [
      "ecc"
    ]
  },
  NetworkIn: {
    units: "bytes",
    description: "The number of bytes received on all network interfaces by the instance. This metric identifies the volume of incoming network traffic to an application on a single instance.",
    title: "Network In",
    types: [
      "ecc"
    ]
  },
  NetworkOut: {
    units: "bytes",
    description: "The number of bytes sent out on all network interfaces by the instance. This metric identifies the volume of outgoing network traffic to an application on a single instance.",
    title: "Network Out",
    types: [
      "ecc"
    ]
  },
  NetworkPacketsIn: {
    units: "count",
    description: "The number of packets received on all network interfaces by the instance. This metric identifies the volume of incoming traffic in terms of the number of packets on a single instance.",
    title: "Network Packets In",
    types: [
      "ecc"
    ]
  },
  NetworkPacketsOut: {
    units: "count",
    description: "The number of packets sent out on all network interfaces by the instance. This metric identifies the volume of outgoing traffic in terms of the number of packets on a single instance.",
    title: "Network Packets Out",
    types: [
      "ecc"
    ]
  },
  StatusCheckFailed: {
    units: "count",
    description: "A combination of StatusCheckFailed_Instance and StatusCheckFailed_System that reports if either of the status checks has failed. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    title: "Status Check Failed",
    types: [
      "ecc"
    ]
  },
  StatusCheckFailed_Instance: {
    units: "count",
    description: "Reports whether the instance has passed the Amazon EC2 instance status check in the last minute. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    title: "Status Check Failed Instance",
    types: [
      "ecc"
    ]
  },
  StatusCheckFailed_System: {
    units: "count",
    description: "Reports whether the instance has passed the EC2 system status check in the last minute. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    title: "Status Check Failed System",
    types: [
      "ecc"
    ]
  },
  CPUReservation: {
    units: 'percent',
    description: 'The percentage of CPU units that are reserved by running tasks in the cluster. Cluster CPU reservation (this metric can only be filtered by ClusterName) is measured as the total CPU units that are reserved by Amazon ECS tasks on the cluster, divided by the total CPU units that were registered for all of the container instances in the cluster.',
    title: 'CPU Reservation',
    types: [
      'ecs'
    ]
  },
  MemoryReservation: {
    units: 'percent',
    description: 'The percentage of memory that is reserved by running tasks in the cluster. Cluster memory reservation (this metric can only be filtered by ClusterName) is measured as the total memory that is reserved by Amazon ECS tasks on the cluster, divided by the total amount of memory that was registered for all of the container instances in the cluster.',
    title: 'Memory Reservation',
    types: [
      'ecs'
    ]
  },
  MemoryUtilization: {
    units: 'percent',
    description: 'The percentage of memory that is used in the cluster or service. Cluster memory utilization (metrics that are filtered by ClusterName without ServiceName) is measured as the total memory in use by Amazon ECS tasks on the cluster, divided by the total amount of memory that was registered for all of the container instances in the cluster. Service memory utilization (metrics that are filtered by ClusterName and ServiceName) is measured as the total memory in use by the tasks that belong to the service, divided by the total memory that is reserved for the tasks that belong to the service.',
    title: 'Memory Utilization',
    types: [
      'ecs'
    ]
  }
};