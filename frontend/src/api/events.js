export async function getPublicEvents() {
  const response = await fetch('/api/public/events/')

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить мероприятия: ${response.status}`
    )
  }

  return response.json()
}

export async function getPublicEvent(slug) {
  const response = await fetch(
    `/api/public/events/${slug}/`
  )

  if (!response.ok) {
    throw new Error(
      `Не удалось загрузить мероприятие: ${response.status}`
    )
  }

  return response.json()
}