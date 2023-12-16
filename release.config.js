// test test test
// test2 test2 test2
const commitAnalyzerPlugin = [
  '@semantic-release/commit-analyzer',
  {
    preset: 'angular',
    releaseRules: [
      { type: 'docs', scope: 'readme', release: 'patch' },
      { type: 'refactor', release: 'patch' },
      { type: 'style', release: 'patch' },
      { type: 'build', release: 'patch' },
      { type: 'foo', release: 'patch' }
    ],
    parserOpts: {
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
    },
  },
];

// Custom writer options for the release notes and changelog
const customWriterOpts = {
  transform: (commit, context) => {
    const issues = []

    const allowedCommitTypes = {
      'feat': 'Features',
      'fix': 'Bug Fixes',
      'perf': 'Performance Improvements',
      'revert': 'Reverts',
      'docs': 'Documentation',
      'style': 'Styles',
      'refactor': 'Code Refactoring',
      'test': 'Tests',
      'build': 'Build System',
      'ci': 'Continuous Integration'
    };

    commit.notes.forEach(note => { note.title = 'BREAKING CHANGES' })

    if (allowedCommitTypes[commit.type]) {
      commit.type = allowedCommitTypes[commit.type];
    } else {
      return;
    }

    if (commit.scope === '*') {
      commit.scope = ''
    }

    if (typeof commit.hash === 'string') {
      commit.shortHash = commit.hash.substring(0, 7)
    }

    if (typeof commit.subject === 'string') {
      let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;

      if (url) {
        url = `${url}/issues/`
        // Issue URLs.
        commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
          issues.push(issue)
          return `[#${issue}](${url}${issue})`
        })
      }

      if (context.host) {
        // User URLs.
        commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, username) => {
          if (username.includes('/')) {
            return `@${username}`
          }

          return `[@${username}](${context.host}/${username})`
        })
      }
    }

    // remove references that already appear in the subject
    commit.references = commit.references.filter(reference => {
      if (issues.indexOf(reference.issue) === -1) {
        return true
      }

      return false
    })

    return commit
  },
};

module.exports = {
  preset: 'angular',
  branches: ['main'],
  plugins: [
    commitAnalyzerPlugin,
    [
      '@semantic-release/release-notes-generator',
      {
        writerOpts: customWriterOpts,
      }
    ],
    [
      '@semantic-release/changelog',
      {
        changelogFile: 'CHANGELOG.md',
        writerOpts: customWriterOpts,
      },
    ],
    [
      '@semantic-release/git',
      {
        assets: ['CHANGELOG.md'],
      },
    ],
    '@semantic-release/github',
  ],
};
