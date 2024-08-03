import { countLines } from './count-lines.js';
import { countCommits } from './git-count.js';
import * as path from 'path';
import * as fs from 'fs';

async function doIt() {
  const projectPath = process.argv[2] ?? ".";
  const config = getConfig(projectPath);

  const nonTestResults
    = countLines(projectPath, config.includePatterns, config.excludePatterns.concat(config.testPatterns));
  const testResults
    = countLines(projectPath, config.testPatterns, config.excludePatterns);

  const commits = await countCommits(projectPath);

  console.log(`Commits: ${commits}`);
  console.log(`Tests: ${testResults.tests}`);
  console.log(`Code lines: ${nonTestResults.totalLines - nonTestResults.blankLines - nonTestResults.commentLines}`);
  console.log(`Test lines: ${testResults.totalLines - testResults.blankLines - testResults.commentLines}`);
  console.log(`Total lines: ${nonTestResults.totalLines + testResults.totalLines}`);
  console.log(`Blank lines: ${nonTestResults.blankLines + nonTestResults.blankLines}`);
  console.log(`Comment lines: ${nonTestResults.commentLines + nonTestResults.commentLines}`);
}

function getConfig(projectPath) {
  const config = {
    includePatterns: undefined,
    excludePatterns: undefined,
    testPatterns: undefined,
  };

  const filePath = path.join(projectPath, "stats.json");

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    config.includePatterns = json.include.map(pattern => new RegExp(pattern));
    config.excludePatterns = json.exclude.map(pattern => new RegExp(pattern));
    config.testPatterns = json.test.map(pattern => new RegExp(pattern));
  }

  config.includePatterns = config.includePatterns ?? [/\.js$/, /\.jsx$/, /\.cjs$/, /\.mjs$/];
  config.excludePatterns = config.excludePatterns ?? [/node_modules/];
  config.testPatterns = config.testPatterns ?? [/\.test\.js$/];
  
  return config;
}

doIt("../db");
