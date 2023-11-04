import { createRoot } from 'react-dom/client'
import { StatusProvider } from './helpers/errorContext'
import App from './App'


const root = createRoot(document.getElementById('root'))
root.render(<StatusProvider><App /></StatusProvider>)
