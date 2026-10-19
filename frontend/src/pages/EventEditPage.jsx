import { useEffect, useState } from 'react'

import {Link, useNavigate, useParams,} from 'react-router'

import EventForm from '../components/EventForm'

import { getCurrentUser, getOrganizerEvent, updateEvent,} from '../api/organizer'


function EventEditPage() {
  const { eventId } = useParams()

  const navigate = useNavigate()

  const [event, setEvent] =
    useState(null)

  const [user, setUser] =
    useState(null)

  const [loading, setLoading] =
    useState(true)

  const [error, setError] =
    useState(null)


  useEffect(() => {
    async function loadData() {
      try {
        const [
          eventData,
          userData,
        ] = await Promise.all([
          getOrganizerEvent(eventId),
          getCurrentUser(),
        ])

        setEvent(eventData)
        setUser(userData)
      } catch (error) {
        setError(
          error.message
          || 'Не удалось загрузить мероприятие.',
        )
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [eventId])


  async function handleUpdate(formData) {
    const updatedEvent =
      await updateEvent(
        eventId,
        formData,
      )

    navigate(
      `/organizer/events/${updatedEvent.id}`,
    )
  }


  if (loading) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-state">
            Загружаем мероприятие...
          </div>
        </div>
      </main>
    )
  }


  if (error || !event || !user) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="empty-state empty-state--error">
            Не удалось открыть мероприятие.
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
            to={`/organizer/events/${event.id}`}
            className="back-link"
          >
            ← Назад к мероприятию
          </Link>

          <p className="eyebrow">
            РЕДАКТИРОВАНИЕ
          </p>

          <h1>
            {event.title}
          </h1>

          <p>
            Измените необходимые данные
            и сохраните мероприятие.
          </p>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container event-builder-layout">
          <EventForm
            key={event.id}
            memberships={user.memberships}
            initialValues={event}
            onSubmit={handleUpdate}
            submitLabel="Сохранить изменения"
          />
        </div>
      </section>
    </main>
  )
}


export default EventEditPage