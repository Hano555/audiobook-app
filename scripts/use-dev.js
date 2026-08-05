#!/usr/bin/env node
import { spawn } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const root = path.resolve(__dirname, '..')
const manifest = path.join(root, 'public', 'build', 'manifest.json')
const hotFile = path.join(root, 'public', 'hot')

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

try {
  fs.writeFileSync(hotFile, 'http://localhost:5173')
  console.log('Created public/hot for Vite dev server')
} catch (e) {
  console.error('Failed to create public/hot:', e)
}

const npmExecPath = process.env.npm_execpath
const npmCommand = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npmArgs = npmExecPath ? [npmExecPath, 'run', 'dev'] : ['run', 'dev']

const child = spawn(npmCommand, npmArgs, { stdio: 'inherit', cwd: root })
child.on('error', (error) => {
  console.error('Failed to start npm:', error)
  process.exit(1)
})
child.on('exit', (code) => process.exit(code))
