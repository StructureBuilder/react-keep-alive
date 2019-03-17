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
  testURL: 'http://localhost:3002/',
  collectCoverage: true,
  coverageDirectory: './coverage',
};
