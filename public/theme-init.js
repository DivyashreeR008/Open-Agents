;(function () {
  var stored = null

  try {
    stored = window.localStorage.getItem('oa_theme')
  } catch (error) {
    // Blocked storage is treated as no saved preference.
    stored = null
  }

  var prefersDark = false

  try {
    prefersDark = Boolean(
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    )
  } catch (error) {
    prefersDark = false
  }

  var dark = stored === 'dark' || (stored !== 'light' && prefersDark)
  document.documentElement.classList.toggle('dark', dark)
})()
