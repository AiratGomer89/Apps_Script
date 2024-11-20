let webAppUrl = '***YOUR_WEB_URL_GOOGLE_SHEETS***';
let botToken = '***YOUR_TELEGRAM_BOT_TOKEN***';
let bot_name = '@YOUR_BOT_NAME_bot';
let bot_standart_id = '***YOUR_TELEGRAM_CHAT_ID***';
const ssID = '***YOUR_SPREADSHEET_ID***';

const sheetConfigName = 'Настройки';
const sheetChatID_ImyaName = 'chatID_имя';
const sheetArchiveName = 'архив_промптов';
const sheetCharactersName = 'характеры_бота';


function doPost(e){  
  tolik_bot(e, botToken);  
}

function setWebhook(webAppUrl,botToken) {   
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/setWebhook?url=' + webAppUrl);
  Logger.log(response.getContentText());
}

function deleteWebhook(webAppUrl,botToken) {
  var response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/deleteWebhook?url=' + webAppUrl);
  Logger.log(response.getContentText());
}
