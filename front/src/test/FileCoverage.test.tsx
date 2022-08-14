import { existsSync, readdirSync, statSync } from 'fs';

const sourceFileMatcher = /^.*\/[a-zA-Z]*\.ts[x]?$/

const exclusions: string[] = [
    "src/main.tsx",
    "src/data/Team.ts", //is a simple interface
    "src/test"
];

const flatMapDirectory: (directoryPath: string) => string[] = (directoryPath) =>
    readdirSync(directoryPath)
        .map(fileName => directoryPath + "/" + fileName)
        .filter(filePath => !exclusions.includes(filePath))
        .flatMap(filePath => {
            if (statSync(filePath).isDirectory()) {
                return flatMapDirectory(filePath);
            }

            return sourceFileMatcher.test(filePath) ? [filePath] : [];
        });

const getTestPath = (srcPath: string) => srcPath.replace(".ts", ".test.ts");

const getSrcFiles = () => {
    return flatMapDirectory('src');
}

describe('ensuring .ts and .tsx files have associated tests', () => {
    const srcFiles: string[] = getSrcFiles();

    it.each(srcFiles)
        ('should have test file for %p ', (srcPath: string) => {
            //Given
            const testPath = getTestPath(srcPath);

            // Then
            expect(existsSync(testPath)).toBe(true);
        })
})