import {TypeormDatabase} from '@subsquid/typeorm-store';
import {processor,CONTRACT_ADDRESS} from './processor';
import { OwnershipTransferred, Trade} from './model';
import * as FriendtechSharesV1ABI from './abi/FriendtechSharesV1';
import { ID } from '@subsquid/graphql-server';






processor.run(new TypeormDatabase({supportHotBlocks: true}), async (ctx) => {

    let OwnershipTransferred: Map<string,OwnershipTransferred > = new Map();

    for (let c of ctx.blocks) {
        for (let log of c.logs) {
            if (log.address !== CONTRACT_ADDRESS || log.topics[0] !== FriendtechSharesV1ABI.events.OwnershipTransferred.topic, FriendtechSharesV1ABI.events.Trade.topic) continue
            const { previousOwner, newOwner } = FriendtechSharesV1ABI.events.OwnershipTransferred.decode(log)
            const { trader, subject, isBuy, shareAmount, ethAmount, protocolEthAmount, subjectEthAmount, supply } = FriendtechSharesV1ABI.events.Trade.decode(log)
            
    

ctx.store.upsert([...OwnershipTransferred.values()]);

}
}
})