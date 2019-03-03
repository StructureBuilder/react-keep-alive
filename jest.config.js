module.exports = {
  preset: 'ts-jest',
  verbose: true,
  testPathIgnorePatterns: [
    '/node/modules',
  ],
  setupFiles: [
    '<rootDir>/test/setup.js',
  ],
  transform: {
    "^.+\\.js$": "babel-jest",
    ".(ts|tsx)": "ts-jest",
  },
  collectCoverage: true,
  coverageDirectory: './coverage',
};
