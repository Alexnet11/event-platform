import { Link } from 'react-router'

import PublicEventList from '../components/PublicEventList'


function HomePage() {
  return (
    <main>
      <section className="hero">
        <div className="container hero__inner">
          <div className="hero__content">
            <p className="eyebrow">
              EVENT PLATFORM
            </p>

            <h1 className="hero__title">
              Жизнь состоит
              <br />
              из событий.
              <br />
              <span>Найди своё!</span>
            </h1>

            <p className="hero__description">
              Единое пространство для мероприятий:
              находите события, узнавайте подробности
              и регистрируйтесь онлайн.
            </p>

            <div className="hero__actions">
              <a
                href="#events"
                className="button button--primary"
              >
                Найти событие
              </a>

              <Link
                to="/organizer"
                className="button button--secondary"
              >
                Я организатор
              </Link>
            </div>

            <p className="hero__note">
              Открытые события и мероприятия по приглашению
            </p>
          </div>

          <div className="hero__visual">
            <div className="hero-orbit hero-orbit--large" />
            <div className="hero-orbit hero-orbit--small" />

            <div className="hero-card">
              <span className="hero-card__label">
                EVENT PLATFORM
              </span>

              <strong>
                Встречай.
                <br />
                Участвуй.
                <br />
                Создавай.
              </strong>

              <span className="hero-card__footer">
                События начинаются здесь
              </span>
            </div>
          </div>
        </div>
      </section>

      <section
        id="events"
        className="section events-section"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <p className="eyebrow">
                АФИША
              </p>

              <h2>
                Ближайшие мероприятия
              </h2>
            </div>

            <p className="section-heading__description">
              Выберите событие и узнайте подробности.
            </p>
          </div>

          <PublicEventList />
        </div>
      </section>
    </main>
  )
}


export default HomePage