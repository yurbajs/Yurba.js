#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');

try {
  const output = execSync('pyspelling -c spellcheck.yaml --verbose', { encoding: 'utf8' });
  console.log('✅ No spelling errors found!');
} catch (error) {
  const output = error.stdout || error.message;
  const lines = output.split('\n');
  
  const errors = [];
  let currentFile = '';
  let inMisspelledSection = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (line.includes('> Processing:')) {
      currentFile = line.replace('> Processing: ', '').trim();
    } else if (line.includes('Misspelled words:')) {
      inMisspelledSection = true;
      const contextLine = lines[i + 1];
      let lineInfo = '';
      
      if (contextLine && contextLine.includes(':')) {
        const match = contextLine.match(/(\d+):(\d+)/);
        if (match) {
          lineInfo = ` (line ${match[1]}, column ${match[2]})`;
        }
      }
      
      i += 2;
      while (i < lines.length && lines[i].trim() && !lines[i].includes('---')) {
        const word = lines[i].trim();
        if (word) {
          errors.push({ file: currentFile, word, location: lineInfo });
        }
        i++;
      }
      inMisspelledSection = false;
    }
  }
  
  if (errors.length === 0) {
    console.log('✅ No spelling errors found!');
    return;
  }
  
  console.log('❌ Spelling errors found:');
  console.log('');
  
  const groupedErrors = {};
  errors.forEach(error => {
    if (!groupedErrors[error.file]) {
      groupedErrors[error.file] = [];
    }
    groupedErrors[error.file].push({ word: error.word, location: error.location });
  });
  
  Object.entries(groupedErrors).forEach(([file, items]) => {
    console.log(`📄 ${file}:`);
    items.forEach(item => {
      console.log(`   - ${item.word}${item.location}`);
    });
    console.log('');
  });
  
  console.log('💡 To fix these errors:');
  console.log('1. Add correct words to .wordlist.txt');
  console.log('2. Fix actual typos in the files');
  
  process.exit(1);
}