export async function getCurrentUser() {
  const response = await fetch('/api/me/')

  if (!response.ok) {
    throw new Error(
      `Не удалось получить пользователя: ${response.status}`
    )
  }

  return response.json()
}


export async function getOrganizerEvents() {
  const response = await fetch('/api/events/')

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить мероприятия: ${response.status}`
    )
  }

  return response.json()
}


export async function getOrganizerEvent(eventId) {
  const response = await fetch(
    `/api/events/${eventId}/`
  )

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить мероприятие: ${response.status}`
    )
  }

  return response.json()
}


export async function getEventRegistrations(eventId) {
  const response = await fetch(
    `/api/events/${eventId}/registrations/`
  )

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить участников: ${response.status}`
    )
  }

  return response.json()
}


export async function getEventStats(eventId) {
  const response = await fetch(
    `/api/events/${eventId}/stats/`
  )

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить статистику: ${response.status}`
    )
  }

  return response.json()
}


export async function getCsrfToken() {
  const response = await fetch('/api/csrf/')

  if (!response.ok) {
    throw new Error(
      `Не удалось получить CSRF token: ${response.status}`
    )
  }

  const data = await response.json()

  return data.csrfToken
}

export async function createEvent(formData) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    '/api/events/',
    {
      method: 'POST',

      headers: {
        'X-CSRFToken': csrfToken,
      },

      body: formData,
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}


export async function updateEvent(eventId, formData) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    `/api/events/${eventId}/`,
    {
      method: 'PATCH',

      headers: {
        'X-CSRFToken': csrfToken,
      },

      body: formData,
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}


export async function registerOrganizer(data) {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    '/api/auth/register/',
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
      },

      body: JSON.stringify(data),
    },
  )

  const responseData =
    await response.json()

  if (!response.ok) {
    throw responseData
  }

  return responseData
}


export async function logoutOrganizer() {
  const csrfToken = await getCsrfToken()

  const response = await fetch(
    '/api/auth/logout/',
    {
      method: 'POST',

      headers: {
        'X-CSRFToken': csrfToken,
      },
    },
  )

  if (!response.ok) {
    throw new Error(
      `Не удалось выйти: ${response.status}`
    )
  }
}