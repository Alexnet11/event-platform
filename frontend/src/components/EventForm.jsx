import { useState } from 'react'



function toDateTimeLocal(value) {
  if (!value) {
    return ''
  }

  const date = new Date(value)

  const offset = date.getTimezoneOffset()

  const localDate = new Date(
    date.getTime() - offset * 60 * 1000,
  )

  return localDate
    .toISOString()
    .slice(0, 16)
}



function getErrorMessage(errors, field) {
  const error = errors[field]

  if (!error) {
    return null
  }

  return Array.isArray(error)
    ? error.join(' ')
    : String(error)
}


function EventForm({
  memberships,
  onSubmit,
  initialValues = null,
  submitLabel = 'Создать мероприятие',
}) {
  
  const [form, setForm] = useState({
    organization_id:
    initialValues?.organization?.id?.toString()
    || memberships[0]?.organization.id?.toString()
    || '',

    title:
      initialValues?.title || '',

    slug:
      initialValues?.slug || '',

    short_description:
      initialValues?.short_description || '',

    description:
      initialValues?.description || '',

    starts_at:
      toDateTimeLocal(
        initialValues?.starts_at,
      ),

    ends_at:
      toDateTimeLocal(
        initialValues?.ends_at,
      ),

    location_name:
      initialValues?.location_name || '',

    address:
      initialValues?.address || '',

    visibility:
      initialValues?.visibility || 'unlisted',

    status:
      initialValues?.status || 'draft',
    

    registration_enabled:
      initialValues?.registration_enabled ?? true,

    cover_image: null,
  })

  const [submitting, setSubmitting] = useState(false)
  const [errors, setErrors] = useState({})

  function handleChange(event) {
    const {
      name,
      value,
      type,
      checked,
      files,
    } = event.target

    if (type === 'file') {
      setForm((currentForm) => ({
        ...currentForm,
        [name]: files[0] || null,
      }))

      return
    }

    setForm((currentForm) => ({
      ...currentForm,
      [name]: type === 'checkbox'
        ? checked
        : value,
    }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    setSubmitting(true)
    setErrors({})

    const formData = new FormData()

    formData.append(
      'organization_id',
      form.organization_id,
    )

    formData.append(
      'title',
      form.title,
    )

    formData.append(
      'slug',
      form.slug,
    )

    formData.append(
      'short_description',
      form.short_description,
    )

    formData.append(
      'description',
      form.description,
    )

    if (form.starts_at) {
      formData.append(
        'starts_at',
        new Date(form.starts_at).toISOString(),
      )
    }

    if (form.ends_at) {
      formData.append(
        'ends_at',
        form.ends_at ? new Date(form.ends_at).toISOString() : '',
      )
    }

    formData.append(
      'location_name',
      form.location_name,
    )

    formData.append(
      'address',
      form.address,
    )

    formData.append(
      'visibility',
      form.visibility,
    )


    formData.append(
      'status',
      form.status,
  )


    formData.append(
      'registration_enabled',
      String(form.registration_enabled),
    )

    if (form.cover_image) {
      formData.append(
        'cover_image',
        form.cover_image,
      )
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      setErrors(
        typeof error === 'object' && error !== null
          ? error
          : {
              detail: 'Не удалось сохранить мероприятие.',
            },
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form
      className="event-builder"
      onSubmit={handleSubmit}
    >
      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            ОСНОВНАЯ ИНФОРМАЦИЯ
          </p>

          <h2>
            Расскажите о мероприятии
          </h2>

          <p>
            Эта информация будет отображаться
            на странице события.
          </p>
        </div>

        <div className="event-builder__fields">
          <label className="form-field">
            <span>Организатор *</span>

            <select
              name="organization_id"
              value={form.organization_id}
              onChange={handleChange}
              required
            >
              {memberships.map((membership) => (
                <option
                  key={membership.organization.id}
                  value={membership.organization.id}
                >
                  {membership.organization.name}
                </option>
              ))}
            </select>

            {getErrorMessage(
              errors,
              'organization_id',
            ) && (
              <span className="form-error">
                {getErrorMessage(
                  errors,
                  'organization_id',
                )}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Название *</span>

            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Например: IT ФОРУМ 2026"
              required
            />

            {getErrorMessage(errors, 'title') && (
              <span className="form-error">
                {getErrorMessage(errors, 'title')}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Slug *</span>

            <input
              type="text"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="it-forum-2026"
              required
            />

            <span className="form-hint">
              Используется в публичном URL:
              /events/it-forum-2026
            </span>

            {getErrorMessage(errors, 'slug') && (
              <span className="form-error">
                {getErrorMessage(errors, 'slug')}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Краткое описание *</span>

            <textarea
              name="short_description"
              value={form.short_description}
              onChange={handleChange}
              placeholder="Коротко опишите событие"
              rows="3"
              required
            />

            {getErrorMessage(
              errors,
              'short_description',
            ) && (
              <span className="form-error">
                {getErrorMessage(
                  errors,
                  'short_description',
                )}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Полное описание</span>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Программа, формат, особенности мероприятия..."
              rows="8"
            />
          </label>
        </div>
      </section>

      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            ДАТА И ВРЕМЯ
          </p>

          <h2>
            Когда состоится событие
          </h2>
        </div>

        <div className="event-builder__fields event-builder__fields--two">
          <label className="form-field">
            <span>Начало *</span>

            <input
              type="datetime-local"
              name="starts_at"
              value={form.starts_at}
              onChange={handleChange}
              required
            />

            {getErrorMessage(
              errors,
              'starts_at',
            ) && (
              <span className="form-error">
                {getErrorMessage(
                  errors,
                  'starts_at',
                )}
              </span>
            )}
          </label>

          <label className="form-field">
            <span>Окончание</span>

            <input
              type="datetime-local"
              name="ends_at"
              value={form.ends_at}
              onChange={handleChange}
            />

            {getErrorMessage(
              errors,
              'ends_at',
            ) && (
              <span className="form-error">
                {getErrorMessage(
                  errors,
                  'ends_at',
                )}
              </span>
            )}
          </label>
        </div>

        {getErrorMessage(
          errors,
          'non_field_errors',
        ) && (
          <div className="form-error">
            {getErrorMessage(
              errors,
              'non_field_errors',
            )}
          </div>
        )}
      </section>

      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            МЕСТО
          </p>

          <h2>
            Где проходит мероприятие
          </h2>
        </div>

        <div className="event-builder__fields">
          <label className="form-field">
            <span>Площадка</span>

            <input
              type="text"
              name="location_name"
              value={form.location_name}
              onChange={handleChange}
              placeholder="Например: Конгресс-холл"
            />
          </label>

          <label className="form-field">
            <span>Адрес</span>

            <input
              type="text"
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Город, улица, дом"
            />
          </label>
        </div>
      </section>

      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            ОБЛОЖКА
          </p>

          <h2>
            Изображение мероприятия
          </h2>

          <p>
            Для текущего дизайна рекомендуемый
            размер — 1920 × 1080 px.
          </p>
        </div>

        <div className="event-builder__fields">
          <label className="form-field">
            <span>Файл изображения</span>

          {initialValues?.cover_image && (
            <div className="event-builder__current-cover">
              <img
                src={initialValues.cover_image}
                alt={initialValues.title}
              />

              <span>
                Текущая обложка
              </span>
            </div>
          )}

            <input
              type="file"
              name="cover_image"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleChange}
            />

            {form.cover_image && (
              <span className="form-hint">
                Выбран файл: {form.cover_image.name}
              </span>
            )}

            {getErrorMessage(
              errors,
              'cover_image',
            ) && (
              <span className="form-error">
                {getErrorMessage(
                  errors,
                  'cover_image',
                )}
              </span>
            )}
          </label>
        </div>
      </section>

      
      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            ПУБЛИКАЦИЯ
          </p>

          <h2>
            Статус мероприятия
          </h2>

          <p>
            Черновик виден только организатору.
            Опубликованное мероприятие становится
            доступно согласно настройкам видимости.
          </p>
        </div>

        <div className="visibility-options">
          <label className="visibility-option">
            <input
              type="radio"
              name="status"
              value="draft"
              checked={form.status === 'draft'}
              onChange={handleChange}
            />

            <div>
              <strong>
                Черновик
              </strong>

              <span>
                Мероприятие ещё не доступно посетителям.
              </span>
            </div>
          </label>

          <label className="visibility-option">
            <input
              type="radio"
              name="status"
              value="published"
              checked={form.status === 'published'}
              onChange={handleChange}
            />

            <div>
              <strong>
                Опубликовано
              </strong>

              <span>
                Мероприятие доступно согласно
                выбранной видимости.
              </span>
            </div>
          </label>
        </div>

        {getErrorMessage(
          errors,
          'status',
        ) && (
          <span className="form-error">
            {getErrorMessage(
              errors,
              'status',
            )}
          </span>
        )}
      </section>

      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            ДОСТУП
          </p>

          <h2>
            Кто сможет увидеть событие
          </h2>
        </div>

        <div className="visibility-options">
          <label className="visibility-option">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={form.visibility === 'public'}
              onChange={handleChange}
            />

            <div>
              <strong>
                Публичное
              </strong>

              <span>
                Отображается в общей афише
                и доступно по ссылке.
              </span>
            </div>
          </label>

          <label className="visibility-option">
            <input
              type="radio"
              name="visibility"
              value="unlisted"
              checked={form.visibility === 'unlisted'}
              onChange={handleChange}
            />

            <div>
              <strong>
                По ссылке
              </strong>

              <span>
                Не отображается в афише,
                но доступно по прямой ссылке.
              </span>
            </div>
          </label>

          <label className="visibility-option">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={form.visibility === 'private'}
              onChange={handleChange}
            />

            <div>
              <strong>
                Приватное
              </strong>

              <span>
                Доступно только организатору.
              </span>
            </div>
          </label>
        </div>

        {getErrorMessage(
          errors,
          'visibility',
        ) && (
          <span className="form-error">
            {getErrorMessage(
              errors,
              'visibility',
            )}
          </span>
        )}
      </section>

      <section className="event-builder__section">
        <div className="event-builder__section-heading">
          <p className="eyebrow">
            РЕГИСТРАЦИЯ
          </p>

          <h2>
            Приём участников
          </h2>
        </div>

        <label className="toggle-field">
          <input
            type="checkbox"
            name="registration_enabled"
            checked={form.registration_enabled}
            onChange={handleChange}
          />

          <div>
            <strong>
              Регистрация включена
            </strong>

            <span>
              Посетители смогут заполнить
              регистрационную форму.
            </span>
          </div>
        </label>
      </section>

      {errors.detail && (
        <div className="event-builder__error">
          {getErrorMessage(errors, 'detail')}
        </div>
      )}

      <div className="event-builder__actions">
        <button
          type="submit"
          className="button button--primary"
          disabled={submitting}
        >
          {submitting
            ? 'Сохраняем...'
            : submitLabel}
        </button>
      </div>
    </form>
  )
}


export default EventForm