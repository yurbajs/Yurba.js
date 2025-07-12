#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function fixHtmlFiles(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixHtmlFiles(filePath);
    } else if (file.endsWith('.html')) {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Fix relative paths to work with file:// protocol
      content = content.replace(/href="assets\//g, 'href="./assets/');
      content = content.replace(/src="assets\//g, 'src="./assets/');
      content = content.replace(/href="\.\.\/assets\//g, 'href="../assets/');
      content = content.replace(/src="\.\.\/assets\//g, 'src="../assets/');
      
      fs.writeFileSync(filePath, content);
    }
  });
}

console.log('Fixing HTML file paths...');
fixHtmlFiles('./docs');
console.log('Done!');