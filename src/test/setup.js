import '@testing-library/jest-dom'

// In-memory Storage polyfill for Storage.prototype to ensure consistent cross-version behavior (Node 22+)
const STORE = Symbol('store')
function getStore(target) {
  if (!target[STORE]) target[STORE] = new Map()
  return target[STORE]
}

const StorageConstructor =
  typeof Storage !== 'undefined'
    ? Storage
    : typeof window !== 'undefined' && window.Storage
      ? window.Storage
      : null
if (StorageConstructor && StorageConstructor.prototype) {
  StorageConstructor.prototype.getItem = function (key) {
    const s = getStore(this)
    return s.has(String(key)) ? s.get(String(key)) : null
  }
  StorageConstructor.prototype.setItem = function (key, value) {
    getStore(this).set(String(key), String(value))
  }
  StorageConstructor.prototype.removeItem = function (key) {
    getStore(this).delete(String(key))
  }
  StorageConstructor.prototype.clear = function () {
    getStore(this).clear()
  }
  Object.defineProperty(StorageConstructor.prototype, 'length', {
    get() {
      return getStore(this).size
    },
    configurable: true,
  })
  StorageConstructor.prototype.key = function (index) {
    return Array.from(getStore(this).keys())[index] || null
  }

  const ls = Object.create(StorageConstructor.prototype)
  const ss = Object.create(StorageConstructor.prototype)

  Object.defineProperty(globalThis, 'localStorage', {
    value: ls,
    configurable: true,
    writable: true,
  })
  Object.defineProperty(globalThis, 'sessionStorage', {
    value: ss,
    configurable: true,
    writable: true,
  })

  if (typeof window !== 'undefined') {
    window.localStorage = ls
    window.sessionStorage = ss
  }
}

// Standard jsdom polyfills for browser APIs used across the app
if (typeof window !== 'undefined') {
  if (!window.matchMedia) {
    window.matchMedia = (query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })
  }

  if (!window.scrollTo) {
    window.scrollTo = () => {}
  }
}
