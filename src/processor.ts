import { assertNotNull } from '@subsquid/util-internal'
import { EvmBatchProcessor} from '@subsquid/evm-processor'
import { lookupArchive } from '@subsquid/archive-registry'
import { OwnershipTransferred, Trade } from './model'
import * as FriendtechSharesV1 from './abi/FriendtechSharesV1'

export const CONTRACT_ADDRESS = '0xCF205808Ed36593aa40a44F10c7f7C2F67d4A4d4'.toLowerCase()

export const processor = new EvmBatchProcessor()
  .setDataSource({
    archive: lookupArchive('eth-mainnet'),
    chain: {
      url: 'https://rpc.ankr.com/eth',
      rateLimit: 10
    }
  })
  .setBlockRange({ from: 2430439 })
  .setFinalityConfirmation(75)
  .setFields({
    transaction: {
      hash: true,
    },
    log: {
      data: true,
      topics: true,
    },
  })
  .addLog({
    address: [ CONTRACT_ADDRESS ],
    topic0: [
      FriendtechSharesV1.events.OwnershipTransferred.topic,
      FriendtechSharesV1.events.Trade.topic,
    ],
  })