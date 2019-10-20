const setup = require('../services/setup')
const appLocalPath = __dirname;
const fs = require('fs');

function removeFile() {
    const file = setup.getConfigFileName(appLocalPath);
    if (fs.existsSync(file))
        fs.unlinkSync(file);
}

test('getConfigFileName', function () {
    expect(setup.getConfigFileName(appLocalPath)).toBe(__dirname+"/settings.json");
});

test('isConfigured()', function() {
    removeFile();    
    const config = setup.isConfigured(appLocalPath);
    expect(config).toBe(false);
});

test('createConfig()', function() {
    const dbPath = `${__dirname}/mydb.db`;
    setup.createConfigFile(appLocalPath, dbPath);
    const config = setup.getConfiguration(appLocalPath);
    expect(config.dbFiles[0]).toBe(dbPath);
    expect(config.timerDefault).toBe(5);
    removeFile();
})

test('saveConfig()', function() {
    const dbPath = `${__dirname}/mydb.db`;
    const dbPath1 = `${__dirname}/mydb1.db`;
    setup.createConfigFile(appLocalPath, dbPath);
    
    var config = setup.getConfiguration(appLocalPath);
    config.dbFiles.push(dbPath1);
    
    setup.saveConfig(appLocalPath, config);
    
    config = setup.getConfiguration(appLocalPath);
    expect(config.dbFiles[0]).toBe(dbPath);
    expect(config.dbFiles[1]).toBe(dbPath1);
    expect(config.timerDefault).toBe(5);

    removeFile();
})