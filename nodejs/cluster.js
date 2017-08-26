const crypto = require('crypto');
const program = require('commander')
const chalk = require('chalk');

class node {
  constructor(index, data, last_node) {
    this.index=index;this.data=data;
    this.timestamp=Date.now();
    this.hash=this.build_hash();
    this.last_node=last_node;
  }
  build_hash() {
    var components = (String(this.index)     +
                      String(this.data)      +
                      String(this.timestamp) +
                      String(this.last_node));
    return crypto.createHash('sha256').update(components).digest('base64');
  }
}

class nodeCluster {
  constructor() {
    this.core=[new node(0,'nodejs.cluster-genesis-block','0')];
    this.previous_block=this.core[0];
  }
  create_node(data) {
    var last_block=this.core[this.core.length -1];
    this.node_requirements((new node(last_block.index+1, data, last_block)));
  }
  node_requirements(incoming_node) {
    if (incoming_node.data.length > 200) {return false}
    this.core.push(incoming_node);
    return incoming_node;
  }
  verify(index, block_hash) {
    if (this.core[index].hash == block_hash) {return true}
  }
}


var cluster = new nodeCluster();
// console arguments
program
  .version('0.0.1')
  .option('-s, --size [len]', 'set size of blockchain')
  .option('-d, --display', 'display blockchain')
  .option('-n, --node [index]', 'display node')
  .parse(process.argv);

if (program.size) {
  for (i=0; i < program.size; i++) {
    cluster.create_node('node #'+String(i))
  }}
if (program.display) {
  for (i=0; i < cluster.core.length; i++) {
    console.log(
      '[%s] %s !%s',
      chalk.cyanBright(cluster.core[i].index),chalk.whiteBright(cluster.core[i].hash),chalk.white(cluster.core[i].data))
  }}
if (program.node) {console.log(chalk.cyanBright('--'));console.log(cluster.core[program.node]);console.log(chalk.cyanBright('--'))}
//
