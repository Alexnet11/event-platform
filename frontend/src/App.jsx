import { Route, Routes } from 'react-router'

import AppLayout from './components/AppLayout'
import EventDetailPage from './pages/EventDetailPage'
import HomePage from './pages/HomePage'
import OrganizerPage from './pages/OrganizerPage'
import OrganizerEventPage from './pages/OrganizerEventPage'
import NotFoundPage from './pages/NotFoundPage'


function App() {
  return (
    <AppLayout>
      <Routes>
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="/events/:slug"
          element={<EventDetailPage />}
        />

        <Route
          path="/organizer"
          element={<OrganizerPage />}
        />

        <Route
          path="/organizer/events/:eventId"
          element={<OrganizerEventPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />
      </Routes>
    </AppLayout>
  )
}

export default App