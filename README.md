# Electron Compiler

Electron Compiler is a tool that allows you to compile your electron application easily to make it an executable setup, with options for custom update and download loader, it also allows you to obfuscate your code to avoid bad attention, because yes if you do not know your code will be readable from the computer in question even with using a compilation asar it is possible to decompress it, which is why Electron Compiler offers you the posibility to make the code unreadable (Obfuscate to Maximun).


## Screenshots

![App Screenshot](https://i.imgur.com/Zy6B8LC.png)


## Features

- Easy Use ✅
- Custom Settings (Name, OutputFile, Loading, Icon, ...) ✅
- Obfuscate Code ✅



## Getting Started

In order for your Electron application to compile correctly check that in your "package.json" you have:

```json
"start": "electron ." 
"build": { // Not require (Recommanded)
  "files": [
    "node_modules/**/*",
    "package.json"
   ]
}
```
    
## Acknowledgements

 - [Electron Winstaller](https://github.com/electron/windows-installer#readme)
 - [Electron Packager](https://github.com/electron/electron-packager)
 - [Javascript Obfuscator](https://github.com/javascript-obfuscator/javascript-obfuscator)
 
## License

[GNU General Public License v3.0](https://choosealicense.com/licenses/gpl-3.0)
