import { useCallback, useEffect, useState } from 'react'
import {
  formatStorageBytes,
  LOCAL_PLANNING_BYTES,
  measureLocalStorage,
  measureOriginStorage,
} from '../lib/storageUsage'

export default function StorageUsage() {
  const [refresh, setRefresh] = useState(0)
  const [local, setLocal] = useState(null)
  const [origin, setOrigin] = useState({ status: 'loading' })
  const reload = useCallback(() => setRefresh((value) => value + 1), [])
  useEffect(() => {
    let cancelled = false
    setLocal(measureLocalStorage())
    setOrigin({ status: 'loading' })
    measureOriginStorage().then((result) => {
      if (!cancelled) setOrigin(result)
    })
    return () => {
      cancelled = true
    }
  }, [refresh])
  useEffect(() => {
    window.addEventListener('storage', reload)
    window.addEventListener('focus', reload)
    return () => {
      window.removeEventListener('storage', reload)
      window.removeEventListener('focus', reload)
    }
  }, [reload])

  return (
    <section
      aria-labelledby="storage-usage-heading"
      className="mb-8 border border-gray-200 bg-white p-4 dark:border-border dark:bg-surface-card"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <h2 id="storage-usage-heading" className="text-sm font-bold">
          Storage usage
        </h2>
        <button type="button" onClick={reload} className="btn-secondary">
          Refresh storage usage
        </button>
      </div>
      <div aria-live="polite" className="space-y-3 text-sm">
        {!local ? (
          <p>Measuring localStorage…</p>
        ) : local.status !== 'available' ? (
          <p>
            localStorage is unavailable. Its usage could not be measured; it is not assumed empty.
          </p>
        ) : (
          <>
            <p>
              <strong>{formatStorageBytes(local.totalBytes)}</strong> approximate localStorage
              footprint across {local.entryCount} entries.
            </p>
            <p className="text-xs">
              Source: twice the UTF-16 length of stored names and values. Browser overhead and
              compression may differ. This is a changing snapshot, not a byte-exact quota
              measurement.
            </p>
            <p className="text-xs">
              Planning reference: {formatStorageBytes(LOCAL_PLANNING_BYTES)}. This app warning guide
              is not your browser’s localStorage limit, which is unknown.
            </p>
            {local.totalBytes >= LOCAL_PLANNING_BYTES * 0.8 && (
              <p role="alert">
                Large localStorage footprint: at least 80% of the planning reference. Export
                important data and consider pruning the largest groups before another save fails.
              </p>
            )}
            {local.groups.length > 0 ? (
              <table className="w-full text-left text-xs">
                <caption className="mb-2 text-left">Largest localStorage consumers</caption>
                <thead>
                  <tr>
                    <th scope="col">Feature</th>
                    <th scope="col">Approximate size</th>
                    <th scope="col">Entries</th>
                  </tr>
                </thead>
                <tbody>
                  {local.groups.map((group) => (
                    <tr key={group.label}>
                      <th scope="row">{group.label}</th>
                      <td>{formatStorageBytes(group.bytes)}</td>
                      <td>{group.entries}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No localStorage entries were found.</p>
            )}
          </>
        )}
        <div>
          <h3 className="font-semibold">Whole-origin browser estimate</h3>
          {origin.status === 'loading' ? (
            <p>Requesting browser estimate…</p>
          ) : origin.status === 'available' ? (
            <>
              <p>
                {formatStorageBytes(origin.usage)} used of {formatStorageBytes(origin.quota)}{' '}
                estimated quota ({(origin.fraction * 100).toFixed(1)}%).
              </p>
              <p className="text-xs">
                Source: navigator.storage.estimate(). Its scope may include IndexedDB and caches; it
                does not reveal localStorage’s remaining capacity or guarantee that a write will
                succeed.
              </p>
              {origin.fraction >= 0.8 && (
                <p role="alert">
                  The browser reports this origin near its estimated quota. Review large data stores
                  and cached content before saving more.
                </p>
              )}
            </>
          ) : (
            <p>
              {origin.status === 'unsupported'
                ? 'This browser does not expose an origin storage estimate.'
                : 'The browser estimate is unavailable.'}{' '}
              localStorage’s actual quota remains unknown.
            </p>
          )}
        </div>
        <p className="text-xs">
          Read-only report: no values or raw entry names are displayed, logged or sent. Export or
          prune data in the corresponding feature, then refresh this report. No data is deleted
          here.
        </p>
      </div>
    </section>
  )
}
