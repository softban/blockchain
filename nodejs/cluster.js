var crypto = require('crypto');

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
    this.core=[new node(0,'nodejs-genesis-block','0')];
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

for (i=1; i < 4; i++) {
  cluster.create_node('block_data_'+String(i))
}
console.log(cluster.core);
