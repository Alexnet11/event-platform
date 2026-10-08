import { Link, NavLink } from 'react-router'


function AppLayout({ children }) {
  return (
    <div className="app-shell">
      <header className="site-header">
        <div className="container site-header__inner">
          <Link
            to="/"
            className="brand"
          >
            Event Platform
          </Link>

          <nav className="site-nav">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                isActive
                  ? 'site-nav__link site-nav__link--active'
                  : 'site-nav__link'
              }
            >
              Мероприятия
            </NavLink>

            <NavLink
              to="/organizer"
              className={({ isActive }) =>
                isActive
                  ? 'site-nav__link site-nav__link--accent site-nav__link--active'
                  : 'site-nav__link site-nav__link--accent'
              }
            >
              Кабинет организатора
            </NavLink>
          </nav>
        </div>
      </header>

      <div className="app-content">
        {children}
      </div>

      <footer className="site-footer">
        <div className="container">
          <p>
            Event Platform — управление мероприятиями
          </p>
        </div>
      </footer>
    </div>
  )
}


export default AppLayout