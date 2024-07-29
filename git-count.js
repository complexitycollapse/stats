import { exec } from 'child_process';

export async function countCommits(repoPath = ".") {
  try {
    const commitCount = await getCommitCount(repoPath);
    return commitCount;
  }
  catch (error) {
    console.error(error.message);
  }
}

function getCommitCount(repoPath) {
  return new Promise((resolve, reject) => {
    const gitDir = `${repoPath}/.git`;
    const workTree = repoPath;
    const command = `git --git-dir=${gitDir} --work-tree=${workTree} log --oneline`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(new Error(`Error executing command: ${error.message}`));
        return;
      }
      if (stderr) {
        reject(new Error(`Error in output: ${stderr}`));
        return;
      }
      
      resolve (stdout.trim().split(/\r\n|\r|\n/).length);
    });
  });
}
