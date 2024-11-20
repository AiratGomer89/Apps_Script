function tolik_bot(e, botToken) {  //получение данных из Telegram  

  let ss = SpreadsheetApp.openById(ssID);

  let sheetConfig = ss.getSheetByName(sheetConfigName);
  let sheetChatID_Imya = ss.getSheetByName(sheetChatID_ImyaName);
     
  const contents = JSON.parse(e.postData.contents);
  
  // const contents_s = JSON.stringify(contents, null, 5);
  // let sheetArchive = ss.getSheetByName(sheetArchiveName);
  // sheetArchive.getRange(1, 2).setValue(contents_s);

  let msg = contents.message;

  //Сразу присваиваем всем переменным значения элементов массива полученного от функции e_reciever_func(e)
  let [chatType, chatTitle, chatId, isBot, message_id, userId, userFirstName, userLastName, userName, messageText, has_reply_to_message, reply_to_isBot, reply_to_message_id, reply_to_user_id, reply_to_userFirstName, reply_to_userLastName, reply_to_userName, reply_to_message_text] = e_reciever_func(msg);


  let vkl_vykl_bot = sheetConfig.getRange(2, 3).isChecked();
  if (!vkl_vykl_bot) {
    let vkl_vykl_bot_words = sheetConfig.getRange(4, 3).getValue();
    sendMessage(chatId, vkl_vykl_bot_words, botToken);
    return ContentService.createTextOutput();
  }
  

  if (messageText == `/start${bot_name}` || messageText == '/start') {
    sendTypingAction(chatId, botToken, 'typing'); //имитируем печать
    let start_message = sheetConfig.getRange(6, 1).getValue();
    sendMessage(chatId, start_message, botToken);
    return ContentService.createTextOutput();
  }

  let ChatIDsNamesMatrix = sheetChatID_Imya.getRange(2, 1, sheetChatID_Imya.getLastRow() - 1, 2).getValues();
  ChatIDsNamesMatrix = transpose(ChatIDsNamesMatrix);

  let unknownUser = '';
  if (userFirstName != '') {
    unknownUser = userFirstName;
  } else {
    if (userLastName != '') {
      unknownUser = userLastName;
    } else {
      unknownUser = userName;
    }
  }

  let klichka = ChatIDsNamesMatrix[1][ChatIDsNamesMatrix[0].indexOf(userId)];
  klichka = klichka ? klichka : unknownUser;

  let reply_to_klichka = '';

  if (has_reply_to_message) {
    let reply_to_unknownUser = '';
    if (reply_to_userFirstName != '') {
      reply_to_unknownUser = reply_to_userFirstName;
    } else {
      if (reply_to_userLastName != '') {
        reply_to_unknownUser = reply_to_userLastName;
      } else {
        reply_to_unknownUser = reply_to_userName;
      }
    }

    reply_to_klichka = ChatIDsNamesMatrix[1][ChatIDsNamesMatrix[0].indexOf(reply_to_user_id)];
    reply_to_klichka = reply_to_klichka ? reply_to_klichka : reply_to_unknownUser;

  }

  //назначаем логирование на лист с соответствующим именем
  let sheetLog = logingSheet_reciever_func(chatTitle, klichka, ss); 

  if (messageText == `/clear${bot_name}` || messageText == '/clear') {
    sheetLog.getRange(2, 1, sheetLog.getLastRow() - 1, 22).clear();
    sendMessage(chatId, `${bot_name} свеж и чист`, botToken);
    return ContentService.createTextOutput();
  }

  let one_string_of_context = '';
  if (reply_to_message_text != '') {
    one_string_of_context = `${reply_to_klichka} написал: "${reply_to_message_text}".\n${klichka} ответил: "${messageText}".`;
  } else {
    one_string_of_context = `${klichka} написал: "${messageText}".`;
  }

  let dataVremya = new Date();
  let data = [[dataVremya, chatType, chatTitle, chatId, isBot, message_id, userId, userFirstName, userLastName, userName, reply_to_isBot, reply_to_message_id, reply_to_user_id, reply_to_userFirstName, reply_to_userLastName, reply_to_userName, dataVremya, reply_to_klichka, reply_to_message_text, klichka, messageText, one_string_of_context]];
  sheetLog.getRange(sheetLog.getLastRow() + 1, 1, 1, data[0].length).setValues(data);
  SpreadsheetApp.flush();




  sheetConfig.getRange(2, 2).setValue(userId);


  //КОНТЕКСТ
  let vkl_vykl_kontecst = sheetConfig.getRange(2, 5).isChecked();
  let contextString = '';
  if (vkl_vykl_kontecst) {
    let context_length = sheetConfig.getRange(2, 6).getValue();

    //let ShapkaMatrix = sheetLog.getRange(1, 18, 1, 4).getValues();
    let lastr = sheetLog.getLastRow();

    if (lastr - context_length <= 0) {
      context_length = lastr - 1;
    }

    if (context_length == 0) {
      contextString = ``;
    } else {
      let context_start_row = lastr - context_length + 1;
      let ContextMatrix = sheetLog.getRange(context_start_row, sheetLog.getLastColumn(), context_length, 1).getValues();
      //let ContextMatrix = ContextMatrixNonReverse.reverse();

      contextString = `\nThe following data is the context of previous communication, analyze them and when drawing up a response you can use the conclusions received, but respond only to the last, new message, without repeating previous ones and never repeat your answers:\n${ContextMatrix.join(`\n`)}`;
    }
  }

  let text_v_otvet_userID = `Call by name. ${klichka} just wrote a message:`;
  //let text_userID_Name = sheetChatID_Imya.getRange(2,3).getValue();

  let text_osnovaRole = sheetConfig.getRange(2, 1).getValue();
  text_osnovaRole = `This is your role:\n${text_osnovaRole}.`;

  let systemRole = `${text_osnovaRole}.`;

  //sheetLog.getRange(1, 24).setValue(systemRole);

  let agent_id = sheetConfig.getRange(2, 8).getValue();

  let is_word_matches_message = false;
  let vkl_vykl_kontrol_slov = sheetConfig.getRange(2, 4).isChecked();//проверяем включен ли РЕАГИРОВАНИЕ НА ВСЕ СООБЩЕНИЯ

  if (!vkl_vykl_kontrol_slov) { //если выключена, то начинаем проверку на совпадение СООБЩЕНИЯ с КОНТРОЛНЫМИ СЛОВАМИ

    let stroka_kontrol_slov = sheetConfig.getRange(4, 1).getValue();

    let Massiv_kontrol_slov = stroka_kontrol_slov.split(",");
    Massiv_kontrol_slov = Massiv_kontrol_slov.map(value => value.replace(/\s+/g, ' ').trim());


    for (i = 0; i < Massiv_kontrol_slov.length; i++) {
      if (messageText.match(Massiv_kontrol_slov[i])) {
        is_word_matches_message = true;
        break;
      }

    }

  }


  if (is_word_matches_message || vkl_vykl_kontrol_slov || reply_to_user_id == bot_standart_id) { //если сообщение содержит одно из КОНТРОЛЬНЫХ СЛОВ или включено РЕАГИРОВАТЬ НА ВСЕ СООБЩЕНИЯ

    sendTypingAction(chatId, botToken, 'typing'); //имитируем печать

    messageText = messageModifyPhotoDocOrNothing_func(msg, has_reply_to_message, sheetConfig, agent_id, systemRole, chatId, botToken, messageText, text_v_otvet_userID, contextString);

    sendTypingAction(chatId, botToken, 'typing'); //имитируем печать

    messageText = messageText.replace(/</g,'&lt ');
    
    //messageText='<code>'+messageText+'</code>';   

    let answer = mistral_AI_API_agents_with_SystemRole(messageText, agent_id, systemRole);   

    let lichnost = sheetConfig.getRange(2, 7).getValue();
    sendMessage(chatId, `Личность: ${lichnost}`, botToken)

    let response = sendReplyMessage(chatId, answer, botToken, message_id)
    
    const responseObj = JSON.parse(response);    
    msg = responseObj.result;

    //Сразу присваиваем всем переменным значения элементов массива полученного от функции e_reciever_func(e)
    [chatType, chatTitle, chatId, isBot, message_id, userId, userFirstName, userLastName, userName, messageText, has_reply_to_message, reply_to_isBot, reply_to_message_id, reply_to_user_id, reply_to_userFirstName, reply_to_userLastName, reply_to_userName, reply_to_message_text] = e_reciever_func(msg);
           
    unknownUser = '';
    if (userFirstName != '') {
      unknownUser = userFirstName;
    } else {
      if (userLastName != '') {
        unknownUser = userLastName;
      } else {
        unknownUser = userName;
      }
    }

    klichka = ChatIDsNamesMatrix[1][ChatIDsNamesMatrix[0].indexOf(userId)];
    klichka = klichka ? klichka : unknownUser;

    reply_to_klichka = '';

    if (has_reply_to_message) {
      reply_to_unknownUser = '';
      if (reply_to_userFirstName != '') {
        reply_to_unknownUser = reply_to_userFirstName;
      } else {
        if (reply_to_userLastName != '') {
          reply_to_unknownUser = reply_to_userLastName;
        } else {
          reply_to_unknownUser = reply_to_userName;
        }
      }

      reply_to_klichka = ChatIDsNamesMatrix[1][ChatIDsNamesMatrix[0].indexOf(reply_to_user_id)];
      reply_to_klichka = reply_to_klichka ? reply_to_klichka : reply_to_unknownUser;
    }

    one_string_of_context = '';
    if (reply_to_message_text != '') {
      one_string_of_context = `${reply_to_klichka} написал: "${reply_to_message_text}".\n${klichka} ответил: "${messageText}".`;
    } else {
      one_string_of_context = `${klichka} написал: "${messageText}".`;
    }

    dataVremya = new Date();
    data = [[dataVremya, chatType, chatTitle, chatId, isBot, message_id, userId, userFirstName, userLastName, userName, reply_to_isBot, reply_to_message_id, reply_to_user_id, reply_to_userFirstName, reply_to_userLastName, reply_to_userName, dataVremya, reply_to_klichka, reply_to_message_text, klichka, messageText, one_string_of_context]];
    sheetLog.getRange(sheetLog.getLastRow() + 1, 1, 1, data[0].length).setValues(data);

    SpreadsheetApp.flush();

    let DaNet = ['да','нет','да','да'];
    let resultDaNet = getRandomElement(DaNet);

              //sendMessage(chatId, resultDaNet, botToken);

    if(resultDaNet == 'да'){

      sendTypingAction(chatId, botToken, 'choose_sticker'); //имитируем стикер

      question = `Какой эмоции соответствует данный текст?: ${answer}.Варианты: Угроза, Грусть, Злость, Печаль, Радость, Шутка, Надсмешка, Любовь, Обида, Тупость, Забота. Ответь из этих вариантов одним словом. Если ни один вариант не подходит напиши свой вариант.`;

      let emotionAnswer = mistral_AI_API(question, systemRole = '', temperature = 0.3)

                              sendMessage(chatId, emotionAnswer, botToken);

      let stickerId = '';
      let gifID = '';

      if(['Радость', 'Шутка', 'Надсмешка'].includes(emotionAnswer)){

        let GifOrSticker = ['gif','sticker'];
        let resultGifOrSticker = getRandomElement(GifOrSticker);

        if(resultGifOrSticker == 'sticker'){
          stickerId = getRandomElement(StickerIdsRadost);
          sendStick(chatId, botToken, stickerId);
        }

        if(resultGifOrSticker == 'gif'){          
          gifID = getRandomElement(GifsIdsRadost);          
          sendGifToTelegram(chatId, gifID, botToken);
        }

      }
    

      if(['Угроза','Злость'].includes(emotionAnswer)){

        let GifOrSticker = ['gif','sticker'];
        let resultGifOrSticker = getRandomElement(GifOrSticker);

        if(resultGifOrSticker == 'sticker'){          
          stickerId = getRandomElement(StickerIdsZlost);
          sendStick(chatId, botToken, stickerId);
        }

        if(resultGifOrSticker == 'gif'){          
          gifID = getRandomElement(GifsIdsZlost);          
          sendGifToTelegram(chatId, gifID, botToken);
        }
        
      }

      if(['Обида'].includes(emotionAnswer)){

        let GifOrSticker = ['gif','sticker'];
        let resultGifOrSticker = getRandomElement(GifOrSticker);

        if(resultGifOrSticker == 'sticker'){
          stickerId = getRandomElement(StickerIdsObida);
          sendStick(chatId, botToken, stickerId);
        }

        if(resultGifOrSticker == 'gif'){                    
          gifID = getRandomElement(GifsIdsObida);          
          sendGifToTelegram(chatId, gifID, botToken);
        }

      }
      
      
    }
    
    return ContentService.createTextOutput();
  }

  return ContentService.createTextOutput();

}
