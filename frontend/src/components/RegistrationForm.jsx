import { useState } from 'react'

import { createRegistration } from '../api/registrations'


const initialForm = {
  first_name: '',
  last_name: '',
  email: '',
  phone: '',
  company: '',
  position: '',
}


function RegistrationForm({ slug }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const { name, value } = event.target

    setForm((currentForm) => ({
      ...currentForm,
      [name]: value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setErrors({})

    try {
      await createRegistration(slug, form)

      setSuccess(true)
      setForm(initialForm)
    } catch (error) {
      setErrors(error)
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="registration-success">
        <div className="registration-success__icon">
          ✓
        </div>

        <p className="eyebrow">
          ГОТОВО
        </p>

        <h2>
          Вы зарегистрированы
        </h2>

        <p>
          Регистрация успешно сохранена.
          До встречи на мероприятии!
        </p>

        <button
          type="button"
          className="button button--secondary"
          onClick={() => setSuccess(false)}
        >
          Зарегистрировать ещё одного
        </button>
      </div>
    )
  }

  return (
    <div className="registration-card">
      <p className="eyebrow">
        РЕГИСТРАЦИЯ
      </p>

      <h2>
        Принять участие
      </h2>

      <p className="registration-card__intro">
        Заполните форму, чтобы зарегистрироваться
        на мероприятие.
      </p>

      <form
        className="registration-form"
        onSubmit={handleSubmit}
      >
        <label className="form-field">
          <span>Имя *</span>

          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="Иван"
            required
          />
        </label>

        <label className="form-field">
          <span>Фамилия *</span>

          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Иванов"
            required
          />
        </label>

        <label className="form-field">
          <span>Email *</span>

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="name@example.com"
            required
          />

          {errors.email && (
            <span className="form-error">
              {errors.email.join(' ')}
            </span>
          )}
        </label>

        <label className="form-field">
          <span>Телефон</span>

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="+7 999 000-00-00"
          />
        </label>

        <label className="form-field">
          <span>Компания</span>

          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
            placeholder="Название компании"
          />
        </label>

        <label className="form-field">
          <span>Должность</span>

          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
            placeholder="Ваша должность"
          />
        </label>

        {errors.non_field_errors && (
          <div className="form-error">
            {errors.non_field_errors.join(' ')}
          </div>
        )}

        <button
          type="submit"
          className="button button--primary registration-form__submit"
          disabled={submitting}
        >
          {submitting
            ? 'Отправляем...'
            : 'Зарегистрироваться'}
        </button>

        <p className="registration-form__note">
          Нажимая кнопку, вы отправляете данные
          организатору мероприятия.
        </p>
      </form>
    </div>
  )
}


export default RegistrationForm