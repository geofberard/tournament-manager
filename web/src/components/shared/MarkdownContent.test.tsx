import { cleanup, render, screen } from '@testing-library/react'
import { ThemeProvider, createTheme } from '@mui/material'
import { afterEach, describe, expect, it } from 'vitest'
import { MarkdownContent } from './MarkdownContent'

const renderMarkdown = (content: string) =>
  render(
    <ThemeProvider theme={createTheme()}>
      <MarkdownContent content={content} />
    </ThemeProvider>,
  )

describe('MarkdownContent', () => {
  afterEach(() => {
    cleanup()
  })

  it('should render headings, paragraphs and inline formatting', () => {
    renderMarkdown('# Titre\n\nTexte en **gras**, en *italique* et avec `code`.')

    expect(screen.getByText('Titre')).toBeInTheDocument()
    expect(screen.getByText('gras').tagName).toBe('STRONG')
    expect(screen.getByText('italique').tagName).toBe('EM')
    expect(screen.getByText('code').tagName).toBe('CODE')
  })

  it('should render ordered and unordered lists', () => {
    renderMarkdown('- Premier\n- Second\n\n1. Un\n2. Deux')

    expect(screen.getByText('Premier')).toBeInTheDocument()
    expect(screen.getByText('Second')).toBeInTheDocument()
    expect(screen.getByText('Un')).toBeInTheDocument()
    expect(screen.getByText('Deux')).toBeInTheDocument()
  })

  it('should render links', () => {
    renderMarkdown('[OpenAI](https://openai.com)')

    expect(screen.getByRole('link', { name: 'OpenAI' })).toHaveAttribute('href', 'https://openai.com')
  })
})
