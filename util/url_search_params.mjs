export const getSearchParams = () => {
  return Object.fromEntries(
    new URLSearchParams(window.location.search).entries(),
  )
}
