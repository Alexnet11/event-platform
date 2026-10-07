export async function createRegistration(slug, registrationData) {
  const response = await fetch(
    `/api/public/events/${slug}/registrations/`,
    {
      method: 'POST',

      headers: {
        'Content-Type': 'application/json',
      },

      body: JSON.stringify(registrationData),
    },
  )

  const data = await response.json()

  if (!response.ok) {
    throw data
  }

  return data
}