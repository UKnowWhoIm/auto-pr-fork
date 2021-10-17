# Auto PR Fork

A github action to automatically create PR from a fork to the upstream

### Table of Contents

- [Usage](#usage)
- [Inputs](#inputs)
    - [GITHUB_TOKEN](#github_token)
    - [branch-fork](#branch-fork)
    - [branch-upstream](#branch-upstream)
    - [make-pr-draft](#make-pr-draft)
    - [title](#title)
    - [description](#description)
- [Triggers](#triggers)
    - [push](#push)
    - [schedule](#schedule)

### Usage

```
steps:
  - uses: uknowwhoim/auto-pr-fork@v0.1
    with:
      # Title of your PR
      title: "Catch Up PR"
    env:
      GITHUB_TOKEN: ${{ secrets.AUTH_TOKEN }}
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

#### branch-fork

The branch of the fork you want to merge into upstream.

Default is `main`

#### branch-upstream

The branch of the upstream, you want to to merge your fork into.

Default is `main`

#### make-pr-draft

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
