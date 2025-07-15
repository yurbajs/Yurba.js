#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

function formatSpellcheckResults() {
  const resultsFile = path.join(process.cwd(), 'spellcheck-results.txt');
  
  if (!fs.existsSync(resultsFile)) {
    console.log('No spellcheck results file found');
    return;
  }
  
  const content = fs.readFileSync(resultsFile, 'utf8');
  const lines = content.split('\n');
  
  const errors = [];
  let currentFile = '';
  
  for (const line of lines) {
    if (line.includes('Processing:')) {
      currentFile = line.replace('> Processing: ', '').trim();
    } else if (line.includes('Misspelled words:') && lines[lines.indexOf(line) + 2]) {
      const word = lines[lines.indexOf(line) + 2].trim();
      if (word && !word.includes('---')) {
        errors.push({ file: currentFile, word });
      }
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
    groupedErrors[error.file].push(error.word);
  });
  
  Object.entries(groupedErrors).forEach(([file, words]) => {
    console.log(`📄 ${file}:`);
    words.forEach(word => console.log(`   - ${word}`));
    console.log('');
  });
  
  console.log('💡 To fix these errors:');
  console.log('1. Add correct words to .wordlist.txt');
  console.log('2. Fix actual typos in the files');
}

formatSpellcheckResults();