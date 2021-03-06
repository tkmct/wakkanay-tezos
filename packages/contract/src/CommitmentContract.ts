import { Bytes, BigNumber } from '@cryptoeconomicslab/primitives'
import { ICommitmentContract } from '@cryptoeconomicslab/contract'
import { ContractManager } from '@cryptoeconomicslab/tezos-wallet'

export class CommitmentContract implements ICommitmentContract {
  constructor(readonly connection: ContractManager) {}

  /**
   * submit block
   */
  async submit(blockNumber: BigNumber, root: Bytes) {
    const amount = 0
    const entrypoint = 'submit'
    const params = `(Pair (Pair ${blockNumber} "${blockNumber.toString()}") "${root.toHexString()}")`

    await this.connection.invokeContract(amount, entrypoint, params)
  }

  // TODO: add implementation
  async getCurrentBlock(): Promise<BigNumber> {
    throw new Error('Not implemented')
  }

  async getRoot(blockNumber: BigNumber): Promise<Bytes> {
    throw new Error('Not implemented')
  }

  // TODO: add implementation
  subscribeBlockSubmitted(
    handler: (blockNumber: BigNumber, root: Bytes) => void
  ) {
    throw new Error('Not implemented')
  }
}
