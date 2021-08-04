const fs = require('fs')
const path = require('path')

const root = fs.realpathSync(process.cwd())
const src = path.resolve(root, 'src')

module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./jest.setup-file.js'],
    moduleNameMapper: {
      '@enums/(.*)$': path.resolve(src, 'enums/$1'),
      '@functions/(.*)$': path.resolve(src, 'functions/$1'),
      '@libs/(.*)$': path.resolve(src, 'libs/$1'),
      '@models/(.*)$': path.resolve(src, 'models/$1'),
      '@services/(.*)$': path.resolve(src, 'services/$1'),
    }
  }
