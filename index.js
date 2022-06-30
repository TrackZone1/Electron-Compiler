const { app, BrowserWindow } = require('electron');
const WebSocketServer = require('ws');
const fs = require('fs');
var { exec } = require('child_process');
var JavaScriptObfuscator = require('javascript-obfuscator');
var electronInstaller = require('electron-winstaller');

const App = () => {
    const win = new BrowserWindow({
        width: 1100,
        height: 750,
        minWidth: 600,
        autoHideMenuBar: true,
        icon: __dirname + '/icon.ico',
    })

    win.loadFile('main.html');
}

app.whenReady().then(async () => {
   App();
});

app.on('closed', function() {
    app = null
})

app.on('window-all-closed', () => {
  if (process.platform === 'darwin') {
    return false;
  }
  app.quit();
});

function Pourcentage(pourcentage){
    return '<div class="progress"><div class="progress-bar progress-bar-striped bg-danger progress-bar-animated" role="progressbar" style="width: ' + pourcentage + '%;" aria-valuenow="' + pourcentage + '" aria-valuemin="0" aria-valuemax="' + pourcentage + '">' + pourcentage + '%</div></div>';
}

function ObfusqueFile(filename){
    var obfuscationResult = JavaScriptObfuscator.obfuscate(fs.readFileSync(filename).toString().replace(/\r/gi, ""), 
    {
        compact: true,
        controlFlowFlattening: true,
        controlFlowFlatteningThreshold: 1,
        deadCodeInjection: true,
        deadCodeInjectionThreshold: 1,
        debugProtection: true,
        debugProtectionInterval: 4000,
        disableConsoleOutput: true,
        identifierNamesGenerator: 'hexadecimal',
        log: false,
        numbersToExpressions: true,
        renameGlobals: false,
        selfDefending: true,
        simplify: true,
        splitStrings: true,
        splitStringsChunkLength: 5,
        stringArray: true,
        stringArrayCallsTransform: true,
        stringArrayEncoding: ['rc4'],
        stringArrayIndexShift: true,
        stringArrayRotate: true,
        stringArrayShuffle: true,
        stringArrayWrappersCount: 5,
        stringArrayWrappersChainedCalls: true,    
        stringArrayWrappersParametersMaxCount: 5,
        stringArrayWrappersType: 'function',
        stringArrayThreshold: 1,
        transformObjectKeys: true,
        unicodeEscapeSequence: false
    }
    );

    fs.writeFile(filename, obfuscationResult.getObfuscatedCode(), err => {
        if (err) {
          console.error(err);
        }
        // file written successfully
    });
}

function getFilesizeInBytes(filename) {
    var stats = fs.statSync(filename);
    var fileSizeInBytes = stats.size;
    return fileSizeInBytes;
}

const wss = new WebSocketServer.Server({ port: 8029 });

wss.on("connection", async ws => {
    
    ws.on("message", async data => {

        var json = JSON.parse(data);

        console.log(data);

        if (json.compile){
            if (json.directory_app == "" || json.directory_output == "" || json.directory_icon == "" || json.directory_loading == "" || json.authors == ""){
                ws.send(JSON.stringify({ result: '<p class="text-danger">Please fill all fields !</p>' }));
            }else{

                ws.send(JSON.stringify({ result: Pourcentage(10) }));

                var packageJson = require(json.directory_app + '/package.json');

                console.log(packageJson);
                console.log(packageJson.main);

                var StreamMainFile = fs.createWriteStream(json.directory_app + '/' + packageJson.main, {
                    flags: 'a'
                });

                if (!fs.readFileSync(json.directory_app + '/' + packageJson.main).toString().replace(/\r/gi, "").includes(fs.readFileSync("./squirrel.js").toString().replace(/\r/gi, ""))){
                
                    StreamMainFile.write(fs.readFileSync("./squirrel.js").toString().replace(/\r/gi, ""));
                    console.log("squirrel.js added");
                }

                setTimeout(() => {
                    ws.send(JSON.stringify({ result: Pourcentage(25) }));

                    exec(`npx electron-packager ${json.directory_app} --platform=win32 --arch=x64 --icon=${json.directory_app}/icon.ico`, (error, stdout, stderr) => {
                        console.log(stdout);
                        console.log(stderr);

                        CreateSetup();

                    });

                }, 10 * 1000);

                function CreateSetup(){

                    if (json.check_obfuscate === true){

                        fs.readdir(packageJson.name + "-win32-x64/resources/app", (err, files) => {
                            files.forEach(file => {
                                
                                if (file.includes(".js") && !file.includes(".json")){
                                    if (getFilesizeInBytes("./" + packageJson.name + "-win32-x64/resources/app/" + file) > 50000) return false;
                                    console.log("OBFUSCATE => " + file);
                                    ws.send(JSON.stringify({ result: '<p class="text-danger">Obfuscate => ' + file + '</p>' }));
                                    ObfusqueFile(packageJson.name + "-win32-x64/resources/app/" + file);
                                }
                                if (!file.includes(".")){

                                    if (file === "node_modules") return false;

                                    fs.readdir(packageJson.name + "-win32-x64/resources/app/" + file, (err, files) => {
                                        files.forEach(file2 => {
                                        if (file2.includes(".js") && !file2.includes(".json")){
                                            if (getFilesizeInBytes("./" + packageJson.name + "-win32-x64/resources/app/" + file + "/" + file2) > 50000) return false;
                                            console.log("OBFUSCATE => " + file2);
                                            ws.send(JSON.stringify({ result: '<p class="text-danger">Obfuscate => ' + file2 + '</p>' }));
                                            ObfusqueFile(packageJson.name + "-win32-x64/resources/app/" + file + "/" + file2);
                                        }
                                        });
                                    });
                                    
                                }

                            });
                        });

                        ws.send(JSON.stringify({ result: '<p class="text-danger">Long Step Please Wait !</p>' }));
                        setTimeout(function() { ws.send(JSON.stringify({ result: Pourcentage(50) })); }, 3 * 1000);

                    }

                        ws.send(JSON.stringify({ result: '<p class="text-danger">Long Step Please Wait !</p>' }));
                        setTimeout(function() { ws.send(JSON.stringify({ result: Pourcentage(50) })); }, 3 * 1000);

                    var settings = {
                        appDirectory: './' + packageJson.name + "-win32-x64",
                        outputDirectory: json.directory_output,
                        authors: json.authors,
                        exe: './' + packageJson.name + '.exe',
                        loadingGif: json.directory_loading,
                    };

                    resultPromise = electronInstaller.createWindowsInstaller(settings);
                         
                    resultPromise.then(() => {
                        ws.send(JSON.stringify({ result: Pourcentage(75) }));
                        try {
                            fs.rmSync('./' + packageJson.name + "-win32-x64", { recursive: true });
                        } catch (error) {
                            ws.send(JSON.stringify({ result: Pourcentage(100) }));
                        }
                        ws.send(JSON.stringify({ result: Pourcentage(100) }));
                        console.log("The installers of your application were succesfully created !");
                    }, (e) => {
                        console.log(`Well, sometimes you are not so lucky: ${e.message}`);
                        ws.send(JSON.stringify({ result: '<p class="text-danger">Error Restart App !</p>' }));
                    });

                }

            }
        }

        ws.on("close", () => {
            console.log("[WS] Close");
        });
        // handling client connection error
        ws.onerror = function () {
            console.log("Some Error occurred")
        }
    });

});

console.log("The WebSocket server is running on port 8080");

/*===========
Squirrel Module
=============*/

if (handleSquirrelEvent(app)) {
    // squirrel event handled and app will exit in 1000ms, so don't do anything else
    return;
}

function handleSquirrelEvent(application) {
    if (process.argv.length === 1) {
        return false;
    }

    const ChildProcess = require('child_process');
    const path = require('path');

    const appFolder = path.resolve(process.execPath, '..');
    const rootAtomFolder = path.resolve(appFolder, '..');
    const updateDotExe = path.resolve(path.join(rootAtomFolder, 'Update.exe'));
    const exeName = path.basename(process.execPath);

    const spawn = function(command, args) {
        let spawnedProcess, error;

        try {
            spawnedProcess = ChildProcess.spawn(command, args, {
                detached: true
            });
        } catch (error) {}

        return spawnedProcess;
    };

    const spawnUpdate = function(args) {
        return spawn(updateDotExe, args);
    };

    const squirrelEvent = process.argv[1];
    switch (squirrelEvent) {
        case '--squirrel-install':
        case '--squirrel-updated':
            // Optionally do things such as:
            // - Add your .exe to the PATH
            // - Write to the registry for things like file associations and
            //   explorer context menus

            // Install desktop and start menu shortcuts
            spawnUpdate(['--createShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-uninstall':
            // Undo anything you did in the --squirrel-install and
            // --squirrel-updated handlers

            // Remove desktop and start menu shortcuts
            spawnUpdate(['--removeShortcut', exeName]);

            setTimeout(application.quit, 1000);
            return true;

        case '--squirrel-obsolete':
            // This is called on the outgoing version of your app before
            // we update to the new version - it's the opposite of
            // --squirrel-updated

            application.quit();
            return true;
    }
};