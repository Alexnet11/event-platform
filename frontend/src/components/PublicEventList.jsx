import { useEffect, useState } from 'react'
import { Link } from 'react-router'


import { getPublicEvents } from '../api/events'


function PublicEventList() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEvents() {
      try {
        const data = await getPublicEvents()

        setEvents(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  if (loading) {
    return <p>Загружаем мероприятия...</p>
  }

  if (error) {
    return <p>Ошибка: {error}</p>
  }

  if (events.length === 0) {
    return <p>Публичных мероприятий пока нет.</p>
  }

  return (
    <section>
      <h2>Мероприятия</h2>

      {events.map((event) => (
        <article key={event.id}>
          <h3>{event.title}</h3>

          <p>{event.short_description}</p>

          <p>
            {event.location_name}
          </p>

          <Link to={`/events/${event.slug}`}>
            Подробнее
          </Link>
        </article>
      ))}
    </section>
  )
}


export default PublicEventList