// Save/Load system

// Example usage :
// SAVE
// var save = new SaveData();
// save.name = "bizzygwen"
// save.scores.push({name:"level0", score:100});
// saveDataObject(save);
// LOAD
// var loadData = loadDataObject();
// print(loadData.name + " " + loadData.something);
// you can also use the other functions to use your own

// IMPORTANT! If you reset IOP, don't forget to load the correct modules
// Example: IOP.loadDefaultModule(IOP.memcard);

// Can modify these names
const mainFolder = "BIZZYGAME";
const mainDataFile = "game.dat";

// Make your own savedata by modifying/adding to this class:
class SaveData {
  saveVersion = 1;
  name = "BizzyGwen";
  scores = [{ name: "level-", score: 350 }];
}

// save devices (probably can also add hdd and maybe samba?)
const saveDevices = ["mc0:/", "mc1:/", "mass:/"];

function saveDataObject(save, saveFilePathCustom) {
  var saveFilePath = saveFilePathCustom;
  if (typeof saveFilePathCustom === "undefined") {
    saveFilePath = getSaveFilePath();
  }
  var jsonString = JSON.stringify(save);
  var saveAttempt = saveData(saveFilePath, jsonString);
  return saveAttempt;
}

function loadDataObject() {
  var saveFilePath = getSaveFilePath();
  loadAttempt = loadData(saveFilePath);
  if (loadAttempt.startsWith("ERROR#") || loadAttempt.length <= 0) {
    // create empty savedata and save it:
    var save = new SaveData();
    var saveAttempt = saveDataObject(save);

    loadAttempt = loadData(saveFilePath);
  }

  var loadedData = Object.assign(new SaveData(), JSON.parse(loadAttempt));

  return loadedData;
}

function deleteDataObject() {
  var saveFilePath = getSaveFilePath();
  var removeAttempt = os.remove(saveFilePath);
  return removeAttempt;
}

function stringToArrayBuffer(str) {
  const buffer = new ArrayBuffer(str.length);
  const view = new Uint8Array(buffer);
  for (let i = 0; i < str.length; i++) {
    view[i] = str.charCodeAt(i);
  }
  return buffer;
}

function arrayBufferToString(buffer, maxLength) {
  const uint8Array = new Uint8Array(buffer);
  let str = "";
  for (let i = 0; i < maxLength; i++) {
    str += String.fromCharCode(uint8Array[i]);
  }
  return str;
}

function checkDevice(deviceName) {
  var readDir = os.readdir(deviceName);
  if (readDir[1] == 0) {
    return true;
  }
  return false;
}

function checkFolder(path) {
  var readDir = os.readdir(path);
  if (readDir[1] == 0) {
    return true;
  }
  return false;
}

function createFolder(path) {
  var mkdir = os.mkdir(path);
  if (mkdir == 0) {
    return true;
  }
  return false;
}

function getSaveFilePath() {
  return getSaveFileFolder()[0] + "/" + mainDataFile;
}

function getSaveFileFolder() {
  var error = -1;
  var retMsg = "";

  const saveDeviceAvailable = [];

  // Find available devices (memory,usb,???)
  //retMsg = "Searching for available save devices."
  for (let index = 0; index < saveDevices.length; index++) {
    const saveDevice = saveDevices[index];
    if (checkDevice(saveDevice)) {
      saveDeviceAvailable.push({ device: saveDevice, available: true });
    }
  }

  // Find if my directory already exists
  var foundFolder = false;
  var saveFolder = "";
  for (let index = 0; index < saveDeviceAvailable.length; index++) {
    const saveDevice = saveDeviceAvailable[index].device;
    const savePath = saveDevice + mainFolder;
    if (checkFolder(savePath)) {
      foundFolder = true;
      retMsg += " " + savePath;
      saveFolder = savePath;
      break;
    }
  }

  // If my folder is not found, create it!
  if (!foundFolder) {
    for (let index = 0; index < saveDeviceAvailable.length; index++) {
      const saveDevice = saveDeviceAvailable[index].device;
      const savePath = saveDevice + mainFolder;
      if (createFolder(savePath)) {
        foundFolder = true;
        retMsg += " " + savePath;
        saveFolder = savePath;
        break;
      }
    }
  }

  if (!foundFolder) {
    error = -2;
    retMsg = "Could not find or create save folder.";
  } else {
    retMsg = "Found folder.";
    error = 0;
  }

  const fullSaveFolderPath = saveFolder;
  return [fullSaveFolderPath, retMsg, error];
}

function saveData(savePath, saveObjData) {
  var openAttempt = os.open(savePath, os.O_TRUNC | os.O_CREAT | os.O_WRONLY);
  if (openAttempt < 0) {
    return "ERROR#" + openAttempt;
  }

  const buffer = stringToArrayBuffer(saveObjData);
  var writtenBytes = os.write(openAttempt, buffer, 0, buffer.byteLength);

  os.close(openAttempt);
  return writtenBytes;
}

function loadData(savePath) {
  var openAttempt = os.open(savePath, os.O_RDONLY);
  if (openAttempt < 0) {
    return "ERROR#" + openAttempt;
  }
  const bufferSize = 512;
  const buffer = new ArrayBuffer(bufferSize);
  var readBytes = os.read(openAttempt, buffer, 0, bufferSize);
  var totalBytes = readBytes;
  var readStr = "";
  readStr += arrayBufferToString(buffer, readBytes);
  while (readBytes > 0) {
    readBytes = os.read(openAttempt, buffer, 0, bufferSize);
    if (readBytes > 0) {
      readStr += arrayBufferToString(buffer, readBytes);
      totalBytes += readBytes;
    }
  }

  os.close(openAttempt);
  return readStr;
}

function deleteData(savePath) {
  var removeAttempt = os.remove(savePath);
  return removeAttempt;
}
