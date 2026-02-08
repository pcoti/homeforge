import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './store/AppContext'
import { ThemeProvider } from './theme/ThemeProvider'
import { useAppContext } from './store/AppContext'
import { ActionTypes } from './store/reducer'
import Shell from './components/layout/Shell'
import DashboardView from './components/dashboard/DashboardView'
import FinanceView from './components/finances/FinanceView'
import RequirementsView from './components/requirements/RequirementsView'
import TimelineView from './components/timeline/TimelineView'
import LocationView from './components/locations/LocationView'
import ChatView from './components/chat/ChatView'
import SettingsView from './components/settings/SettingsView'

function AppRoutes() {
  const { state, dispatch } = useAppContext()

  return (
    <ThemeProvider
      theme={state.settings.theme}
      onToggle={() =>
        dispatch({
          type: ActionTypes.SET_THEME,
          payload: state.settings.theme === 'dark' ? 'light' : 'dark',
        })
      }
    >
      <Routes>
        <Route element={<Shell />}>
          <Route index element={<DashboardView />} />
          <Route path="finances" element={<FinanceView />} />
          <Route path="requirements" element={<RequirementsView />} />
          <Route path="timeline" element={<TimelineView />} />
          <Route path="locations" element={<LocationView />} />
          <Route path="chat" element={<ChatView />} />
          <Route path="settings" element={<SettingsView />} />
        </Route>
      </Routes>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppRoutes />
      </AppProvider>
    </BrowserRouter>
  )
}
