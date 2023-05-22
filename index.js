import * as core from '@actions/core';
import * as github from '@actions/github';


async function main() {
  try {
    const [owner, repo] = core.getInput('REPOSITORY', { required: false }).split('/');
    const workflow_id = core.getInput('WORKFLOW_FILENAME', { required: true });
    const currently_running = (
      core.getInput('CURRENTLY_RUNNING', { required: false }).toLowerCase() === 'yes'
    );
    let per_page = 2;
    let index = 1;
    if (!currently_running) {
      per_page = 1;
      index = 0;
    }
    const token = core.getInput('TOKEN', { required: false });
    const octokit = github.getOctokit(token);
    const runs = await octokit.rest.actions.listWorkflowRuns({
      owner, repo, workflow_id, per_page
    });
    core.setOutput('result', runs.data.workflow_runs[index].conclusion);
  }
  catch (err) {
    core.setFailed(`Action failed with error: ${err}`);
    core.setOutput('result', null);
  }
}


main();
