import fs from 'fs'
import path from 'path'

interface Version {
  version: string
  label: string
  path: string
  archived: boolean
  archiveUrl?: string
}

interface VersionsConfig {
  current: string
  versions: Version[]
}

export function archiveVersion(version: string, archiveUrl?: string) {
  const versionsPath = path.join(process.cwd(), '.vitepress/versions.json')
  const versions: VersionsConfig = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
  
  const versionIndex = versions.versions.findIndex(v => v.version === version)
  if (versionIndex === -1) {
    throw new Error(`Version ${version} not found`)
  }
  
  versions.versions[versionIndex].archived = true
  if (archiveUrl) {
    versions.versions[versionIndex].archiveUrl = archiveUrl
  }
  
  fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2))
  console.log(`Version ${version} archived successfully`)
}

export function addVersion(version: string, isCurrent = false) {
  const versionsPath = path.join(process.cwd(), '.vitepress/versions.json')
  const versions: VersionsConfig = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
  
  if (isCurrent) {
    // Mark previous current as archived
    const currentVersion = versions.versions.find(v => v.label.includes('current'))
    if (currentVersion) {
      currentVersion.archived = true
      currentVersion.label = currentVersion.label.replace(' (current)', '')
    }
    
    versions.current = version
  }
  
  const newVersion: Version = {
    version,
    label: isCurrent ? `v${version} (current)` : `v${version}`,
    path: isCurrent ? '/' : `/v${version}/`,
    archived: false
  }
  
  versions.versions.unshift(newVersion)
  
  fs.writeFileSync(versionsPath, JSON.stringify(versions, null, 2))
  console.log(`Version ${version} added successfully`)
}

export function listVersions() {
  const versionsPath = path.join(process.cwd(), '.vitepress/versions.json')
  const versions: VersionsConfig = JSON.parse(fs.readFileSync(versionsPath, 'utf-8'))
  
  console.log('Current version:', versions.current)
  console.log('All versions:')
  versions.versions.forEach(v => {
    console.log(`  ${v.label} - ${v.archived ? 'archived' : 'active'}`)
  })
}