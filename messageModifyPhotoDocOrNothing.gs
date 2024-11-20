function messageModifyPhotoDocOrNothing_func(msg, has_reply_to_message, sheetConfig, agent_id, systemRole, chatId, botToken, messageText, text_v_otvet_userID, contextString) {

  //Если отправлен Документ или Фото
  if(msg.hasOwnProperty('photo') || msg.hasOwnProperty('document') || has_reply_to_message && msg.reply_to_message.hasOwnProperty('photo') || has_reply_to_message && msg.reply_to_message.hasOwnProperty('document')){

    let zhdunFraza = sheetConfig.getRange(4, 4).getValue();
    zhdunFraza = `Напиши фразу по аналогии с этой: "${zhdunFraza}"`
    let answerZhdi = mistral_AI_API_agents_with_SystemRole(zhdunFraza, agent_id, systemRole);      

    let startMessageWaitingIDResponse = get_response_message_id_noKeyboard(chatId, answerZhdi, botToken);

    sendTypingAction(chatId, botToken, 'upload_photo'); //имитируем разглядывание фото

    let fileId = '';
    let fileMime = '';

    if(msg.hasOwnProperty('photo')){
      let photoQualityMax=0;
      photoQualityMax = msg.photo.length-1;
            
      fileId = msg.photo[photoQualityMax].file_id;
      fileMime = 'Photo';
      
    }

    if(msg.hasOwnProperty('document')){
      fileId = msg.document.file_id;
      fileMime = msg.document.mime_type;
      //let fileName = msg.document.file_name;        
    }

    if (has_reply_to_message){
      if(msg.reply_to_message.hasOwnProperty('photo')){
        let photoQualityMax=0;
        photoQualityMax = msg.reply_to_message.photo.length-1;
              
        fileId = msg.reply_to_message.photo[photoQualityMax].file_id;
        fileMime = 'Photo';        
      }

      if(msg.reply_to_message.hasOwnProperty('document')){
        fileId = msg.reply_to_message.document.file_id;
        fileMime = msg.reply_to_message.document.mime_type;
        //let fileName = msg.document.file_name;        
      }

    }
    
    let responseFile = UrlFetchApp.fetch('https://api.telegram.org/bot' + botToken + '/getFile?file_id=' + fileId);
    let response_parse = JSON.parse(responseFile.getContentText());
    let filePath = response_parse.result.file_path;
    let fileUrl = 'https://api.telegram.org/file/bot' + botToken + '/' + filePath;

    let linkFile = UrlFetchApp.fetch(fileUrl);
    let blob = linkFile.getBlob();  

    let new_id = '';
    let body = '';

    if(fileMime == 'application/msword' || fileMime == 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'){
      
      let resource = {
        title: 'name',
        mimeType: MimeType.GOOGLE_DOCS
      };
      new_id = Drive.Files.insert(resource, blob).id;

      let doc = DocumentApp.openById(new_id);
      body = doc.getBody().getText();
      DriveApp.getFileById(new_id).setTrashed(true);

    }else if(fileMime == 'text/plain' || fileMime == 'text/html' || fileMime == 'application/rtf'){
      
      let text = blob.getDataAsString();
      let newDoc = DocumentApp.create('Text');
      newDoc.getBody().setText(text);
      new_id = newDoc.getId();

      let doc = DocumentApp.openById(new_id);
      body = doc.getBody().getText();
      DriveApp.getFileById(new_id).setTrashed(true);
    
    }else if(fileMime == 'text/xml'){
      
      // Читаем содержимое файла
      let xmlContent = blob.getDataAsString();
      
      // Парсим XML
      let document = XmlService.parse(xmlContent);
      let root = document.getRootElement();
      
      // Извлекаем текст из XML (здесь пример для простого XML)
      body = root.getText();

    }else{
      new_id = Drive.Files.insert({title: 'temp' }, blob, {ocr: true , ocrLanguage: "ru"}).id;

      let doc = DocumentApp.openById(new_id);
      body = doc.getBody().getText();
      DriveApp.getFileById(new_id).setTrashed(true);
    }
            
    if(body == ''){//если на картинке или в файле нет текста для распознавания
      let naPustuyuKartinkuFraza = sheetConfig.getRange(4, 5).getValue();
      messageText = `${text_v_otvet_userID}\n"${messageText}". ${naPustuyuKartinkuFraza}.`;
    }else{      
      messageText = `${text_v_otvet_userID}\n"${messageText}: ${body}"`;
    }

    //del_inline(chatId, startMessageWaitingIDResponse, botToken);

  }else{
    messageText = `${text_v_otvet_userID}\n"${messageText}"\n\n${contextString}`;
  }

  return messageText;

}
