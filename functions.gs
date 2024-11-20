function transpose(matrix) {
  return matrix[0].map((col, i) => matrix.map(row => row[i]));
}

function get_response_message_id_noKeyboard(chatId, instruction, botToken){
  let response = sendMessage(chatId, instruction, botToken);
  response_obj = JSON.parse(response);      
  response_message_id = response_obj.result.message_id;

  return response_message_id;
}

function getRandomElement(arr) {
  let randomIndex = Math.floor(Math.random() * arr.length);
  return arr[randomIndex];
}
