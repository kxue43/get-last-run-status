# Get Last Run Status

This is an action that gets the status of the last run of a certain GitHub Actions workflow by querying the GitHub REST
API. There is a single output, `result`, with the following possible values:

- `'success'`: if the last run succeeded.

- `'failure'`: if the last run failed.

- `'null'`: if this action of getting status failed.

Inputs are:

- `WORKFLOW_FILENAME`: This is the only required input. It must be the _exact_ name with extension of the workflow
  definition YAML file, e.g. `my-workflow.yml`.

- `REPOSITORY`: Repository name in the format `{owner}/{repo}`. Defaults to `github.repository`.

- `TOKEN`: Defaults to the automatic token `github.token`. If a classic PAT is used, it must have full `repo` scope.

- `CURRENTLY_RUNNING`: Whether the workflow whose last status is being queried is the same workflow that uses this
  custom action. If it is, this action takes the status of the _second last_ item returned by the GitHub API call
  (because the _last_ item is the current run and it has not finished yet). Otherwise it takes the status of
  the _last_ item. Defaults to `'YES'`.

This action requires the `actions: read` permission.

Example code:

```yaml
# Suppose this workflow's file name is get-last-run-status.yml
name: Get Last Run Status
on:
  workflow_dispatch:
    inputs:
      NAME:
        type: string
        description: full name of the workflow definition YAML file
jobs:
  job1:
    runs-on: ubuntu-latest
    permissions:
      actions: read
    steps:
      - uses: kxue43/get-last-run-status@v1
        id: last-status
        with:
          WORKFLOW_FILENAME: ${{ inputs.NAME }}
          # If inputs.NAME is NOT 'get-last-run-status.yml', the following input must be used.
          # CURRENTLY_RUNNING: 'NO'
      - run: echo ${{ steps.last-status.outputs.result }}
```
