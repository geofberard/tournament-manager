import { renderHook, act } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import type { ReactNode } from 'react'
import { describe, expect, it } from 'vitest'
import { AlertProvider } from '../app/AlertProvider'
import { useAlert } from './useAlert'

const wrapper = ({ children }: { children: ReactNode }) => (
  <ThemeProvider theme={createTheme()}>
    <AlertProvider>{children}</AlertProvider>
  </ThemeProvider>
)

describe('useAlert', () => {
  it('should throw when used outside AlertProvider', () => {
    expect(() => renderHook(() => useAlert())).toThrow(
      'useAlert doit être utilisé à l\'intérieur d\'un AlertProvider',
    )
  })

  it('should provide showAlert from AlertProvider', () => {
    const { result } = renderHook(() => useAlert(), { wrapper })

    expect(result.current.showAlert).toBeInstanceOf(Function)

    act(() => {
      result.current.showAlert('Test message', 'info')
    })

    expect(result.current.showAlert).toBeInstanceOf(Function)
  })
})
