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
    return (
      <div className="empty-state">
        Загружаем мероприятия...
      </div>
    )
  }

  if (error) {
    return (
      <div className="empty-state empty-state--error">
        Ошибка: {error}
      </div>
    )
  }

  if (events.length === 0) {
    return (
      <div className="empty-state">
        Публичных мероприятий пока нет.
      </div>
    )
  }

  return (
    <div className="event-grid">
      {events.map((event) => (
        <article
          key={event.id}
          className="event-card event-card--cover"
          style={{
            backgroundImage: event.cover_image
              ? `
                  linear-gradient(
                    180deg,
                    rgba(205, 208, 213, 0.1) 0%,
                    rgba(207, 207, 207, 0.82) 100%
                  ),
                  url("${event.cover_image}")
                `
              : `
                  linear-gradient(
                    135deg,
                   #2155d9 0%,
                   #18212f 100%
                  )
                `,
            }}
>
  <div className="event-card__content">
    <div className="event-card__meta">
      {event.starts_at && (
        <span>
          {new Date(
            event.starts_at
          ).toLocaleDateString(
            'ru-RU',
            {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            },
          )}
        </span>
      )}
    </div>

    <div className="event-card__bottom">
      <h3 className="event-card__title">
        {event.title}
      </h3>

      <Link
        to={`/events/${event.slug}`}
        className="button button--light"
      >
        Подробнее
      </Link>
    </div>
  </div>
</article>
      ))}
    </div>
  )
}


export default PublicEventList