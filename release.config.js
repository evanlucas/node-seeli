'use strict'

const now = new Date()
const year = now.getFullYear()
const day = lpad(now.getDate())
const month = lpad(now.getMonth() + 1)

function lpad(num, digits = 2) {
  let res = String(num)
  while (res.length < digits) {
    res = `0${res}`
  }
  return res
}

const COMMIT_TYPES = new Map([
  ['build', 'Build System']
, ['ci', 'Continuous Integration']
, ['chore', 'Chores']
, ['default', 'Miscellaneous']
, ['dep', 'Dependancies']
, ['doc', 'Documentation']
, ['feat', 'Features']
, ['fix', 'Bug Fixes']
, ['lint', 'Lint']
, ['perf', 'Performance Improvements']
, ['revert', 'Reverts']
, ['refactor', 'Code Refactoring']
, ['style', 'Style']
, ['test', 'Tests']
])

function typeOf(type) {
  return COMMIT_TYPES.get(type) || COMMIT_TYPES.get('default')
}

function transform(commit) {
  commit.type = typeOf(commit.type)
  commit.shortHash = commit.hash.substring(0, 7)
  return commit
}

module.exports = {
  branches: [
    'master'
  ]
, plugins: [
    ['@semantic-release/commit-analyzer', {
      parserOpts: {
        noteKeywords: ['BREAKING', 'BREAKING CHANGE', 'BREAKING CHANGES']
      , referenceActions: [
          'close', 'closes', 'closed'
        , 'fix', 'fixes', 'fixed'
        , 'resolve', 'resolves', 'resolved'
        ]
      }
    , writerOpts: {transform}
    , releaseRules: [
        {type: 'build', release: 'patch'}
      , {type: 'doc', release: 'patch'}
      , {type: 'chore', release: 'patch'}
      , {type: 'ci', release: 'patch'}
      , {type: 'lib', release: 'patch'}
      , {type: 'perf', release: 'minor'}
      , {type: 'refactor', release: 'patch'}
      , {type: 'release', release: 'patch'}
      , {type: 'test', release: 'patch'}
      , {type: 'fix', release: 'patch'}
      ]
    }],
  , ['@semantic-release/release-notes-generator', null]
  , ['@semantic-release/changelog', {
      changelogTitle: '# Changlog'
    , changelogFile: 'CHANGELOG.md'
    }]
  , ['@semantic-release/npm', null]
  , ['@semantic-release/git', {
      assets: ['package.json', 'package-lock.json', 'CHANGELOG.md']
    , message: `chore(release): ${year}-${month}-${day}, Version <%= nextRelease.version %> [skip ci]`
    }]
  , ['@semantic-release/github', null]
  ]
}
