import { boot } from 'quasar/wrappers'

declare global {
  interface Window {
    __TAURI_INTERNALS__?: any;
  }
}

export default boot(({ app }) => {
  if (process.env.CLIENT) {
    if (window.__TAURI_INTERNALS__) {
      console.log('in TAURI')
      document.body.classList.add('tauri')
    }
  }
})
