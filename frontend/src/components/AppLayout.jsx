import {
  Link,
  NavLink,
  useLocation,
  useNavigate,
} from 'react-router'

import {
  useEffect,
  useState,
} from 'react'

import {
  getCurrentUser,
  logoutOrganizer,
} from '../api/organizer'


function AppLayout({ children }) {
  const location = useLocation()
  const navigate = useNavigate()

  const [currentUser, setCurrentUser] = useState(null)
  const [isAuthLoading, setIsAuthLoading] = useState(true)

  useEffect(() => {
    async function loadCurrentUser() {
      setIsAuthLoading(true)

      try {
        const user = await getCurrentUser()

        setCurrentUser(user)
      } catch {
        setCurrentUser(null)
      } finally {
        setIsAuthLoading(false)
      }
    }

    loadCurrentUser()
  }, [location.pathname])


  async function handleLogout() {
    try {
      await logoutOrganizer()

      setCurrentUser(null)

      navigate('/')
    } catch (error) {
      console.error(
        'Не удалось выйти',
        error,
      )
    }
  }


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

            {!isAuthLoading && !currentUser && (
              <div className="header__auth">
                <a
                  href="/api-auth/login/?next=/organizer"
                  className="button button--secondary"
                >
                  Войти
                </a>

                <Link
                  to="/register"
                  className="button button--primary"
                >
                  Стать организатором
                </Link>
              </div>
            )}

            {!isAuthLoading && currentUser && (
              <div className="header__auth">
                <NavLink
                  to="/organizer"
                  className={({ isActive }) =>
                    isActive
                      ? 'button button--secondary site-nav__link--active'
                      : 'button button--secondary'
                  }
                >
                  Личный кабинет
                </NavLink>

                <button
                  type="button"
                  className="button button--ghost"
                  onClick={handleLogout}
                >
                  Выйти
                </button>
              </div>
            )}
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