# Contributing

Contributions are welcomed and encouraged!

Anyone that contributes useful code will be granted repo write access.

(This is so there isn't one maintainer of the project and new feature requests are not blocked by a sole maintainer.)

## Prepping your pull request

- Your PR should contain unit tests for any additions / fixes. PRs with failing tests will not be accepted (with exceptions).
- Your code should pass linting (runs part of tests).
- Do *not* version bump `package.json`.
- Use `npm run changelog:prepare` to stamp the `CHANGELOG.md` file. Add your release comments below the stamp.

You can now submit your PR.

## Once your pull request is approved

If this is your first time contributing (if you contributed code):

- You'll be given permission to merge your PR into master.

Once you have permissions:

- Do a squash merge on your PR and delete the branch (if applicable)
- The CI should test / build / publish the package to npm if the test + build passes
