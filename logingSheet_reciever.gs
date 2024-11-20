function logingSheet_reciever_func(chatTitle, klichka, ss) {
  let sheetLog;
  let sheetLogName = chatTitle ? chatTitle : klichka;
  let collectionSheets = ss.getSheets();
  let massivSheetNames = [];

  massivSheetNames = collectionSheets.map((item) => item.getName());

  if (massivSheetNames.includes(sheetLogName)) {
    sheetLog = ss.getSheetByName(sheetLogName);
  } else {
    //создаём новый лист
    sheetLog = ss.insertSheet(sheetLogName);
    let Shapka = [['Дата', 'Тип чата', 'Название чата', 'ID чата', 'сообщение от бота?', 'ID сообщения', 'ID пользователя', 'Имя', 'Фамилия', 'Никнейм', 'ответ на сообщение от бота?', 'ID сообщения, на которое отвечаем', 'ID пользователя, которому отвечаем', 'Имя пользователя, которому отвечаем', 'Фамилия пользователя, которому отвечаем', 'Никнейм пользователя, которому отвечаем', 'Дата', 'Кому отвечаем', 'Текст сообщения, на которое отвечаем', 'Кто отвечает', 'Текст сообщения', 'Контекст']];
    sheetLog.setFrozenRows(1);
    sheetLog.getRange(1, 1, 1, Shapka[0].length).setValues(Shapka);

    sheetLog.getRange('1:1').setFontFamily('Roboto Mono')
      .setFontWeight('bold')
      .setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP)
      .setHorizontalAlignment('center');
    SpreadsheetApp.flush();
  }

  return sheetLog;

}
