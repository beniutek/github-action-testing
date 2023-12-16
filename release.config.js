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
    const issues = [];

    // Custom handling for 'build' type commits
    if (commit.type === 'build') {
      commit.type = 'Build';
    }

    if (commit.type === 'feat') {
      commit.type = 'Features';
    } else if (commit.type === 'fix') {
      commit.type = 'Bug Fixes';
    } else if (commit.type === 'perf') {
      commit.type = 'Performance Improvements';
    } else if (commit.type === 'revert') {
      commit.type = 'Reverts';
    } else if (!commit.type || commit.type === 'chore') {
      // Any other type of commit is ignored
      return;
    }

    if (commit.scope === '*') {
      commit.scope = '';
    }

    if (typeof commit.hash === 'string') {
      commit.shortHash = commit.hash.substring(0, 7);
    }

    if (typeof commit.subject === 'string') {
      let url = context.repository ? `${context.host}/${context.owner}/${context.repository}` : context.repoUrl;
      if (url) {
        url = `${url}/issues/`;
        // Issue URLs.
        commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
          issues.push(issue);
          return `[#${issue}](${url}${issue})`;
        });
      }
    }

    // Remove references that already appear in the subject
    commit.references = commit.references.filter(reference => {
      if (issues.indexOf(reference.issue) === -1) {
        return true;
      }

      return false;
    });

    return commit;
  }
};

module.exports = {
  preset: 'angular',
  branches: ['main'],
  plugins: [
    commitAnalyzerPlugin,
    '@semantic-release/release-notes-generator',
    [
      '@semantic-release/changelog',
      {
        preset: "angular",
        changelogFile: 'CHANGELOG.md',
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
