import { useEffect, useState } from 'react'
import { Link } from 'react-router'

import {
  getCurrentUser,
  getOrganizerEvents,
} from '../api/organizer'


function getVisibilityLabel(visibility) {
  const labels = {
    public: 'Публичное',
    unlisted: 'По ссылке',
    private: 'Приватное',
  }

  return labels[visibility] || visibility
}



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
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-state">
            Загружаем кабинет...
          </div>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="dashboard-page">
        <div className="container">
          <div className="dashboard-login">
            <p className="eyebrow">
              ORGANIZER
            </p>

            <h1>
              Кабинет организатора
            </h1>

            <p>
              Для доступа к управлению мероприятиями
              необходимо войти в систему.
            </p>

            <a
              href="/api-auth/login/?next=/organizer"
              className="button button--primary"
            >
              Войти как организатор
            </a>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="dashboard-page">
      <section className="dashboard-header">
        <div className="container dashboard-header__inner">
          <div>
            <p className="eyebrow">
              ORGANIZER
            </p>

            <h1>
              Кабинет организатора
            </h1>

            <p className="dashboard-header__description">
              Управляйте мероприятиями,
              регистрациями и статистикой.
            </p>
          </div>

          <div className="dashboard-user">
            <span className="dashboard-user__avatar">
              {user.username
                .charAt(0)
                .toUpperCase()}
            </span>

            <div>
              <span className="dashboard-user__label">
                Пользователь
              </span>

              <strong>
                {user.username}
              </strong>
            </div>
          </div>
        </div>
      </section>

      <section className="dashboard-content">
        <div className="container">
          <div className="dashboard-section">
            <div className="dashboard-section__heading">
              <div>
                <p className="eyebrow">
                  ОРГАНИЗАЦИИ
                </p>

                <h2>
                  Мои организации
                </h2>
              </div>
            </div>

            <div className="organization-grid">
              {user.memberships.map((membership) => (
                <article
                  key={
                    membership.organization.id
                  }
                  className="organization-card"
                >
                  <div className="organization-card__icon">
                    {membership.organization.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <h3>
                      {
                        membership.organization
                          .name
                      }
                    </h3>

                    <p>
                      {membership.role_label}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="dashboard-section">
            <div className="dashboard-section__heading">
              <div>
                <p className="eyebrow">
                  МЕРОПРИЯТИЯ
                </p>

                <h2>
                  Мои мероприятия
                </h2>
              </div>

              <span className="dashboard-count">
                {events.length}
              </span>
            </div>

            {events.length === 0 ? (
              <div className="dashboard-state">
                Мероприятий пока нет.
              </div>
            ) : (
              <div className="dashboard-event-list">
                {events.map((event) => (
                  <article
                    key={event.id}
                    className="dashboard-event-card"
                  >

                    <div
                      className="dashboard-event-card__cover"
                      style={{
                        backgroundImage: event.cover_image
                        ? `url("${event.cover_image}")`
                        : 'linear-gradient(135deg, #2155d9, #18212f)',
                      }}
                    />

                    <div className="dashboard-event-card__main">
                      <div className="dashboard-event-card__top">
                        <span
                          className={`status-badge status-badge--${event.visibility}`}
                        >
                          {getVisibilityLabel(event.visibility)}
                        </span>

                        {event.starts_at && (
                          <span className="dashboard-event-card__date">
                            {new Date(
                              event.starts_at,
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

                      <h3>
                        {event.title}
                      </h3>

                      <p>
                        {event.short_description}
                      </p>

                      {event.location_name && (
                        <span className="dashboard-event-card__location">
                          {event.location_name}
                        </span>
                      )}
                    </div>

                    <div className="dashboard-event-card__actions">
                      <Link
                        to={`/organizer/events/${event.id}`}
                        className="button button--primary"
                      >
                        Управление
                      </Link>

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
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  )
}


export default OrganizerPage