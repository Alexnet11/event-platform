import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import { getPublicEvent } from '../api/events'
import RegistrationForm from '../components/RegistrationForm'


function formatEventDate(value) {
  if (!value) {
    return null
  }

  return new Intl.DateTimeFormat(
    'ru-RU',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    },
  ).format(new Date(value))
}


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
      <main className="page-state">
        <div className="container">
          <p>Загружаем мероприятие...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="page-state">
        <div className="container">
          <Link
            to="/"
            className="back-link"
          >
            ← Все мероприятия
          </Link>

          <div className="empty-state empty-state--error">
            Не удалось загрузить мероприятие.
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="event-detail-page">
      <section className="event-detail-hero">
        <div className="container">
          <Link
            to="/"
            className="back-link"
          >
            ← Все мероприятия
          </Link>

          <div className="event-detail-hero__grid">
            <div className="event-detail-hero__content">
              {event.organization && (
                <p className="eyebrow">
                  {event.organization.name}
                </p>
              )}

              <h1 className="event-detail-hero__title">
                {event.title}
              </h1>

              <p className="event-detail-hero__description">
                {event.short_description}
              </p>

              <div className="event-detail-meta">
                {event.starts_at && (
                  <div className="event-detail-meta__item">
                    <span className="event-detail-meta__label">
                      Дата и время
                    </span>

                    <strong>
                      {formatEventDate(event.starts_at)}
                    </strong>
                  </div>
                )}

                {event.location_name && (
                  <div className="event-detail-meta__item">
                    <span className="event-detail-meta__label">
                      Место
                    </span>

                    <strong>
                      {event.location_name}
                    </strong>
                  </div>
                )}
              </div>
            </div>

            {event.cover_image && (
              <div className="event-detail-cover">
                <img
                  src={event.cover_image}
                  alt={event.title}
                />
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container event-detail-layout">
          <div className="event-detail-content">
            <section className="content-card">
              <p className="eyebrow">
                О СОБЫТИИ
              </p>

              <h2>О мероприятии</h2>

              {event.description ? (
                <p className="event-description">
                  {event.description}
                </p>
              ) : (
                <p className="event-description">
                  Подробное описание мероприятия
                  пока не добавлено.
                </p>
              )}
            </section>

            <section className="content-card">
              <p className="eyebrow">
                ПЛОЩАДКА
              </p>

              <h2>Место проведения</h2>

              {event.location_name && (
                <div className="event-info-row">
                  <span>Площадка</span>
                  <strong>
                    {event.location_name}
                  </strong>
                </div>
              )}

              {event.address && (
                <div className="event-info-row">
                  <span>Адрес</span>
                  <strong>
                    {event.address}
                  </strong>
                </div>
              )}

              {event.starts_at && (
                <div className="event-info-row">
                  <span>Начало</span>
                  <strong>
                    {formatEventDate(event.starts_at)}
                  </strong>
                </div>
              )}

              {event.ends_at && (
                <div className="event-info-row">
                  <span>Окончание</span>
                  <strong>
                    {formatEventDate(event.ends_at)}
                  </strong>
                </div>
              )}
            </section>
          </div>

          <aside className="registration-panel">
            {event.registration_enabled ? (
              <RegistrationForm slug={event.slug} />
            ) : (
              <div className="registration-closed">
                <p className="eyebrow">
                  РЕГИСТРАЦИЯ
                </p>

                <h2>
                  Регистрация закрыта
                </h2>

                <p>
                  Приём заявок на это мероприятие
                  завершён.
                </p>
              </div>
            )}
          </aside>
        </div>
      </section>
    </main>
  )
}


export default EventDetailPage