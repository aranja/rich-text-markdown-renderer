module.exports = {
  testPathIgnorePatterns: ['/dist/'],
  transform: {
    '^.+\\.tsx?$': 'ts-jest'
  },
  testMatch: ['**/*.test.[jt]s?(x)']
};
