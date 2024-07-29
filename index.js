import { countLines } from './count-lines.js';
import { countCommits } from './git-count.js';
import * as path from 'path';
import * as fs from 'fs';

async function doIt() {
  const projectPath = process.argv[2] ?? ".";
  const config = getConfig(projectPath);

  const { totalLines, blankLines, commentLines } = countLines(projectPath, config);
  const commits = await countCommits(projectPath);

  console.log(`Commits: ${commits}`);
  console.log(`Code lines: ${totalLines - blankLines - commentLines}`);
  console.log(`Total lines: ${totalLines}`);
  console.log(`Blank lines: ${blankLines}`);
  console.log(`Comment lines: ${commentLines}`);
}

function getConfig(projectPath) {
  const config = {
    includePatterns: undefined,
    excludePatterns: undefined
  };

  const filePath = path.join(projectPath, "stats.json");

  if (fs.existsSync(filePath)) {
    const data = fs.readFileSync(filePath, 'utf-8');
    const json = JSON.parse(data);
    config.includePatterns = json.include.map(pattern => new RegExp(pattern));
    config.excludePatterns = json.exclude.map(pattern => new RegExp(pattern));
  }

  config.includePatterns = config.includePatterns ?? [/\.js$/, /\.jsx$/, /\.cjs$/, /\.mjs$/];
  config.excludePatterns = config.excludePatterns ?? [/node_modules/, /\.test.js$/];
  
  return config;
}

doIt("../db");
