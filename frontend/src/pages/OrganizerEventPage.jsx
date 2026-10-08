import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router'

import {
  getEventRegistrations,
  getEventStats,
  getOrganizerEvent,
} from '../api/organizer'


function getVisibilityLabel(visibility) {
  const labels = {
    public: 'Публичное',
    unlisted: 'По ссылке',
    private: 'Приватное',
  }

  return labels[visibility] || visibility
}



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
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-state">
            Загружаем мероприятие...
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <Link
            to="/organizer"
            className="back-link"
          >
            ← Назад к мероприятиям
          </Link>

          <div className="empty-state empty-state--error">
            Не удалось загрузить данные мероприятия.
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

          <div className="dashboard-event-header__content">
            <div>
              <div className="dashboard-event-header__meta">
                <span
                  className={`status-badge status-badge--${event.visibility}`}
                >
                  {getVisibilityLabel(event.visibility)}
                </span>

                <span>
                  {event.organization.name}
                </span>
              </div>

              <h1>
                {event.title}
              </h1>

              <p>
                {event.short_description}
              </p>
            </div>

            {event.visibility === 'public' && (
              <Link
                to={`/events/${event.slug}`}
                className="button button--secondary"
              >
                Посмотреть страницу
              </Link>
            )}

            {event.visibility === 'unlisted' && (
              <Link
                to={`/events/${event.slug}`}
                className="button button--secondary"
              >
                Посмотреть по ссылке
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-section">
            <div className="dashboard-section__heading">
              <div>
                <p className="eyebrow">
                  АНАЛИТИКА
                </p>

                <h2>
                  Статистика
                </h2>
              </div>
            </div>

            <div className="stats-dashboard">
              <article className="stat-card">
                <span className="stat-card__label">
                  Всего регистраций
                </span>

                <strong>
                  {stats.registrations_total}
                </strong>
              </article>

              <article className="stat-card">
                <span className="stat-card__label">
                  Активных
                </span>

                <strong>
                  {stats.registered}
                </strong>
              </article>

              <article className="stat-card">
                <span className="stat-card__label">
                  Отменено
                </span>

                <strong>
                  {stats.cancelled}
                </strong>
              </article>
            </div>
          </div>

          <div className="dashboard-section">
            <div className="dashboard-section__heading">
              <div>
                <p className="eyebrow">
                  РЕГИСТРАЦИИ
                </p>

                <h2>
                  Участники
                </h2>
              </div>

              <span className="dashboard-count">
                {registrations.length}
              </span>
            </div>

            {registrations.length === 0 ? (
              <div className="dashboard-state">
                На мероприятие пока никто
                не зарегистрирован.
              </div>
            ) : (
              <div className="participant-table">
                <div className="participant-table__header">
                  <span>Участник</span>
                  <span>Компания</span>
                  <span>Контакты</span>
                  <span>Статус</span>
                </div>

                {registrations.map(
                  (registration) => (
                    <div
                      key={registration.id}
                      className="participant-row"
                    >
                      <div className="participant-person">
                        <span className="participant-avatar">
                          {registration.first_name
                            .charAt(0)
                            .toUpperCase()}
                        </span>

                        <div>
                          <strong>
                            {
                              registration.first_name
                            }{' '}
                            {
                              registration.last_name
                            }
                          </strong>

                          {registration.position && (
                            <span>
                              {
                                registration.position
                              }
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="participant-cell">
                        {registration.company || '—'}
                      </div>

                      <div className="participant-cell participant-cell--contacts">
                        <span>
                          {registration.email}
                        </span>

                        {registration.phone && (
                          <span>
                            {registration.phone}
                          </span>
                        )}
                      </div>

                      <div>
                        <span
                          className={`registration-status registration-status--${registration.status}`}
                        >
                          {
                            registration.status_label
                          }
                        </span>
                      </div>
                    </div>
                  ),
                )}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}


export default OrganizerEventPage