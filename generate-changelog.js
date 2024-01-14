// generate-changelog.js
const fs = require('fs');
const conventionalChangelog = require('conventional-changelog');

conventionalChangelog({
  preset: 'angular', // Use the preset that matches your commit message convention
  releaseCount: 0, // Generate the changelog for all releases
}).pipe(fs.createWriteStream('CHANGELOG.md'));
