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