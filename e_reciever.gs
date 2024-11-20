function e_reciever_func(msg) {  

  let chatType = msg.chat.type;
  let chatTitle = msg.chat.title;
  let chatId = msg.chat.id; //id группы или id чата (если пишешь в личку боту)
  

  let isBot = msg.from.is_bot;
  let message_id = msg.message_id;
  let userId = msg.from.id; //id личный пользователя    
  let userFirstName = msg.from.hasOwnProperty('first_name') ? msg.from.first_name : '';
  let userLastName = msg.from.hasOwnProperty('last_name') ? msg.from.last_name : '';
  let userName = msg.from.hasOwnProperty('username') ? msg.from.username : '';

  let messageText = msg.hasOwnProperty('text') ? msg.text : msg.hasOwnProperty('sticker') ? msg.sticker.emoji : msg.hasOwnProperty('caption') ? msg.caption : '';

  let has_reply_to_message = msg.hasOwnProperty('reply_to_message');
  let reply_to_isBot = has_reply_to_message ? msg.reply_to_message.from.is_bot : '';
  let reply_to_message_id = has_reply_to_message ? msg.reply_to_message.message_id : '';
  let reply_to_user_id = has_reply_to_message ? msg.reply_to_message.from.id : '';
  let reply_to_userFirstName = has_reply_to_message ? msg.reply_to_message.from.first_name : '';
  let reply_to_userLastName = has_reply_to_message ? msg.reply_to_message.from.last_name : '';
  let reply_to_userName = has_reply_to_message ? msg.reply_to_message.from.username : '';    
  
  let reply_to_message_text = '';
  if (has_reply_to_message){
    reply_to_message_text =  msg.reply_to_message.hasOwnProperty('text') ? msg.reply_to_message.text : msg.reply_to_message.hasOwnProperty('sticker') ? msg.reply_to_message.sticker.emoji : msg.reply_to_message.hasOwnProperty('caption') ? msg.reply_to_message.caption : '';
  }  

  let Items_Matrix = [chatType, chatTitle, chatId, isBot, message_id, userId, userFirstName, userLastName, userName, messageText, has_reply_to_message, reply_to_isBot, reply_to_message_id, reply_to_user_id, reply_to_userFirstName, reply_to_userLastName, reply_to_userName, reply_to_message_text];

  return Items_Matrix;

}
