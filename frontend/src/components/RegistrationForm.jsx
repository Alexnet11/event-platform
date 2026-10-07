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
      <section>
        <h2>Регистрация завершена</h2>

        <p>
          Спасибо! Ваша регистрация на мероприятие
          успешно сохранена.
        </p>

        <button
          type="button"
          onClick={() => setSuccess(false)}
        >
          Зарегистрировать ещё одного участника
        </button>
      </section>
    )
  }

  return (
    <section>
      <h2>Регистрация</h2>

      <form onSubmit={handleSubmit}>
        <label>
          Имя

          <input
            type="text"
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Фамилия

          <input
            type="text"
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Email

          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            required
          />

          {errors.email && (
            <p>{errors.email.join(' ')}</p>
          )}
        </label>

        <label>
          Телефон

          <input
            type="tel"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Компания

          <input
            type="text"
            name="company"
            value={form.company}
            onChange={handleChange}
          />
        </label>

        <label>
          Должность

          <input
            type="text"
            name="position"
            value={form.position}
            onChange={handleChange}
          />
        </label>

        {errors.non_field_errors && (
          <p>{errors.non_field_errors.join(' ')}</p>
        )}

        <button
          type="submit"
          disabled={submitting}
        >
          {submitting
            ? 'Отправляем...'
            : 'Зарегистрироваться'}
        </button>
      </form>
    </section>
  )
}


export default RegistrationForm