const { warn, fail, danger } = require('danger');
const fs = require('fs');

const jsModifiedFiles = danger.git.modified_files.filter(
  path => path.startsWith('src') && path.endsWith('js')
);

const jsTestChanges = jsModifiedFiles.filter(filepath =>
  filepath.endsWith('test.js')
);

const hasTestChanges = jsTestChanges.length > 0;
const hasLibChanges =
  jsModifiedFiles.filter(filepath => !filepath.endsWith('test.js')).length > 0;

// Warn when there is a big PR
const bigPRThreshold = 500;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  warn(
    ':exclamation: Big PR! If your PR contains multiple changes, splitting each into a separate PR will help faster, easier review.'
  );
}

// Warn if there are component changes, but not tests
if (hasLibChanges && !hasTestChanges) {
  warn(
    `You've made changes to one or more library files and you have not added any tests. That's OK as long as you're refactoring existing code.`
  );
}

// Be careful of leaving testing shortcuts in the codebase
jsTestChanges.forEach(file => {
  const content = fs.readFileSync(file).toString();
  if (
    content.includes('it.only') ||
    content.includes('describe.only') ||
    content.includes('test.only')
  ) {
    fail(`An \`only\` was left in tests (${file})`);
  }

  if (
    content.includes('it.skip') ||
    content.includes('describe.skip') ||
    content.includes('test.skip')
  ) {
    fail(`A \`skip\` was left in tests (${file})`);
  }
});
