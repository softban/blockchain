import hashlib, datetime


class block:
    def __init__(self, index, data, last_block):
        self.index=index;self.data=data
        self.timestamp=datetime.datetime.now()
        self.last_block=last_block
        self.hash=self.hash()

    def hash(self):
        h=hashlib.sha256()
        block_hash=str(self.index)+str(self.timestamp)+str(self.data)+str(self.last_block)
        h.update(block_hash.encode('utf-8'))
        return h.hexdigest()

class blockchain:
    def __init__(self, transaction_limit):
        self.core=[block(0,'blockchain-genesis-block', '0')]
        self.previous_block=self.core[0]

    def request(self, data):
        last_block=self.core[len(self.core)-1]
        request_block=block(last_block.index+1, data, last_block.hash)
        return self.requirements(request_block)

    def requirements(self, incoming_block):
        #----- Request Requirements -----#
        if len(incoming_block.data) >= 25: return False
        #--------------------------------#
        self.core.append(incoming_block)
        self.previous_block=incoming_block
        return True, incoming_block

    def verify(self, index, block_hash):
        if self.core[index].hash == block_hash: return True
        return False


### Testing ###
#
blockchain=blockchain(3)
#
blockchain.request('hello')
blockchain.request('hello')
blockchain.request('hello')
blockchain.request('hello')
#
print( blockchain.request('0000000000000000000000000') )
#
print( blockchain.verify(0, blockchain.core[0].hash ) )
#
