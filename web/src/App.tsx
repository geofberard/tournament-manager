import { useEffect, useState } from 'react'
import './App.css'
import { listTeams, type Team } from './lib/apiClient'

function App() {
  const [teams, setTeams] = useState<Team[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const loadTeams = async () => {
      try {
        const loadedTeams = await listTeams()
        if (!isMounted) {
          return
        }

        setTeams(loadedTeams)
        setErrorMessage(null)
      } catch (error) {
        if (!isMounted) {
          return
        }

        const message =
          error instanceof Error
            ? error.message
            : 'Le chargement des equipes a echoue.'
        setErrorMessage(message)
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadTeams()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <main className="app-shell">
      <section className="hero-panel">
        <p className="eyebrow">Tournament Manager</p>
        <h1>Equipes du tournoi</h1>
        <p className="hero-copy">
          La liste ci-dessous est chargee via le client TypeScript genere a
          partir de l&apos;OpenAPI.
        </p>
      </section>

      <section className="teams-panel" aria-live="polite">
        {isLoading ? <p>Chargement des equipes...</p> : null}
        {errorMessage ? <p className="error-message">{errorMessage}</p> : null}

        {!isLoading && !errorMessage ? (
          <ul className="team-list">
            {teams.map((team) => (
              <li key={team.id} className="team-card">
                <span className="team-name">{team.name}</span>
                <code>{team.id}</code>
              </li>
            ))}
          </ul>
        ) : null}
      </section>
    </main>
  )
}

export default App
