/*eslint-disable quotes*/
export default {
  "CPUCreditUsage": {
    "units": "count",
    "description": "The number of CPU credits consumed during the specified period.",
    "title": "CPU Credit Usage"
  },
  "CPUCreditBalance": {
    "units": "count",
    "description": "The number of CPU credits that an instance has accumulated.",
    "title": "COU Credit Balance"
  },
  "CPUUtilization": {
    "units": "percent",
    "description": "The percentage of CPU utilization.",
    "title": "CPU Utilization"
  },
  "DiskReadOps": {
    "units": "count",
    "description": "Completed read operations from all instance store volumes available to the instance in a specified period of time.",
    "title": "Disk Read 0ps"
  },
  "DiskWriteOps": {
    "units": "count",
    "description": "Completed write operations to all instance store volumes available to the instance in a specified period of time.",
    "title": "Disk Write 0ps"
  },
  "DiskReadBytes": {
    "units": "bytes",
    "description": "Bytes read from all instance store volumes available to the instance.",
    "title": "Disk Read Bytes"
  },
  "DiskWriteBytes": {
    "units": "bytes",
    "description": "Bytes written to all instance store volumes available to the instance.",
    "title": "Disk Write Bytes"
  },
  "NetworkIn": {
    "units": "bytes",
    "description": "The number of bytes received on all network interfaces by the instance. This metric identifies the volume of incoming network traffic to an application on a single instance.",
    "title": "Network In"
  },
  "NetworkOut": {
    "units": "bytes",
    "description": "The number of bytes sent out on all network interfaces by the instance. This metric identifies the volume of outgoing network traffic to an application on a single instance.",
    "title": "Network Out"
  },
  "NetworkPacketsIn": {
    "units": "count",
    "description": "The number of packets received on all network interfaces by the instance. This metric identifies the volume of incoming traffic in terms of the number of packets on a single instance.",
    "title": "Network Packets In"
  },
  "NetworkPacketsOut": {
    "units": "count",
    "description": "The number of packets sent out on all network interfaces by the instance. This metric identifies the volume of outgoing traffic in terms of the number of packets on a single instance.",
    "title": "Network Packets Out"
  },
  "StatusCheckFailed": {
    "units": "count",
    "description": "A combination of StatusCheckFailed_Instance and StatusCheckFailed_System that reports if either of the status checks has failed. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    "title": "Status Check Failed"
  },
  "StatusCheckFailed_Instance": {
    "units": "count",
    "description": "Reports whether the instance has passed the Amazon EC2 instance status check in the last minute. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    "title": "Status Check Failed Instance"
  },
  "StatusCheckFailed_System": {
    "units": "count",
    "description": "Reports whether the instance has passed the EC2 system status check in the last minute. Values for this metric are either 0 (zero) or 1 (one.) A zero indicates that the status check passed. A one indicates a status check failure.",
    "title": "Status Check Failed System"
  }
};