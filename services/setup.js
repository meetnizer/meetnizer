const fs = require('fs');
//var homedir = require('os').homedir()
//var configDir = path.join(homedir, 'timet.json')
function isConfigured(appPath) {
    return fs.existsSync(getConfigFileName(appPath));
}

function getConfiguration(appPath) {
    return JSON.parse(fs.readFileSync(getConfigFileName(appPath)));
}

function getConfigFileName(appPath) {
    return `${appPath}/settings.json`;
}

function createConfigFile(appPath, dbFile) {
    var config = {
        dbFiles:[dbFile],
        timerDefault: 5
    };
    saveConfig(appPath, config);
}

function saveConfig(appPath, config) {
    fs.writeFileSync(
        getConfigFileName(appPath), 
        JSON.stringify(config),
        null,
        4);
}
module.exports = 
    { 
        isConfigured,
        getConfiguration, 
        getConfigFileName,
        createConfigFile,
        saveConfig
    }