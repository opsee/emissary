const base = 'https://s3.amazonaws.com/opsee-bastion-cf-us-east-1/beta';
export default {
  cf: `${base}/bastion-cf.template`,
  ingress: `${base}/bastion-ingress-cf.template`,
  role: `${base}/opsee-role-stack.json`
};