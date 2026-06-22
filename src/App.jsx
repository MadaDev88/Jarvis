import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import DashboardPage from './pages/DashboardPage'
import RestaurantPage from './pages/RestaurantPage'
import FinancePage from './pages/FinancePage'
import TasksPage from './pages/TasksPage'
import AssistantPage from './pages/AssistantPage'
import SettingsPage from './pages/SettingsPage'
import { useStore } from './store/useStore'
import './App.css'

const pageTitles = {
  '/': 'DASHBOARD',
  '/restaurant': 'ARCHES RESTAURANT',
  '/finance': 'FINANCE & PORTFOLIO',
  '/tasks': 'TASKS & GOALS',
  '/assistant': 'AI ASSISTANT',
  '/settings': 'SETTINGS',
}

function App() {
  const store = useStore()
  const path = window.location.hash.replace('#', '') || '/'
  const pageTitle = pageTitles[path] || 'DASHBOARD'

  return (
    <div className="jarvis-app">
      <Sidebar />
      <main className="main-content">
        <TopBar pageTitle={pageTitle} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<DashboardPage store={store} />} />
            <Route path="/restaurant" element={<RestaurantPage store={store} />} />
            <Route path="/finance" element={<FinancePage store={store} />} />
            <Route path="/tasks" element={<TasksPage store={store} />} />
            <Route path="/assistant" element={<AssistantPage store={store} />} />
            <Route path="/settings" element={<SettingsPage store={store} />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}

export default App
