import App from './App'
// import reportWebVitals from './reportWebVitals'
import { Provider } from 'react-redux'
import { store } from './store'
import { createRoot } from 'react-dom/client'
// import { autoFixContext } from 'react-activation'

import '@/static/index.scss'
// eslint-disable-next-line @typescript-eslint/no-require-imports
// autoFixContext([require('react/jsx-runtime'), 'jsx', 'jsxs', 'jsxDEV'])
// eslint-disable-next-line @typescript-eslint/no-require-imports
// isDev && autoFixContext([require('react/jsx-dev-runtime'), 'jsx', 'jsxs', 'jsxDEV'])

const container = document.getElementById('root')
if (container) {
  const root = createRoot(container)
  root.render(
    <Provider store={store}>
      <App />
    </Provider>,
  )
} else {
  throw new Error('请检查index.html是否有root dom')
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals()
