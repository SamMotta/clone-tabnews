require('dotenv').config({ path: './.env.development' });

const createJestConfig = require('next/jest')({ dir: './' });

const jestConfig = createJestConfig({
  moduleDirectories: ['node_modules', '<rootDir>'],
});

module.exports = jestConfig;
