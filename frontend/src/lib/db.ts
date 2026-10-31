import Dexie, { type Table } from 'dexie'

export interface PendingOperation {
  id?: number
  type: 'CREATE_TASK' | 'UPDATE_TASK' | 'MOVE_TASK' | 'DELETE_TASK' | 'ADD_COMMENT'
  payload: unknown
  createdAt: number
  retryCount: number
}

export interface CachedBoard {
  projectId: number
  data: unknown
  cachedAt: number
}

class LiveBoardDB extends Dexie {
  pendingOps!: Table<PendingOperation>
  cachedBoards!: Table<CachedBoard>

  constructor() {
    super('liveboard')
    this.version(1).stores({
      pendingOps: '++id, type, createdAt',
      cachedBoards: 'projectId, cachedAt',
    })
  }
}

export const db = new LiveBoardDB()

export const offlineQueue = {
  async enqueue(op: Omit<PendingOperation, 'id' | 'createdAt' | 'retryCount'>) {
    return db.pendingOps.add({ ...op, createdAt: Date.now(), retryCount: 0 })
  },
  async dequeue(id: number) {
    return db.pendingOps.delete(id)
  },
  async getAll() {
    return db.pendingOps.orderBy('createdAt').toArray()
  },
  async count() {
    return db.pendingOps.count()
  },
  async incrementRetry(id: number) {
    const op = await db.pendingOps.get(id)
    if (op) await db.pendingOps.update(id, { retryCount: op.retryCount + 1 })
  },
}
