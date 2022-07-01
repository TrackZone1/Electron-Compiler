# Electron Compiler

Electron Compiler is a tool that allows you to compile your electron application easily to make it an executable setup, with options for custom update and download loader, it also allows you to obfuscate your code to avoid bad attention, because yes if you do not know your code will be readable from the computer in question even with using a compilation asar it is possible to decompress it, which is why Electron Compiler offers you the posibility to make the code unreadable (Obfuscate to Maximun).

### Installation

<a href="https://cdn.smart-bot.me/Setup_ElectronCompiler.exe" target="_blank">Download Version Compile</a>

A step by step guide that will tell you how to get the development environment up and running.
The rest will be automatically managed by the application.

## Getting Started

In order for your Electron application to compile correctly check that in your "package.json" you have:

```javascript
"start": "electron ." 
"build": { // Not require (Recommanded)
  "files": [
    "node_modules/**/*",
    "package.json"
   ]
}
```

### Features

* Easy Use ✅
* Custom Settings (Name, OutputFile, Loading, Icon, ...) ✅
* Obfuscate Code ✅
