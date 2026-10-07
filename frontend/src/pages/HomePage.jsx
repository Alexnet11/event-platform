import PublicEventList from '../components/PublicEventList'
import { Link } from 'react-router'


function HomePage() {
  return (
    <main>
      <header>
        <h1>Event Platform</h1>

        <p>
          Находите мероприятия и регистрируйтесь онлайн.
        </p>

        <Link to="/organizer">
         Кабинет организатора
        </Link>
      </header>

      <PublicEventList />
    </main>
  )
}


export default HomePage