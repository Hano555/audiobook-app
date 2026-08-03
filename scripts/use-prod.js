#!/usr/bin/env node
const { spawnSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const hotFile = path.join(root, 'public', 'hot')

if (fs.existsSync(hotFile)) {
  try {
    fs.unlinkSync(hotFile)
    console.log('Removed public/hot')
  } catch (e) {
    console.error('Failed to remove public/hot:', e)
  }
} else {
  console.log('public/hot not found')
}

const res = spawnSync('npm', ['run', 'build'], { stdio: 'inherit', cwd: root })
process.exit(res.status)
