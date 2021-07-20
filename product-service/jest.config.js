const fs = require('fs')
const path = require('path')

const root = fs.realpathSync(process.cwd())
const src = path.resolve(root, 'src')

module.exports = {
    testEnvironment: 'node',
    setupFiles: ['./jest.setup-file.js'],
    moduleNameMapper: {
      '@functions/(.*)$': path.resolve(src, 'functions/$1'),
      '@libs/(.*)$': path.resolve(src, 'libs/$1'),
    }
  }
