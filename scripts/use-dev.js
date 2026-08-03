#!/usr/bin/env node
const { spawn } = require('child_process')
const fs = require('fs')
const path = require('path')

const root = path.resolve(__dirname, '..')
const manifest = path.join(root, 'public', 'build', 'manifest.json')

if (fs.existsSync(manifest)) {
  try {
    fs.unlinkSync(manifest)
    console.log('Removed public/build/manifest.json to prefer dev server')
  } catch (e) {
    console.error('Failed to remove manifest:', e)
  }
} else {
  console.log('No production manifest found; starting dev server')
}

const child = spawn('npm', ['run', 'dev'], { stdio: 'inherit', cwd: root })
child.on('exit', (code) => process.exit(code))
