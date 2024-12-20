require('dotenv').config({ path: './.env.development' });

const createJestConfig = require('next/jest')({ dir: './' });

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
  testTimeout: 60 * 1000,
});

module.exports = jestConfig;
