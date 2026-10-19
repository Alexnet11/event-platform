import { useState } from 'react'
import { useNavigate,} from 'react-router'

import {registerOrganizer,} from '../api/organizer'


function getErrorMessage(errors, field) {
  const error = errors[field]

  if (!error) {
    return null
  }

  return Array.isArray(error)
    ? error.join(' ')
    : String(error)
}


function RegisterOrganizerPage() {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',

    password: '',
    password_confirm: '',

    organization_kind: 'individual',
    organization_name: '',
  })

  const [errors, setErrors] =
    useState({})

  const [submitting, setSubmitting] =
    useState(false)


  function handleChange(event) {
    const {
      name,
      value,
    } = event.target

    setForm((current) => ({
      ...current,
      [name]: value,
    }))
  }


  async function handleSubmit(event) {
    event.preventDefault()

    setErrors({})

    if (
      form.password
      !== form.password_confirm
    ) {
      setErrors({
        password_confirm:
          'Пароли не совпадают.',
      })

      return
    }

    setSubmitting(true)

    try {
      await registerOrganizer({
        username: form.username,
        email: form.email,
        first_name: form.first_name,
        last_name: form.last_name,

        password: form.password,

        organization_kind:
          form.organization_kind,

        organization_name:
          form.organization_name,
      })

      navigate('/organizer')
    } catch (error) {
      setErrors(
        typeof error === 'object'
          && error !== null
          ? error
          : {
              detail:
                'Не удалось зарегистрироваться.',
            },
      )
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className="auth-page">
      <div className="container">
        <div className="auth-card">
          <p className="eyebrow">
            EVENT PLATFORM
          </p>

          <h1>
            Стать организатором
          </h1>

          <p className="auth-card__intro">
            Создайте аккаунт и своё рабочее
            пространство для мероприятий.
          </p>

          <form
            className="auth-form"
            onSubmit={handleSubmit}
          >
            <label className="form-field">
              <span>
                Логин *
              </span>

              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                autoComplete="username"
                required
              />

              {getErrorMessage(
                errors,
                'username',
              ) && (
                <span className="form-error">
                  {getErrorMessage(
                    errors,
                    'username',
                  )}
                </span>
              )}
            </label>

            <div className="auth-form__row">
              <label className="form-field">
                <span>
                  Имя
                </span>

                <input
                  type="text"
                  name="first_name"
                  value={form.first_name}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
              </label>

              <label className="form-field">
                <span>
                  Фамилия
                </span>

                <input
                  type="text"
                  name="last_name"
                  value={form.last_name}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
              </label>
            </div>

            <label className="form-field">
              <span>
                Email *
              </span>

              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />

              {getErrorMessage(
                errors,
                'email',
              ) && (
                <span className="form-error">
                  {getErrorMessage(
                    errors,
                    'email',
                  )}
                </span>
              )}
            </label>

            <label className="form-field">
              <span>
                Кто вы? *
              </span>

              <select
                name="organization_kind"
                value={form.organization_kind}
                onChange={handleChange}
              >
                <option value="individual">
                  Частный организатор
                </option>

                <option value="organization">
                  Организация / команда
                </option>
              </select>
            </label>

            <label className="form-field">
              <span>
                {form.organization_kind
                  === 'individual'
                  ? 'Название организатора / проекта *'
                  : 'Название организации / команды *'}
              </span>

              <input
                type="text"
                name="organization_name"
                value={form.organization_name}
                onChange={handleChange}
                placeholder={
                  form.organization_kind
                    === 'individual'
                    ? 'Например: Alex Events'
                    : 'Например: Вересники'
                }
                required
              />

              {getErrorMessage(
                errors,
                'organization_name',
              ) && (
                <span className="form-error">
                  {getErrorMessage(
                    errors,
                    'organization_name',
                  )}
                </span>
              )}
            </label>

            <div className="auth-form__row">
              <label className="form-field">
                <span>
                  Пароль *
                </span>

                <input
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                {getErrorMessage(
                  errors,
                  'password',
                ) && (
                  <span className="form-error">
                    {getErrorMessage(
                      errors,
                      'password',
                    )}
                  </span>
                )}
              </label>

              <label className="form-field">
                <span>
                  Повторите пароль *
                </span>

                <input
                  type="password"
                  name="password_confirm"
                  value={form.password_confirm}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />

                {getErrorMessage(
                  errors,
                  'password_confirm',
                ) && (
                  <span className="form-error">
                    {getErrorMessage(
                      errors,
                      'password_confirm',
                    )}
                  </span>
                )}
              </label>
            </div>

            {errors.detail && (
              <div className="event-builder__error">
                {getErrorMessage(
                  errors,
                  'detail',
                )}
              </div>
            )}

            <button
              type="submit"
              className="button button--primary"
              disabled={submitting}
            >
              {submitting
                ? 'Создаём аккаунт...'
                : 'Зарегистрироваться'}
            </button>
          </form>

          <p className="auth-card__footer">
            Уже есть аккаунт?{' '}

            <a
              href="/api-auth/login/?next=/organizer"
            >
              Войти
            </a>
          </p>
        </div>
      </div>
    </main>
  )
}


export default RegisterOrganizerPage