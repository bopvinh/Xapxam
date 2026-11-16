const fs = require('fs');
let content = fs.readFileSync('MainMenu.tsx', 'utf-8');

// Find where the new living hero JSX ends and the old tile JSX begins
// The new JSX ends with `};` at the end of the component
// Then there's old tile-related JSX after it

// Find the end of the new component (the `};` after the return)
const componentEnd = content.lastIndexOf('};\n};');
if (componentEnd === -1) {
  // Try without newline
  componentEnd = content.lastIndexOf('};\n};');
  if (componentEnd === -1) {
    componentEnd = content.lastIndexOf('};');
  }
}

if (componentEnd !== -1) {
  // The old tile JSX starts after the second `};`
  let oldStart = componentEnd;
  // Find the next meaningful content (the old tile JSX)
  // Look for `tabIndex={0}` which is unique to the old tile JSX
  const tabIndexPos = content.indexOf('tabIndex={0}', componentEnd);
  if (tabIndexPos !== -1) {
    // Remove from tabIndexPos to the end
    content = content.substring(0, tabIndexPos);
    
    // Add the closing of the component
    const newContent = content + '\n};';
    fs.writeFileSync('MainMenu.tsx', newContent);
    console.log('Removed old tile JSX');
    console.log('New file length:', newContent.length);
  }
}
