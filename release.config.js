const commitAnalyzerPlugin = [
  '@semantic-release/commit-analyzer',
  {
    preset: 'angular',
    releaseRules: [
      { type: 'docs', scope: 'readme', release: 'patch' },
      { type: 'refactor', release: 'patch' },
      { type: 'style', release: 'patch' },
      { type: 'build', release: 'patch' },
    ],
    parserOpts: {
      noteKeywords: ['BREAKING CHANGE', 'BREAKING CHANGES'],
    },
  },
];


const clearReleaseNumber = {
  success: async (pluginConfig, context) => {
    if (context.nextRelease && context.nextRelease.version) {
      context.logger.log(`::VERSION::${context.nextRelease.version}`);
    }
  },
  verifyRelease: async (pluginConfig, context) => {
    if (context.options.dryRun) {
      if (context.nextRelease && context.nextRelease.version) {
        context.logger.log(`::VERSION::${context.nextRelease.version}`);
      } else {
        context.logger.log('NO NEW RELEASE!');
      }
    }
  },
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
    clearReleaseNumber,
  ],
};
