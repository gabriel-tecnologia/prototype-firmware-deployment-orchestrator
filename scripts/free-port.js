#!/usr/bin/env node
/**
 * Finds and kills any process listening on the target port before the server starts.
 * Uses /proc/net/tcp6 and /proc/<pid>/fd — works without lsof or fuser.
 */

const fs = require('fs');
const path = require('path');

const PORT = parseInt(process.env.PORT || '3000', 10);
const hexPort = PORT.toString(16).toUpperCase().padStart(4, '0');

function findInode() {
  for (const file of ['/proc/net/tcp6', '/proc/net/tcp']) {
    try {
      const lines = fs.readFileSync(file, 'utf8').split('\n').slice(1);
      for (const line of lines) {
        const parts = line.trim().split(/\s+/);
        if (!parts[1]) continue;
        const listenPort = parts[1].split(':').pop();
        if (listenPort === hexPort) return parseInt(parts[9], 10);
      }
    } catch {}
  }
  return null;
}

function findAndKill(inode) {
  for (const pid of fs.readdirSync('/proc')) {
    if (!/^\d+$/.test(pid)) continue;
    const fdDir = path.join('/proc', pid, 'fd');
    try {
      for (const fd of fs.readdirSync(fdDir)) {
        try {
          const target = fs.readlinkSync(path.join(fdDir, fd));
          if (target === `socket:[${inode}]`) {
            process.kill(parseInt(pid, 10), 'SIGKILL');
            console.log(`[free-port] Killed process ${pid} holding port ${PORT}`);
            return;
          }
        } catch {}
      }
    } catch {}
  }
}

const inode = findInode();
if (inode) findAndKill(inode);
