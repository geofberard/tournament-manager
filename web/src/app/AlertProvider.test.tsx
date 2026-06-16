import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { describe, expect, it } from 'vitest'
import { AlertProvider } from './AlertProvider'
import { useAlert } from '../hooks/useAlert'

const renderWithProvider = (ui: React.ReactElement) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <AlertProvider>{ui}</AlertProvider>
    </ThemeProvider>,
  )

describe('AlertProvider', () => {
  it('should render children and show a snackbar when showAlert is called', async () => {
    const Consumer = () => {
      const { showAlert } = useAlert()
      return <button onClick={() => showAlert('Hello', 'success')}>Open</button>
    }

    renderWithProvider(<Consumer />)

    fireEvent.click(screen.getByRole('button', { name: 'Open' }))

    await waitFor(() => expect(screen.getByText('Hello')).toBeInTheDocument())
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
