import * as fs from 'fs';
import * as path from 'path';

export function countLines(dir, includePatterns, excludePatterns) {

  let totalLines = 0;
  let blankLines = 0;
  let commentLines = 0;
  let tests = 0;
  const testRegex = /\b(test|it)\s*\(/g;

  function matchesAnyPattern(filePath, patterns) {
    return patterns.some(pattern => pattern.test(filePath));
  }

  function readDirRecursive(directory) {
    const files = fs.readdirSync(directory);

    files.forEach((file) => {
      const fullPath = path.join(directory, file);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        if (!matchesAnyPattern(fullPath, excludePatterns)) {
          readDirRecursive(fullPath);
        }
      } else {
        if (matchesAnyPattern(file, includePatterns) && !matchesAnyPattern(fullPath, excludePatterns)) {
          const fileContent = fs.readFileSync(fullPath, 'utf-8');
                    const lines = fileContent.split('\n');

          totalLines += lines.length;
          lines.forEach((line) => {
            const trimmedLine = line.trim();
            if (trimmedLine === '') {
              blankLines += 1;
            } else if (trimmedLine.startsWith('//') || trimmedLine.startsWith('/*')) {
              commentLines += 1;
            }
          });

          const matches = fileContent.match(testRegex);
          tests += (matches ? matches.length : 0);
        }
      }
    });
  }

  readDirRecursive(dir);
  return { totalLines, blankLines, commentLines, tests };
}
