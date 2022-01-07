const ENDPOINT_URL = 'http://35.86.17.44:2048/api/v1/'

export function fetchJSON(...args) {
  const url = `${ENDPOINT_URL}${args[0]}`
  return fetch(url, ...args.slice(1)).then((resp) => resp.json())
}
