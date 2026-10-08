import { Link } from 'react-router'


function NotFoundPage() {
  return (
    <main className="not-found-page">
      <div className="container">
        <div className="not-found">
          <span className="not-found__code">
            404
          </span>

          <p className="eyebrow">
            СТРАНИЦА НЕ НАЙДЕНА
          </p>

          <h1>
            Здесь ничего нет
          </h1>

          <p className="not-found__description">
            Возможно, адрес страницы указан
            неправильно или страница была перемещена.
          </p>

          <Link
            to="/"
            className="button button--primary"
          >
            На главную
          </Link>
        </div>
      </div>
    </main>
  )
}


export default NotFoundPage