export async function jsonFetch<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    credentials: "include",
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = body?.error || `Request failed: ${res.status}`
    // If auth expired or forbidden, force client-side logout and redirect to landing page
    if ((res.status === 401 || res.status === 403) && typeof window !== 'undefined') {
      try {
        // call logout to clear cookies server-side
        await fetch('/api/auth/logout', { method: 'POST' })
      } catch (e) {
        // ignore
      }
      // redirect to landing page
      window.location.replace('/')
      // keep promise pending, but also throw to stop further execution
      throw new Error('Unauthorized')
    }
    const err: any = new Error(message)
    err.status = res.status
    throw err
  }
  return res.json()
}
