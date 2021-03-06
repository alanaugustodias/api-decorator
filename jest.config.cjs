module.exports = {
    testEnvironment: 'node',
    roots: ['<rootDir>/dist'],
    transform: {
        '^.+\\.jsx?$': 'babel-jest'
    },
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80
        }
    },
    moduleFileExtensions: ['js', 'jsx', 'json', 'node'],
    coverageReporters: ['json', 'lcov', 'text', 'clover'],
    collectCoverageFrom: [
        'dist/**/*.{js,jsx}',
        '!dist/config/*.{js,jsx}',
        '!dist/**/index.{js,jsx}',
    ]
};
