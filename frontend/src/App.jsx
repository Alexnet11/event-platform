import { Route, Routes } from 'react-router'

import AppLayout from './components/AppLayout'
import EventDetailPage from './pages/EventDetailPage'
import HomePage from './pages/HomePage'
import OrganizerPage from './pages/OrganizerPage'
import OrganizerEventPage from './pages/OrganizerEventPage'
import NotFoundPage from './pages/NotFoundPage'
import EventCreatePage from './pages/EventCreatePage'
import EventEditPage from './pages/EventEditPage'
import RegisterOrganizerPage from './pages/RegisterOrganizerPage'


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
          path="/organizer/events/new"
          element={<EventCreatePage/>}
        />

        <Route
          path="/organizer/events/:eventId/edit"
          element={<EventEditPage />}
        />

        <Route
          path="*"
          element={<NotFoundPage />}
        />

        <Route
          path="/register"
          element={<RegisterOrganizerPage />}
        />
      </Routes>
    </AppLayout>
  )
}

export default App