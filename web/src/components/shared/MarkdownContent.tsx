import { Link, List, ListItem, Typography } from '@mui/material'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

type MarkdownContentProps = {
  content: string
}

export const MarkdownContent = ({ content }: MarkdownContentProps) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ children }) => (
          <Typography variant="h4" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h2: ({ children }) => (
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h3: ({ children }) => (
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h4: ({ children }) => (
          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h5: ({ children }) => (
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        h6: ({ children }) => (
          <Typography variant="body1" sx={{ fontWeight: 700 }}>
            {children}
          </Typography>
        ),
        p: ({ children }) => <Typography variant="body1">{children}</Typography>,
        a: ({ href, children }) => (
          <Link href={href} target="_blank" rel="noreferrer" underline="hover">
            {children}
          </Link>
        ),
        code: ({ children }) => (
          <Typography
            component="code"
            sx={{
              fontFamily: 'monospace',
              fontSize: '0.875em',
              px: 0.5,
              py: 0.125,
              borderRadius: 0.75,
              backgroundColor: 'action.hover',
            }}
          >
            {children}
          </Typography>
        ),
        ul: ({ children }) => (
          <List
            component="ul"
            disablePadding
            sx={{
              listStyleType: 'disc',
              pl: 3,
              '& .MuiListItem-root': {
                display: 'list-item',
                py: 0.25,
              },
            }}
          >
            {children}
          </List>
        ),
        ol: ({ children }) => (
          <List
            component="ol"
            disablePadding
            sx={{
              listStyleType: 'decimal',
              pl: 3,
              '& .MuiListItem-root': {
                display: 'list-item',
                py: 0.25,
              },
            }}
          >
            {children}
          </List>
        ),
        li: ({ children }) => <ListItem disablePadding>{children}</ListItem>,
      }}
    >
      {content}
    </ReactMarkdown>
  )
}
