# AthenaSaveSystem

Save System for AthenaEnv PS2

Add me in credits if you use anything of this! **Usage explained further below!**

## Configuration (on top of savesystem.js):

1. Edit these two lines
```
const mainFolder = "MYGAME";
const mainDataFile = "gamesave.ext";
```

2. Modify this your own custom savedata class:
```
class SaveData {
  saveVersion = 1;
  something = "someone";
  name = "BizzyGwen";
  scores = [{ name: "intro", score: 100 }];
}
```

(Optional) Devices to check availability for save locations
```
const saveDevices = ["mc0:/", "mc1:/", "mass:/"];
```

## IMPORTANT!
If you reset IOP, don't forget to load the correct modules
Example: 
```
IOP.loadDefaultModule(IOP.memcard);
```

## Example Usage:

```
// LOAD (also creates empty default save if doesn't exist yet)
var saveData = loadDataObject();
print(saveData.name + " " + saveData.something);
you can also use the other functions to use your own
```

```
// SAVE
// var newSaveData = new SaveData();
// or just use the one you loaded before.
saveData.name = "bizzygwen";
saveData.scores.push({name:"level0", score:100});
saveDataObject(saveData);
```




