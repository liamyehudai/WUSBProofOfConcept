const fs = require('fs');

let scriptContent = fs.readFileSync('script.js', 'utf-8');

scriptContent = scriptContent.replace(/\/\*\*\n \* COMPONENT LOADER[\s\S]*?\}\n\n\/\/ Wrap existing logic in an init function so it binds after dynamic load\nfunction initLogic\(\) \{/m, 'function initLogic() {');

scriptContent = scriptContent.replace(/document\.addEventListener\('DOMContentLoaded', loadComponents\);/m, "document.addEventListener('DOMContentLoaded', initLogic);");

fs.writeFileSync('script.js', scriptContent);
