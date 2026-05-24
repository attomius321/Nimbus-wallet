import { getStorage, type LocalStorage } from '@/shared/storage'
import { useEffect, useState } from 'react'

export function useStorage<K extends keyof LocalStorage>(keys: K[]) {
  const [data, setData] = useState<Pick<LocalStorage, K> | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getStorage(keys)
      .then(setData)
      .finally(() => setLoading(false))
  }, [])

  function refetch() {
    getStorage(keys).then(setData)
  }

  return { data, loading, refetch }
}
