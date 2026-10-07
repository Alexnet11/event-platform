import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {getEventRegistrations, getEventStats, getOrganizerEvent} from '../api/organizer'


function OrganizerEventPage() {
  const { eventId } = useParams()

  const [event, setEvent] = useState(null)
  const [registrations, setRegistrations] = useState([])
  const [stats, setStats] = useState(null)

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEventData() {
      try {
        const [
          eventData,
          registrationsData,
          statsData,
        ] = await Promise.all([
          getOrganizerEvent(eventId),
          getEventRegistrations(eventId),
          getEventStats(eventId),
        ])

        setEvent(eventData)
        setRegistrations(registrationsData)
        setStats(statsData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadEventData()
  }, [eventId])

  if (loading) {
    return (
      <main>
        <p>Загружаем мероприятие...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <Link to="/organizer">
          ← Назад к мероприятиям
        </Link>

        <p>Ошибка: {error}</p>
      </main>
    )
  }

  return (
    <main>
      <Link to="/organizer">
        ← Мои мероприятия
      </Link>

      <header>
        <h1>{event.title}</h1>

        <p>{event.short_description}</p>

        <p>
          Организация: {event.organization.name}
        </p>

        <p>
          Видимость: {event.visibility}
        </p>
      </header>

      <section>
        <h2>Статистика</h2>

        <div className="stats-grid">
          <article>
            <strong>{stats.registrations_total}</strong>
            <p>Всего регистраций</p>
          </article>

          <article>
            <strong>{stats.registered}</strong>
            <p>Активных</p>
          </article>

          <article>
            <strong>{stats.cancelled}</strong>
            <p>Отменено</p>
          </article>
        </div>
      </section>

      <section>
        <h2>Участники</h2>

        {registrations.length === 0 ? (
          <p>На мероприятие пока никто не зарегистрирован.</p>
        ) : (
          <div className="registration-list">
            {registrations.map((registration) => (
              <article key={registration.id}>
                <h3>
                  {registration.first_name}{' '}
                  {registration.last_name}
                </h3>

                <p>{registration.email}</p>

                {registration.phone && (
                  <p>{registration.phone}</p>
                )}

                {registration.company && (
                  <p>
                    {registration.company}
                    {registration.position &&
                      ` — ${registration.position}`}
                  </p>
                )}

                <p>
                  Статус:{' '}
                  <strong>
                    {registration.status_label}
                  </strong>
                </p>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}


export default OrganizerEventPage