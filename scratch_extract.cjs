const fs = require('fs');
const path = require('path');

const contextPath = path.join(__dirname, 'src', 'context', 'ExecutionContext.jsx');
const content = fs.readFileSync(contextPath, 'utf8');

// A helper to extract array literals by scanning matching braces/brackets
function extractArray(name) {
  const startIndex = content.indexOf(`const ${name} = [`);
  if (startIndex === -1) {
    throw new Error(`Could not find ${name}`);
  }
  
  const arrayStart = content.indexOf('[', startIndex);
  let depth = 1;
  let index = arrayStart + 1;
  
  while (depth > 0 && index < content.length) {
    if (content[index] === '[') depth++;
    else if (content[index] === ']') depth--;
    index++;
  }
  
  const arrayStr = content.substring(arrayStart, index);
  // Eval it safely by wrapping in parentheses
  return eval(`(${arrayStr})`);
}

console.log('Extracting snapshots...');
const factorial = extractArray('factorialSnapshots');
const fibonacci = extractArray('fibonacciSnapshots');
const binarySearch = extractArray('binarySearchSnapshots');

console.log(`Extracted:
- Factorial: ${factorial.length} steps
- Fibonacci: ${fibonacci.length} steps
- Binary Search: ${binarySearch.length} steps
`);

// Create directory structure
const baseDataDir = path.join(__dirname, 'src', 'data', 'algorithms');
fs.mkdirSync(path.join(baseDataDir, 'factorial'), { recursive: true });
fs.mkdirSync(path.join(baseDataDir, 'fibonacci'), { recursive: true });
fs.mkdirSync(path.join(baseDataDir, 'binarySearch'), { recursive: true });

// Write JSON files
fs.writeFileSync(path.join(baseDataDir, 'factorial', 'execution.json'), JSON.stringify(factorial, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDataDir, 'fibonacci', 'execution.json'), JSON.stringify(fibonacci, null, 2), 'utf8');
fs.writeFileSync(path.join(baseDataDir, 'binarySearch', 'execution.json'), JSON.stringify(binarySearch, null, 2), 'utf8');

console.log('JSON files successfully generated!');
