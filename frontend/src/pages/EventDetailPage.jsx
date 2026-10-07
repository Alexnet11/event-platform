import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { getPublicEvent } from '../api/events'
import RegistrationForm from '../components/RegistrationForm'


function EventDetailPage() {
  const { slug } = useParams()

  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    async function loadEvent() {
      try {
        const data = await getPublicEvent(slug)

        setEvent(data)
      } catch (error) {
        setError(error.message)
      } finally {
        setLoading(false)
      }
    }

    loadEvent()
  }, [slug])

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
        <Link to="/">← На главную</Link>

        <p>Ошибка: {error}</p>
      </main>
    )
  }

  return (
    <main>
      <Link to="/">← На главную</Link>

      <article>
        {event.cover_image && (
          <img
            src={event.cover_image}
            alt={event.title}
          />
        )}

        <h1>{event.title}</h1>

        <p>{event.short_description}</p>

        <h2>О мероприятии</h2>

        <p>{event.description}</p>

        <h2>Место проведения</h2>

        <p>{event.location_name}</p>

        <p>{event.address}</p>

        {event.registration_enabled ? (
          <RegistrationForm slug={event.slug} />
        ) : (
          <p>
            Регистрация на мероприятие закрыта.
          </p>
        )}
      </article>
    </main>
  )
}


export default EventDetailPage