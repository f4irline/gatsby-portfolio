# Dependency Update Automation Plan

**Status:** Approved for implementation on 2026-07-24.

## Confirmed decisions

- Automatically merge minor and patch dependency updates, including non-major
  security fixes, after the required checks pass.
- Keep major updates and all failing updates manual.
- Manage the active root npm project and GitHub Actions dependencies.
- Exclude the legacy `file-api/` project until it has its own CI gate or is
  removed.
- Run grouped update checks weekly on Monday mornings in the
  `Europe/Helsinki` timezone.
- Keep production deployment manual.

The default branch, branch rule, auto-merge setting, merge method, and workflow
token permissions still need to be verified in the live GitHub repository
during implementation. The plan below states the required values.

## Goal

Keep the active portfolio and its GitHub Actions dependencies reasonably current
with minimal manual work:

- check for updates every week;
- combine compatible minor and patch updates to limit pull-request noise;
- run the project's existing formatting, type, build, link, browser, and
  accessibility checks;
- merge eligible updates automatically only after the required checks pass; and
- leave major or failing updates open for manual review.

This plan does not add tests or change deployment behavior.

## Current state

- The active site is the npm project at the repository root, with
  `package.json` and `package-lock.json`.
- The supported runtime is recorded in `.nvmrc`, and `package.json` requires
  Node 24 or newer and npm 11 or newer.
- `.github/workflows/main.yml` already runs the `verify` job for pull requests
  into `master`. It installs with `npm ci`, then runs:
  - `npm run format:check`
  - `npm run check`
  - `npm run build`
  - `npm run test:links`
  - `npm test`
- Workflow actions are pinned to full commit SHAs, with version comments.
- `file-api/` is a legacy Yarn 1 project. It is excluded from formatting and the
  current CI workflow, and `README.md` says to retain it only until production
  verification is complete.

## Approved result

Use GitHub-native Dependabot rather than adding a separately hosted updater:

1. `.github/dependabot.yml` creates update pull requests for the root npm
   project and for GitHub Actions.
2. `.github/workflows/dependabot-automerge.yml` enables GitHub auto-merge for
   Dependabot minor and patch updates.
3. A GitHub branch rule for `master` requires the existing `verify` status
   check, so an eligible pull request cannot merge while CI is pending or
   failing.
4. Major updates remain normal pull requests and require a person to merge
   them.

Dependabot already applies a three-day cooldown to normal version updates by
default. Security updates are not delayed by that cooldown.

## Scope decisions

### Manage the active root project

Configure the npm ecosystem at `/`. Dependabot will update both `package.json`
and `package-lock.json`, and the existing `npm ci` check will reject an
inconsistent lockfile.

### Manage GitHub Actions

Configure the `github-actions` ecosystem at `/`. This covers workflow action
references under `.github/workflows/`, including actions pinned by commit SHA.
Continue the repository's current practice of pinning every action to a full
SHA and retaining a readable release comment.

The new `dependabot/fetch-metadata` action used by the auto-merge workflow must
also be pinned to a full SHA. Resolve the SHA for its current stable release
during implementation rather than copying a floating tag.

### Do not manage `file-api/` yet

Do not include `/file-api` in the first Dependabot configuration. Its dependency
updates would not be exercised by the existing `verify` job, so automatically
merging them would violate the “checks must pass” rule.

If `file-api/` is still needed after the portfolio migration is complete, add a
separate CI check for that directory before opting it into dependency updates.
Otherwise remove it according to the existing migration plan. Neither action is
part of this dependency-automation change.

## Implementation steps

### 1. Configure GitHub repository safeguards

Before enabling the merge workflow:

- Enable the dependency graph, Dependabot alerts, and Dependabot security
  updates in **Settings → Security → Advanced Security**.
- Enable pull-request auto-merge in **Settings → General → Pull Requests**.
- Add or update a branch protection rule or ruleset for `master`:
  - require changes to arrive through a pull request;
  - require the status check produced by the `verify` job in
    `Verify and deploy portfolio`;
  - optionally require the pull-request branch to be up to date before merging;
    and
  - do not allow the automation to bypass a failed or pending required check.
- Confirm that the repository permits the workflow's `GITHUB_TOKEN` to request
  `contents: write` and `pull-requests: write`. Keep all other permissions
  unset.
- Use GitHub's **Create a merge commit** strategy for this automation. Do not
  introduce a merge queue for this small repository; the built-in token cannot
  add a pull request to a merge queue.

If repository or organization policy prevents the built-in token from merging,
stop rather than weakening branch protection. The fallback is a narrowly
permissioned GitHub App token, but that adds credential management and should be
used only if the normal token cannot work.

### 2. Add the Dependabot configuration

Create `.github/dependabot.yml` with this intended shape:

```yaml
version: 2

updates:
  - package-ecosystem: npm
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "09:00"
      timezone: Europe/Helsinki
    open-pull-requests-limit: 5
    groups:
      npm-minor-and-patch:
        applies-to: version-updates
        patterns:
          - "*"
        update-types:
          - minor
          - patch

  - package-ecosystem: github-actions
    directory: /
    schedule:
      interval: weekly
      day: monday
      time: "09:30"
      timezone: Europe/Helsinki
    open-pull-requests-limit: 5
    groups:
      actions-minor-and-patch:
        applies-to: version-updates
        patterns:
          - "*"
        update-types:
          - minor
          - patch
```

Expected behavior:

- Minor and patch version updates are grouped once per ecosystem and can be
  auto-merged.
- Major updates do not match either group, so Dependabot opens individual pull
  requests for manual review.
- Security-update pull requests remain separate and immediate. Non-major
  security updates can follow the same auto-merge rule after CI passes; a major
  security update remains manual.
- The staggered schedule avoids starting the npm and Actions verification runs
  at exactly the same time.

Do not add `target-branch`; omitting it makes Dependabot use the repository's
default branch and preserves the expected behavior for security updates. Verify
that the GitHub default branch is `master` before merging the configuration.

### 3. Add the auto-merge workflow

Create `.github/workflows/dependabot-automerge.yml` based on GitHub's documented
Dependabot metadata and auto-merge pattern.

The workflow must:

- run on pull-request activity;
- request only `contents: write` and `pull-requests: write`;
- run the job only when:
  - the pull-request author is exactly `dependabot[bot]`;
  - the repository is exactly `f4irline/gatsby-portfolio`; and
  - the base branch is `master`;
- use `dependabot/fetch-metadata` pinned to a full commit SHA;
- enable auto-merge only when `update-type` is either
  `version-update:semver-patch` or `version-update:semver-minor`;
- run `gh pr merge --auto --merge` against the pull request's URL; and
- never check out or execute code from the pull request in this privileged job.

The workflow only requests auto-merge. The protected-branch rule remains the
authoritative gate that waits for `verify` and blocks a failing pull request.

Do not auto-approve pull requests. If repository policy requires an approving
review, leave that as an intentional manual gate rather than granting the bot a
second privilege.

### 4. Format and validate the files

On the implementation branch:

1. Run the existing formatter so both new YAML files follow repository style.
2. Run `npm run format:check`.
3. Run the complete existing local verification sequence, without adding new
   tests:
   - `npm run check`
   - `npm run build`
   - `npm run test:links`
   - install the Playwright Chromium browser if needed
   - `npm test`
4. Review the workflow permissions and conditions manually. In particular,
   confirm there is no pull-request checkout in the auto-merge workflow.
5. Open a normal pull request and confirm the `verify` check name shown by
   GitHub matches the check selected in the `master` branch rule.

### 5. Verify the automation on GitHub

After the configuration reaches the default branch:

1. Check the Dependabot page for a successful configuration run and no parsing
   or ecosystem errors.
2. Use the first non-major Dependabot pull request as an end-to-end test:
   - confirm it targets `master`;
   - confirm it changes only the expected manifest, lockfile, or action pins;
   - confirm `Verify and deploy portfolio / verify` runs;
   - confirm auto-merge is enabled but does not merge while `verify` is pending;
   - confirm it merges with a merge commit after `verify` succeeds.
3. Confirm a major-update pull request does not have auto-merge enabled.
4. If an update fails CI, leave it open for diagnosis or close/ignore that
   update. Do not add a bypass.
5. Confirm production deployment remains manual through the existing
   `workflow_dispatch` input.

## Acceptance criteria

- `.github/dependabot.yml` is accepted by GitHub and monitors root npm and
  GitHub Actions dependencies weekly.
- Minor and patch updates are grouped by ecosystem.
- A root dependency pull request runs every check already present in the
  `verify` job.
- Eligible Dependabot updates merge only after the required `verify` check
  succeeds.
- Major and failing updates never merge automatically.
- The auto-merge workflow grants only the two write permissions it needs and
  does not run pull-request code.
- `file-api/` is not included until it has an appropriate CI gate or is removed.
- No new test suite and no automatic production deployment are introduced.

## Rollback

If the automation is too noisy or merges an undesirable update:

1. Disable or remove `dependabot-automerge.yml` first. Dependabot can continue
   opening reviewable pull requests without merging them.
2. Revert the undesirable dependency update through a normal pull request.
3. Add a narrowly scoped Dependabot `ignore` rule only when a specific package
   or release line repeatedly causes trouble.
4. Keep the `master` required-status-check rule in place.

## References

- [About the Dependabot configuration file](https://docs.github.com/en/code-security/concepts/supply-chain-security/about-the-dependabot-yml-file)
- [Dependabot configuration options](https://docs.github.com/en/code-security/reference/supply-chain-security/dependabot-options-reference)
- [Keeping GitHub Actions up to date with Dependabot](https://docs.github.com/en/code-security/how-tos/secure-your-supply-chain/secure-your-dependencies/auto-update-actions)
- [Automating Dependabot with GitHub Actions](https://docs.github.com/en/code-security/tutorials/secure-your-dependencies/automate-dependabot-with-actions)
- [Managing protected branches](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)
- [Managing pull-request auto-merge](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/configuring-pull-request-merges/managing-auto-merge-for-pull-requests-in-your-repository)
