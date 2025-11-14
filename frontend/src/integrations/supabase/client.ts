import { apiBaseUrl } from '@/integrations/api/client';

type Result<T> = { data: T | null; error: { message: string } | null };

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === 'object' && !Array.isArray(value)
}

function mapDoc<T = Record<string, unknown>>(doc: unknown): T {
  if (!isPlainObject(doc)) return doc as T
  if ((doc as Record<string, unknown>)._id && !(doc as Record<string, unknown>).id) {
    const { _id, ...rest } = doc as Record<string, unknown>
    return ({ id: String(_id), ...rest } as unknown) as T
  }
  return doc as T
}

function mapDocs<T = unknown>(json: unknown): T | T[] {
  if (Array.isArray(json)) return (json as unknown[]).map((d) => mapDoc<T>(d))
  return mapDoc<T>(json)
}

function mapDocsArray<T = unknown>(json: unknown): T[] {
  const v = mapDocs<T>(json)
  return Array.isArray(v) ? v : (v ? [v] : [])
}

class BaseQuery {
  collection: string
  q: Record<string, unknown> = {}
  sortField?: string
  sortOrder: 'asc' | 'desc' = 'desc'
  single = false
  constructor(collection: string) { this.collection = collection }
}

class SelectBuilder<T = unknown> implements PromiseLike<Result<T[] | T>> {
  base: BaseQuery
  fields: string
  constructor(base: BaseQuery, fields: string) { this.base = base; this.fields = fields }
  eq(field: string, value: unknown) { this.base.q[field] = value; return this }
  order(field: string, opts?: { ascending?: boolean }) { this.base.sortField = field; this.base.sortOrder = opts?.ascending ? 'asc' : 'desc'; return this }
  maybeSingle() { this.base.single = true; return this }
  private async _execute(): Promise<Result<T[] | T>> {
    try {
      const params = new URLSearchParams()
      if (Object.keys(this.base.q).length) params.set('filter', JSON.stringify(this.base.q))
      if (this.base.sortField) { params.set('sort', this.base.sortField); params.set('order', this.base.sortOrder) }
      const res = await fetch(`${apiBaseUrl}/api/${this.base.collection}?${params.toString()}`)
      if (!res.ok) throw new Error(await res.text())
      const json = (await res.json()) as unknown
      const mapped = mapDocs<T>(json)
      return { data: this.base.single ? (Array.isArray(mapped) ? (mapped[0] ?? null) : mapped) : mapped, error: null }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return { data: null, error: { message: msg } }
    }
  }
  then<TResult1 = Result<T[] | T>, TResult2 = never>(onFulfilled: (value: Result<T[] | T>) => TResult1 | PromiseLike<TResult1>, onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>) {
    return this._execute().then(onFulfilled, onRejected)
  }
}

class UpdateBuilder implements PromiseLike<Result<unknown>> {
  base: BaseQuery
  partial: Record<string, unknown>
  constructor(base: BaseQuery, partial: Record<string, unknown>) { this.base = base; this.partial = partial }
  eq(field: string, value: unknown) { this.base.q[field] = value; return this }
  private async _execute(): Promise<Result<unknown>> {
    try {
      const id = (this.partial.id ?? this.base.q.id) as string | undefined
      if (!id) throw new Error('missing_id')
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${apiBaseUrl}/api/${this.base.collection}/${id}`, {
        method: 'PUT', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(this.partial)
      })
      if (!res.ok) throw new Error(await res.text())
      const json = (await res.json()) as unknown
      return { data: mapDocs<unknown>(json), error: null }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return { data: null, error: { message: msg } }
    }
  }
  then<TResult1 = Result<unknown>, TResult2 = never>(onFulfilled: (value: Result<unknown>) => TResult1 | PromiseLike<TResult1>, onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>) {
    return this._execute().then(onFulfilled, onRejected)
  }
}

class DeleteBuilder implements PromiseLike<Result<unknown>> {
  base: BaseQuery
  constructor(base: BaseQuery) { this.base = base }
  eq(field: string, value: unknown) { this.base.q[field] = value; return this }
  private async _execute(): Promise<Result<unknown>> {
    try {
      const id = this.base.q.id as string | undefined
      if (!id) throw new Error('missing_id')
      const token = localStorage.getItem('auth_token')
      const res = await fetch(`${apiBaseUrl}/api/${this.base.collection}/${id}`, { method: 'DELETE', headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) } })
      if (!res.ok) throw new Error(await res.text())
      return { data: { ok: true }, error: null }
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : String(e)
      return { data: null, error: { message: msg } }
    }
  }
  then<TResult1 = Result<unknown>, TResult2 = never>(onFulfilled: (value: Result<unknown>) => TResult1 | PromiseLike<TResult1>, onRejected?: (reason: unknown) => TResult2 | PromiseLike<TResult2>) {
    return this._execute().then(onFulfilled, onRejected)
  }
}

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const res = String(reader.result || '')
      const base64 = res.split(',')[1] || res
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

export const supabase = {
  from(collection: string) {
    const base = new BaseQuery(collection)
    return {
      select<T = unknown>(fields: string) { return new SelectBuilder<T>(base, fields) },
      eq(field: string, value: unknown) { base.q[field] = value; return this },
      insert: async (rows: Record<string, unknown>[]): Promise<Result<unknown>> => {
        try {
          const token = localStorage.getItem('auth_token')
          const res = await fetch(`${apiBaseUrl}/api/${collection}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify(rows)
          })
          if (!res.ok) throw new Error(await res.text())
          const json = (await res.json()) as unknown
          return { data: mapDocs<unknown>(json), error: null }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          return { data: null, error: { message: msg } }
        }
      },
      update(partial: Record<string, unknown>) { return new UpdateBuilder(base, partial) },
      upsert: async (row: Record<string, unknown>, opts?: { onConflict?: string }): Promise<Result<unknown>> => {
        try {
          const conflictField = opts?.onConflict
          if (conflictField) {
            const params = new URLSearchParams()
            const keyVal = (row as Record<string, unknown>)[conflictField]
            params.set('filter', JSON.stringify({ [conflictField]: keyVal }))
            const rs = await fetch(`${apiBaseUrl}/api/${collection}?${params.toString()}`)
            if (!rs.ok) throw new Error(await rs.text())
            const list = mapDocsArray<Record<string, unknown>>(await rs.json())
            const existing = list[0]
            const existingId = existing && (existing.id as unknown)
            if (existingId) {
              const upd = new UpdateBuilder(base, { ...row, id: String(existingId) })
              return await new Promise((resolve) => upd.then(resolve))
            }
          }
          const token = localStorage.getItem('auth_token')
          const res = await fetch(`${apiBaseUrl}/api/${collection}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) }, body: JSON.stringify([row])
          })
          if (!res.ok) throw new Error(await res.text())
          const json = (await res.json()) as unknown
          return { data: mapDocs<unknown>(json), error: null }
        } catch (e: unknown) {
          const msg = e instanceof Error ? e.message : String(e)
          return { data: null, error: { message: msg } }
        }
      },
      delete() { return new DeleteBuilder(base) }
    }
  },
  auth: {
    async getSession() { return { data: { session: null }, error: null } },
    async signOut() { return { error: null } },
  },
  storage: {
    from(bucket: string) {
      return {
        async upload(filePath: string, file: File): Promise<Result<{ path: string }>> {
          try {
            const base64 = await fileToBase64(file)
            const res = await fetch(`${apiBaseUrl}/storage/upload`, {
              method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ bucket, filePath, base64 })
            })
            if (!res.ok) throw new Error(await res.text())
            const json = (await res.json()) as { path: string }
            return { data: { path: json.path }, error: null }
          } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : String(e)
            return { data: null, error: { message: msg } }
          }
        },
        getPublicUrl(filePath: string) {
          const publicUrl = `${apiBaseUrl}/uploads/${bucket}/${filePath}`
          return { data: { publicUrl } }
        }
      }
    }
  }
}
