export const getSearchParams = () => {
  return Object.fromEntries(
    new URLSearchParams(window.location.search).entries(),
  )
}

export const addSearchParam = (key, value) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.set(key, value)
  const newRelativePathQuery = location.pathname + '?' + searchParams.toString()
  history.replaceState(null, '', newRelativePathQuery)
}

export const removeSearchParam = (key) => {
  const searchParams = new URLSearchParams(window.location.search)
  searchParams.delete(key)
  const newRelativePathQuery = location.pathname + '?' + searchParams.toString()
  history.replaceState(null, '', newRelativePathQuery)
}
