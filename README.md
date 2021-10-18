# Auto PR Fork

A github action to automatically create PR from a fork to the upstream

### Table of Contents

- [Usage](#usage)
- [Usage for multiple forks](#usage-for-multiple-forks)
- [Inputs](#inputs)
    - [GITHUB_TOKEN](#github_token)
    - [AUTO_PR_SETTINGS](#AUTO_PR_SETTINGS)
      - [branchFork](#branch-fork)
      - [branchUpstream](#branch-upstream)
      - [isDraft](#make-pr-draft)
      - [title](#title)
      - [description](#description)
- [Triggers](#triggers)
    - [push](#push)
    - [schedule](#schedule)

### Usage

```
steps:
  - uses: uknowwhoim/auto-pr-fork@v0.1
    env:
      GITHUB_TOKEN: ${{ secrets.AUTH_TOKEN }}
      AUTO_PR_SETTINGS: ${{ secrets.AUTO_PR_SETTINGS }}
```

### Usage for multiple forks

Handling multiple settings for different forks is tricky. To allow each fork to have its unique configuration, usage of [repository secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets) is recommended.

To allow certain forks to disable this workflow, add a condition to the workflow file, which skips the step if a certain repository secret is not set.


In this example this step would only be executed if the repository has a secret `ALLOW_AUTO_PR` and its truthy.
```
steps:
  - uses: uknowwhoim/auto-pr-fork@v0.1
    if: ${{ env.ALLOW }}
    env:
      GITHUB_TOKEN: ${{ secrets.AUTH_TOKEN }}
      AUTO_PR_SETTINGS: ${{ secrets.AUTO_PR_SETTINGS }}
      ALLOW: ${{ secrets.ALLOW_AUTO_PR }}
```

### Inputs

#### GITHUB_TOKEN

The authentication token of user creating the PR. This user must have write access to the fork. [How to create a token?](https://docs.github.com/en/authentication/keeping-your-account-and-data-secure/creating-a-personal-access-token)

This parameter must be passed to the environment and must be stored as a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets).

```
- uses: uknowwhoim/auto-pr-fork@main
  env:
    GITHUB_TOKEN: ${{ secrets.AUTH_TOKEN }}
```

#### AUTO_PR_SETTINGS

To provide more flexibility for forks, all settings are stored as json in the environment. You can do this by creating a [repository secret](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and storing the JSON string inside it. Load the secret into the environment variable `AUTO_PR_SETTINGS`.

The configurable settings are as follows

#### branchFork

The branch of the fork you want to merge into upstream.

Default is `main`

#### branchUpstream

The branch of the upstream, you want to to merge your fork into.

Default is `main`

#### isDraft

Make the PRs created by this repo draft by default(Public repos only)

Default is `false`

#### title

The title of PRs created by this action.

Default is `Catch up with <OWNER>/<REPO_NAME>`

#### description

The description of PRs created by this action.

### Triggers

#### Push

Create a pull request on push.

```
# Triggers on all branches
on: push

# Triggers on main branch push only
on: 
  push:
    branches:
      - main
```


#### Schedule

Schedule a pull request in a period of time repeatedly. Visit [crontab guru](https://crontab.guru/) to generate cron syntax.

```
on:
  schedule:
    # At 00:00 on every 3rd day-of-month
    - cron: '0 0 */3 * *'
```
