import {TypeormDatabase} from '@subsquid/typeorm-store';
import {processor,CONTRACT_ADDRESS} from './processor';
import { OwnershipTransferred, Trade} from './model';
import * as FriendtechSharesV1ABI from './abi/FriendtechSharesV1';
import { ID } from '@subsquid/graphql-server';






processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {

   const trades: Trade[] = [];
    const ownershipTransfers: OwnershipTransferred[] = [];
    for (let block of ctx.blocks) {
        for (let log of block.logs) {
          if (log.topics[0] === FriendtechSharesV1ABI.events.Trade.topic) {
            let event = FriendtechSharesV1ABI.events.Trade.decode(log);
            let trade = new Trade({
              id: log.transaction?.hash,
              trader: event.trader,
              subject: event.subject,
              isBuy: event.isBuy,
              shareAmount: event.shareAmount,
              ethAmount: event.ethAmount,
              protocolEthAmount: event.protocolEthAmount,
              subjectEthAmount: event.subjectEthAmount,
              supply: event.supply,
              blockNumber: BigInt(block.header.height),
              blockTimestamp: BigInt(block.header.timestamp),
              transactionHash: log.transaction?.hash,
            });
            trades.push(trade);
    
        }
        if (log.topics[0] === FriendtechSharesV1ABI.events.OwnershipTransferred.topic) {
            let event = FriendtechSharesV1ABI.events.OwnershipTransferred.decode(log);
            let ownershipTransferred = new OwnershipTransferred({
              id: log.transaction?.hash,
              previousOwner: event.previousOwner,
              newOwner: event.newOwner,
              transactionHash: log.transaction?.hash,
              blockNumber: BigInt(block.header.height),
              blockTimestamp: BigInt(block.header.timestamp),
            });
            ownershipTransfers.push(ownershipTransferred);
            
    }
}
}
await ctx.store.upsert([...trades.values()]);
await ctx.store.upsert([...ownershipTransfers.values()]);
})
