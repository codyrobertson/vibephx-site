/**
 * Script to convert all logo.dev URLs to cached URLs
 * Run with: node scripts/convert-logos.js
 */

const fs = require('fs')
const path = require('path')

const STACK_DB_PATH = path.join(__dirname, '../lib/stackDatabase.ts')

function convertLogoUrl(url) {
  // Extract domain, size, and format from logo.dev URL
  const match = url.match(/https:\/\/img\.logo\.dev\/([^?]+)\?token=[^&]+&size=(\d+)&format=(\w+)/)
  
  if (match) {
    const [, domain, size, format] = match
    return `getCachedLogoUrl('${domain}', '${size}', '${format}')`
  }
  
  return url
}

function convertStackDatabase() {
  try {
    let content = fs.readFileSync(STACK_DB_PATH, 'utf8')
    
    // Find all logo URLs that match the logo.dev pattern
    const logoRegex = /logo:\s*'(https:\/\/img\.logo\.dev\/[^']+)',/g
    const matches = [...content.matchAll(logoRegex)]
    
    console.log(`Found ${matches.length} logo.dev URLs to convert`)
    
    let converted = 0
    
    // Replace each logo URL with cached version
    matches.forEach(([fullMatch, url]) => {
      const convertedUrl = convertLogoUrl(url)
      
      if (convertedUrl !== url) {
        const newLine = fullMatch.replace(`'${url}'`, convertedUrl)
        content = content.replace(fullMatch, newLine)
        converted++
        console.log(`✓ Converted: ${url.split('?')[0]} -> cached`)
      }
    })
    
    // Write the updated content back
    fs.writeFileSync(STACK_DB_PATH, content, 'utf8')
    
    console.log(`\n✅ Conversion complete: ${converted} URLs converted to cached versions`)
    console.log('📁 Updated file:', STACK_DB_PATH)
    
  } catch (error) {
    console.error('❌ Error converting logos:', error.message)
    process.exit(1)
  }
}

// Run the conversion
convertStackDatabase()