import { useEffect, useState } from 'react'
import {
  Link,
  useNavigate,
} from 'react-router'

import EventForm from '../components/EventForm'

import {
  createEvent,
  getCurrentUser,
} from '../api/organizer'


function EventCreatePage() {
  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadUser() {
      try {
        const userData =
          await getCurrentUser()

        setUser(userData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadUser()
  }, [])

  async function handleCreate(formData) {
    const event = await createEvent(formData)

    navigate(
      `/organizer/events/${event.id}`,
    )
  }

  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-state">
            Загружаем конструктор...
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="empty-state empty-state--error">
            Не удалось открыть конструктор.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-event-header">
        <div className="container">
          <Link
            to="/organizer"
            className="back-link"
          >
            ← Мои мероприятия
          </Link>

          <p className="eyebrow">
            НОВОЕ МЕРОПРИЯТИЕ
          </p>

          <h1>
            Создать мероприятие
          </h1>

          <p>
            Заполните информацию о событии.
            После сохранения оно появится
            в вашем кабинете.
          </p>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container event-builder-layout">
          <EventForm
            memberships={user.memberships}
            onSubmit={handleCreate}
            submitLabel="Создать мероприятие"
          />
        </div>
      </section>
    </main>
  )
}


export default EventCreatePage