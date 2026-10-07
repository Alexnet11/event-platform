import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import {getCurrentUser, getOrganizerEvents,} from '../api/organizer'


function OrganizerPage() {
  const [user, setUser] = useState(null)
  const [events, setEvents] = useState([])

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadOrganizerData() {
      try {
        const [userData, eventsData] = await Promise.all([
          getCurrentUser(),
          getOrganizerEvents(),
        ])

        setUser(userData)
        setEvents(eventsData)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadOrganizerData()
  }, [])

  if (loading) {
    return (
      <main>
        <p>Загружаем кабинет...</p>
      </main>
    )
  }

  if (error) {
    return (
      <main>
        <h1>Кабинет организатора</h1>

        <p>
          Для доступа к кабинету необходимо войти.
        </p>

        <a href="/api-auth/login/?next=/organizer">
          Войти как организатор
        </a>

        <p>{error}</p>

        <Link to="/">
          ← На главную
        </Link>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">
        ← На публичную страницу
      </Link>

      <header>
        <h1>Кабинет организатора</h1>

        <p>
          Пользователь: <strong>{user.username}</strong>
        </p>
      </header>

      <section>
        <h2>Мои организации</h2>

        {user.memberships.map((membership) => (
          <article key={membership.id}>
            <strong>
              {membership.organization.name}
            </strong>

            <p>
              Роль: {membership.role_label}
            </p>
          </article>
        ))}
      </section>

      <section>
        <h2>Мои мероприятия</h2>

        {events.length === 0 ? (
          <p>Мероприятий пока нет.</p>
        ) : (
          events.map((event) => (
            <article key={event.id}>
              <h3>{event.title}</h3>

              <p>
                Видимость: {event.visibility}
              </p>

              <p>
                {event.location_name}
              </p>

              <Link
                to={`/organizer/events/${event.id}`}
              >
                Управление мероприятием
              </Link>
            </article>
          ))
        )}
      </section>
    </main>
  )
}


export default OrganizerPage