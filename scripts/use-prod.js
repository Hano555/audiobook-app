#!/usr/bin/env node
import { spawnSync } from 'child_process'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
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

const npmExecPath = process.env.npm_execpath
const npmCommand = npmExecPath ? process.execPath : process.platform === 'win32' ? 'npm.cmd' : 'npm'
const npmArgs = npmExecPath ? [npmExecPath, 'run', 'build'] : ['run', 'build']

const res = spawnSync(npmCommand, npmArgs, { stdio: 'inherit', cwd: root })
if (res.error) {
  console.error('Failed to start npm:', res.error)
  process.exit(1)
}
process.exit(res.status)
