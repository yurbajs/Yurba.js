#!/usr/bin/env node

const fs = require('fs');

// Читаємо stdout з GitHub Actions
const input = process.env.GITHUB_ACTIONS ? 
  fs.readFileSync('/dev/stdin', 'utf8') : 
  require('child_process').execSync('pyspelling -c spellcheck.yaml', { encoding: 'utf8', stdio: 'pipe' }).toString();

const lines = input.split('\n');
const errors = [];
let currentFile = '';

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  
  if (line.includes('> Processing:')) {
    currentFile = line.replace('> Processing: ', '').trim();
  } else if (line.includes('Misspelled words:')) {
    // Пропускаємо рядок з контекстом
    i += 2;
    // Читаємо слова до роздільника
    while (i < lines.length && lines[i].trim() && !lines[i].includes('---')) {
      const word = lines[i].trim();
      if (word) {
        errors.push({ file: currentFile, word });
      }
      i++;
    }
  }
}

if (errors.length === 0) {
  console.log('✅ No spelling errors found!');
  process.exit(0);
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

process.exit(1);