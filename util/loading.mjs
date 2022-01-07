const LOADING_ID = 'loading'
const LOADING_ELSE = 'hide_when_loading'

export const globalLoading = {
  show: () => {
    document.querySelector(`#${LOADING_ID}`).classList.remove('hide')
    document.querySelector(`#${LOADING_ELSE}`).classList.add('hide')
  },
  hide: () => {
    document.querySelector(`#${LOADING_ID}`).classList.add('hide')
    document.querySelector(`#${LOADING_ELSE}`).classList.remove('hide')
  },
}
