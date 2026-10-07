import { Route, Routes } from 'react-router'

import EventDetailPage from './pages/EventDetailPage'
import HomePage from './pages/HomePage'
import OrganizerPage from './pages/OrganizerPage'
import OrganizerEventPage from './pages/OrganizerEventPage'


function App() {
  return (
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
    </Routes>
  )
}


export default App