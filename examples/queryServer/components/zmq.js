const { extract } = require('@iota/area-codes')
const { storeTransaction } = require('./db')

// signature_message_fragment=Fragment(tryte_string[0:2187]),
// address=Address(tryte_string[2187:2268]),
// value=int_from_trits(tryte_string[2268:2295].as_trits()),
// legacy_tag=Tag(tryte_string[2295:2322]),
// timestamp=int_from_trits(tryte_string[2322:2331].as_trits()),
// current_index=int_from_trits(tryte_string[2331:2340].as_trits()),
// last_index=int_from_trits(tryte_string[2340:2349].as_trits()),
// bundle_hash=BundleHash(tryte_string[2349:2430]),
// trunk_transaction_hash=TransactionHash(tryte_string[2430:2511]),
// branch_transaction_hash=TransactionHash(tryte_string[2511:2592]),
// tag=Tag(tryte_string[2592:2619]),
//
// attachment_timestamp=int_from_trits(
//     tryte_string[2619:2628].as_trits()),
//
// attachment_timestamp_lower_bound=int_from_trits(
//     tryte_string[2628:2637].as_trits()),
//
// attachment_timestamp_upper_bound=int_from_trits(
//     tryte_string[2637:2646].as_trits()),
//
// nonce=Nonce(tryte_string[2646:2673]),

const subscribeToZMQ = async () => {
  let zmq = require('zeromq')
  let sock = zmq.socket('sub')

  // Connect to the devnet node's ZMQ port
  console.log('Connecting to ZMQ')
  sock.connect(process.env.ZMQ_URL)

  sock.subscribe('tx_trytes')

  sock.on('message', async msg => {
    const data = msg.toString().split(' ') // Split to get topic & data
    const tx_id = data[2] // TX Hash
    const tag = data[1].slice(2592, 2619) // Extract tag
    const message = data[1].slice(0, 2187)
    const iac = extract(tag) // Check that the tag is correct

    // await storeTransaction([{ tx_id, iac: 'NPHTQORL9XKP' }])

    // Qualify TAG
    if (iac) {
      console.log('IAC:', iac)
      console.log('Tx Hash:', tx_id)
      console.log('Message:', message)
      await storeTransaction([{ tx_id, iac, message }])
    }
  })
}

module.exports = { subscribeToZMQ }
