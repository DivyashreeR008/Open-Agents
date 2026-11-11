const CREDENTIAL_MANAGER_HINTS = {
  autoComplete: 'new-password',
  autoCapitalize: 'none',
  autoCorrect: 'off',
  spellCheck: false,
  'data-1p-ignore': 'true',
  'data-lpignore': 'true',
  'data-bwignore': 'true',
  'data-form-type': 'other',
}

/**
 * Attributes for API key inputs.
 *
 * An API key is a secret, but it is not the credential half of a login form.
 * Declaring the field as a new password stops browsers from offering saved
 * account credentials, and the vendor-specific data attributes tell popular
 * password managers to leave the field alone. A distinct name keeps extensions
 * from grouping multiple provider keys into one guessed login form.
 */
export function apiKeyFieldProps(name) {
  return { name, ...CREDENTIAL_MANAGER_HINTS }
}
