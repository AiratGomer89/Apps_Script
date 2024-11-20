function sendMessage(chatId, message, botToken) {
  let data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      text: message,
      parse_mode: "HTML",
      protect_content: false,
      disable_notification: false,
      disable_web_page_preview: true,
      muteHttpExceptions: true
    }
  };
  let response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + "/", data);
  return response;
}

function sendReplyMessage(chatId, message, botToken, replyId) {
  let data = {
    method: "post",
    payload: {
      method: "sendMessage",
      chat_id: String(chatId),
      reply_to_message_id: String(replyId),
      text: message,
      parse_mode: "HTML",
      protect_content: false,
      disable_notification: false,
      disable_web_page_preview: true,
      muteHttpExceptions: true
    }
  };
  let response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + "/", data);
  return response;
}

function setMessageReaction(chatId, message_id, botToken, emotic) {
  // Объект JSON
  var jsonData = [{type : 'emoji', emoji : emotic}]
  //var jsonData = LOCATION_KEYBOARD
  // Преобразование объекта JSON в строку
  var jsonString = JSON.stringify(jsonData);

  // Кодирование строки JSON для безопасной передачи в URL
  var encodedJsonString = encodeURIComponent(jsonString);
  


  let url = `https://api.telegram.org/bot${botToken}/setMessageReaction?chat_id=${chatId}&message_id=${message_id}&reaction=${encodedJsonString}`;  

  UrlFetchApp.fetch(url);

}

function del_inline(chatId, messageId, botToken) {
  const url = "https://api.telegram.org/bot" + botToken + "/deleteMessage";
  const payload = {
    "method": "deleteMessage",
    "chat_id": chatId,
    "message_id": messageId
  };
  const options = {
    "method": "post",
    "contentType": "application/json",
    "payload": JSON.stringify(payload)
  };
  UrlFetchApp.fetch(url, options);
}

function sendTypingAction(chatId, botToken, action) {
  
  var url = 'https://api.telegram.org/bot' + botToken + '/sendChatAction';
  
  var payload = {
    'chat_id': chatId,
    'action': action
  };
  
  var options = {
    'method': 'post',
    'contentType': 'application/json',
    'payload': JSON.stringify(payload)
  };
  
  UrlFetchApp.fetch(url, options);
}

function sendStick(chatId, botToken, stickerId) {

  let data = {
    method: "post",
    payload: {
      method: "sendSticker",
      chat_id: String(chatId),
      sticker: stickerId,      
    }
  };
  let response = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + "/", data);
  return response;
}

function sendGifToTelegram(chatId, fileID, botToken) {
  try {
    // Fetch the file path of the GIF
    let responseFile = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/getFile?file_id=' + fileID);
    let response_parse = JSON.parse(responseFile.getContentText());
    
    if (!response_parse.ok) {
      throw new Error('Failed to get file path: ' + response_parse.description);
    }
    
    let filePath = response_parse.result.file_path;
    let fileUrl = 'https://api.telegram.org/file/bot' + botToken + '/' + filePath;

    // Download the GIF file
    let linkFile = UrlFetchApp.fetch(fileUrl);
    let blob = linkFile.getBlob().setName('image.gif').setContentType('application/octet-stream');

    // Create form data for sending the file
    let formData = {
      'chat_id': String(chatId),
      'document': blob
    };

    // Set up the request options
    let options = {
      'method': 'post',
      'payload': formData,
      'muteHttpExceptions': true
    };

    // Send the GIF as a document to the specified chat
    let url = 'https://api.telegram.org/bot' + botToken + '/sendDocument';
    let response = UrlFetchApp.fetch(url, options);

    // Parse the response
    let responseJson = JSON.parse(response.getContentText());
    
    if (!responseJson.ok) {
      throw new Error('Failed to send document: ' + responseJson.description);
    }

    return 'GIF sent successfully!';
  } catch (error) {
    Logger.log('Error sending GIF: ' + error.message);
    return 'Error: ' + error.message;
  }
}
