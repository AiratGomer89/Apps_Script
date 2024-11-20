function InstallSendingTrigger(time) {

  let TRIGGER_NAME_Sender = 'character_changer';
  

  //ScriptApp.newTrigger(TRIGGER_NAME_Sender).timeBased().atHour(15).nearMinute(10).everyDays(1).create();//установка триггера, который отправляет данные, кто из сотрудников выходит  
  
  ScriptApp.newTrigger(TRIGGER_NAME_Sender).timeBased().everyMinutes(time).create();

}

function UninstallSendingTrigger() {

  let TRIGGER_NAME_Sender = 'character_changer';  

  var triggers = ScriptApp.getProjectTriggers()
  for (var i = 0; i < triggers.length; i++) {
    if (triggers[i].getHandlerFunction() === TRIGGER_NAME_Sender) {
      ScriptApp.deleteTrigger(triggers[i])
    }
  }
}

function character_changer(){

  UninstallSendingTrigger();

  let ss = SpreadsheetApp.openById(ssID);
  let sheetConfig = ss.getSheetByName(sheetConfigName);
  let sheetCharacters = ss.getSheetByName(sheetCharactersName);

  let CharacterNames = sheetCharacters.getRange(2, 1, sheetCharacters.getLastRow() - 1, 1).getValues().flat();

Logger.log(CharacterNames);
  
  let characterName = getRandomElement(CharacterNames);
  sheetConfig.getRange(2, 7).setValue(characterName);

Logger.log(characterName);
  let Times = [1,5,10,15];
  let time = getRandomElement(Times);
  InstallSendingTrigger(time);

}
