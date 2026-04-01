const suites = [
  require('./chat-utils.test'),
  require('./validation.test'),
];

let failureCount = 0;

const runTest = (name, callback) => {
  try {
    callback();
    console.log(`PASS ${name}`);
  } catch (error) {
    failureCount += 1;
    console.error(`FAIL ${name}`);
    console.error(error.stack || error.message || error);
  }
};

suites.forEach((suite) => suite(runTest));

if (failureCount > 0) {
  console.error(`\n${failureCount} test(s) failed.`);
  process.exit(1);
}

console.log('\nAll backend tests passed.');
