#!/bin/bash

if [[ "${CIRCLE_BRANCH}" == "master" ]]
then
  echo "Raising package version and updating CHANGELOG.md"

  git config --global push.default simple
  git config --global user.email "theo@suteki.nu"
  git config --global user.name "CircleCI Publisher"

  # Stash any prior changes to prevent merge conflicts
  git stash

  # Make sure to get the latest master (if there were any prior commits)
  git pull origin

  # Re-apply the stash
  git stash apply

  # Fails the build if any of the steps below fails
  set -e

  # Version bump package.json (package.json is committed by npm-version-git), stamp CHANGELOG.md
  yarn prepare-publish

  # Changelog is now stamped with the version / time info - add to git
  git add CHANGELOG.md

  # Amend the version commit with a ci skip so when we push the commits from the CI
  # The CI does not end up recursively building it

  # This gets the last commit log message
  LAST_COMMIT_MSG=`git log -1 --pretty=%B|tr -d '\r'`

  # Appending [skip ci] to the log message
  # Note: --amend does not trigger the pre-commit hooks
  git commit --amend -m "${LAST_COMMIT_MSG} [skip ci]"

  # Push the commits back to master and assign a versioned release tag
  git push && git push origin "v${LAST_COMMIT_MSG}"

  # Publish the package to npm
  echo "Publishing package"
  npm publish
else
  echo "Skipping - branch is not master"
fi
