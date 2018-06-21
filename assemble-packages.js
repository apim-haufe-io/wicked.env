'use strict';

const fs = require('fs');
const path = require('path');

const dirs = [
    'wicked.portal',
    'wicked.portal-api',
    'wicked.portal-chatbot',
    'wicked.portal-env',
    'wicked.portal-kong-adapter',
    'wicked.portal-mailer',
    'wicked.portal-kickstarter',
    'wicked.portal-auth',
    'wicked.portal-test/portal-api',
    'wicked.portal-test/portal-kong-adapter'
];

const baseDir = path.resolve(path.join(__dirname, '..'));

const envPackage = JSON.parse(fs.readFileSync(path.join(__dirname, 'package.json'), 'utf8'));
const envVersion = envPackage.version;

const allDependencies = {};

for (let i = 0; i < dirs.length; ++i) {
    const dirName = dirs[i];
    const dir = path.join(baseDir, dirName);
    console.log('Checking packages.json in: ' + dir);

    const pkg = JSON.parse(fs.readFileSync(path.join(dir, 'package.json')));

    for (let depName in pkg.dependencies) {
        const depVersion = pkg.dependencies[depName];
        if (depVersion.startsWith('..') || depVersion.startsWith('file:'))
            continue;
        if (!allDependencies[depName])
            allDependencies[depName] = depVersion;
        else if (allDependencies[depName] != depVersion) {
            console.log('WARNING: Dependency version mismatch for "' + dirName + '": ' + depName + ' - ' + depVersion + ' vs. ' + allDependencies[depName]);
            if (depVersion > allDependencies[depName]) {
                console.log('WARNING: Taking newer version: ' + depVersion);
                allDependencies[depName] = depVersion;
            }
        }
    }
}

let fixDependencies = false;
if (process.argv.length > 2 && process.argv[2] === '--fix') {
    fixDependencies = true;
}

// Re-add the portal-env we filtered out above
allDependencies['portal-env'] = `file:../portal-env-${envVersion}.tgz`;

envPackage.dependencies = allDependencies;

console.log(JSON.stringify(envPackage, null, 2));

const allPackageFileName = path.join(__dirname, 'package.all.json');
console.log('Writing to ' + allPackageFileName);
fs.writeFileSync(allPackageFileName, JSON.stringify(envPackage, null, 2), 'utf8');

if (fixDependencies) {
    console.log('=========================');
    console.log('Fixing dependencies in all projects');
    console.log('=========================');


    for (let i = 0; i < dirs.length; ++i) {
        const dirName = dirs[i];
        const dir = path.join(baseDir, dirName);
        console.log('Checking packages.json in: ' + dir);

        const pkgFile = path.join(dir, 'package.json');
        const pkg = JSON.parse(fs.readFileSync(pkgFile, 'utf8'));

        let changedDep = false;
        for (let depName in pkg.dependencies) {
            const depVersion = pkg.dependencies[depName];
            if (depVersion.startsWith('..') || depVersion.startsWith('file:'))
                continue;
            const newVersion = allDependencies[depName];
            if (!newVersion) {
                console.error('*** Dependency ${depName} not found. This should not be possible');
                continue;
            }
            if (newVersion !== depVersion) {
                console.log(`- Updating ${depName} to ${newVersion} (was ${depVersion})`);
                pkg.dependencies[depName] = newVersion;
                changedDep = true;
            }
        }
        if (changedDep) {
            console.log(`Saving package.json in ${dirName}`);
            fs.writeFileSync(pkgFile, JSON.stringify(pkg, null, 2), 'utf8');
        }
    }
}