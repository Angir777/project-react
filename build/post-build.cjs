const path = require('path');
const fs = require('fs');

function getAllDirectories(dirPath) {
  let directories = [];

  try {
    const items = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const item of items) {
      if (item.isDirectory()) {
        const fullPath = path.join(dirPath, item.name);
        directories.push(fullPath);
      }
    }
  } catch (err) {
    console.error(`Cannot access ${dirPath}: ${err.message}`);
  }

  return directories;
}

function replaceInJsFiles(dirPath, searchString, replaceValue) {
  let items;
  try {
    items = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch (err) {
    // Skip directories you can't access
    return;
  }

  for (const item of items) {
    const fullPath = path.join(dirPath, item.name);

    if (item.isDirectory()) {
      // Recurse into subdirectory
      replaceInJsFiles(fullPath, searchString, replaceValue);
    } else if (
      item.isFile() &&
      (path.extname(item.name) === '.js' || path.extname(item.name) === '.json')
    ) {
      try {
        let content = fs.readFileSync(fullPath, 'utf8');

        if (content.includes(searchString)) {
          content = content.replaceAll(searchString, replaceValue);
          fs.writeFileSync(fullPath, content, 'utf8');
          console.log(`Updated: ${fullPath} with value ${replaceValue}`);
        }
      } catch (err) {
        console.error(`Error processing file ${fullPath}:`, err.message);
      }
    }
  }
}

function getModuleVersion(moduleDir) {
  const appVersion = Date.now().toString();

  replaceInJsFiles(`${moduleDir}/browser`, '{{APP_VERSION_TO_REPLACE}}', appVersion);
}

const rootDir = './dist'; // Use 'C:\\' on Windows
const allDirs = getAllDirectories(rootDir);

for (const moduleDir of allDirs) {
  getModuleVersion(moduleDir);
}
