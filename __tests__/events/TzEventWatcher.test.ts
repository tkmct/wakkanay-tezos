jest.unmock('../../src/')
import EventWatcher from '../../src/events/TzEventWatcher'
import { db, types } from 'wakkanay'
import { Address } from 'wakkanay/dist/types'
import { KeyValueStore } from 'wakkanay/dist/db'
import { MockBlockInfoProvider } from './MockBlockInfoProvider'
import EventLog from 'wakkanay/dist/events/types/EventLog'

describe('TzEventWatcher', () => {
  let kvs: KeyValueStore
  beforeEach(async () => {
    kvs = new db.InMemoryKeyValueStore(types.Bytes.default())
  })

  describe('poll', () => {
    const conseilServerInfo = {
      url: 'https://tezos-dev.cryptonomic-infra.tech',
      apiKey: 'hooman',
      network: 'babylonnet'
    }

    it('succeed to poll events', async () => {
      const eventWatcher = new EventWatcher({
        conseilServerInfo: conseilServerInfo,
        kvs,
        contractAddress: 'KT1HSBDy3MgRPh2G4oqBQMUsyxy5EYPGKzpv',
        options: { interval: 1000 },
        blockInfoProvider: new MockBlockInfoProvider(conseilServerInfo, false)
      })
      const handler = jest.fn()
      eventWatcher.subscribe('BlockSubmitted', handler)
      await eventWatcher.poll(196527, 196530, () => {})
      expect(handler).toHaveBeenCalledWith({
        name: 'BlockSubmitted',
        values: [{ int: '0' }, { string: 'root' }]
      })
      expect(handler).toHaveBeenCalledTimes(1)
      await eventWatcher.poll(196527, 196530, () => {})
      // confirm not to emit same event
      expect(handler).toHaveBeenCalledTimes(1)
    })

    it('fail to poll events', async () => {
      const eventWatcher = new EventWatcher({
        conseilServerInfo: conseilServerInfo,
        kvs,
        contractAddress: 'KT1HSBDy3MgRPh2G4oqBQMUsyxy5EYPGKzpv',
        options: { interval: 1000 },
        blockInfoProvider: new MockBlockInfoProvider(conseilServerInfo, true)
      })
      const handler = jest.fn()
      eventWatcher.subscribe('BlockSubmitted', handler)
      await eventWatcher.poll(196527, 196530, () => {})
      expect(handler).toHaveBeenCalledTimes(0)
    })
  })
})
