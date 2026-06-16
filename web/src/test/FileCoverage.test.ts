import { existsSync, readdirSync, statSync } from 'node:fs'
import { dirname, join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const currentDirectory = dirname(fileURLToPath(import.meta.url))
const srcDirectory = join(currentDirectory, '..')

const includedDirectories = ['app', 'components', 'hooks', 'services', 'views']

const excludedFiles = new Set([
  'app/teamRoutes.ts',
  'components/shared/RankingTable.tsx',
  'components/shared/GameCard.tsx',
  'components/shared/GameList.tsx',
  'main.tsx',
  'services/apiClient.ts',
  'services/gamesService.ts',
  'services/statisticsService.ts',
  'services/teamsService.ts',
  'test/FileCoverage.test.ts',
  'test/setup.ts',
])

const sourceFilePattern = /\.(ts|tsx)$/
const testFilePattern = /\.test\.(ts|tsx)$/

const collectSourceFiles = (directoryPath: string): string[] =>
  readdirSync(directoryPath)
    .map((fileName) => join(directoryPath, fileName))
    .flatMap((filePath) => {
      if (statSync(filePath).isDirectory()) {
        return collectSourceFiles(filePath)
      }

      if (!sourceFilePattern.test(filePath) || testFilePattern.test(filePath)) {
        return []
      }

      return [filePath]
    })

const getMatchingTestCandidates = (sourcePath: string) => {
  const extension = sourcePath.endsWith('.tsx') ? '.tsx' : '.ts'
  const basePath = sourcePath.slice(0, -extension.length)

  return [`${basePath}.test${extension}`, `${basePath}.test.ts`, `${basePath}.test.tsx`]
}

const getFilesToCover = () =>
  includedDirectories
    .flatMap((directoryName) => collectSourceFiles(join(srcDirectory, directoryName)))
    .map((absolutePath) => relative(srcDirectory, absolutePath).replace(/\\/g, '/'))
    .filter((relativePath) => !excludedFiles.has(relativePath))
    .map((relativePath) => join(srcDirectory, relativePath))

describe('ensuring selected source files have associated tests', () => {
  const filesToCover = getFilesToCover()

  it.each(filesToCover)('should have a matching test file for %p', (sourcePath: string) => {
    // WHEN
    const matchingTestCandidates = getMatchingTestCandidates(sourcePath)
    const hasMatchingTest = matchingTestCandidates.some((testPath) => existsSync(testPath))

    // THEN
    expect(hasMatchingTest).toBe(true)
  })
})
