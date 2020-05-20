var token = 
var url = "https://api.telegram.org/bot"+token;
var waurl = "https://script.google.com/macros/s/AKfycbzneVYn1sEXLVbXXvaS4qZm6_Ew8dcYIKfE2Pz0Z_kxuNgkPrWS/exec";
var spid = 
var ss = SpreadsheetApp.openById(spid);
var secondsheet = ss.getSheetByName('analysis');
var bank = ss.getSheetByName('overallbank');
var telelogsheet = ss.getSheetByName('telegram');
var graphsheet = ss.getSheetByName('graphs');
//var cancelled = false;
var change = telelogsheet.getRange('Y1').getValue();


//telegram method to get the name of the bot in the log
function getMe() {
  var response = UrlFetchApp.fetch(url + "/getMe");
  Logger.log(response.getContentText());
  
}

function getUpdates() {
  var response = UrlFetchApp.fetch(url + "/getUpdates");
  Logger.log(response.getContentText());
}

function setWebhook() {
  var response = UrlFetchApp.fetch(url + "/setWebhook?url=" + waurl);
  Logger.log(response.getContentText());
}

function sendText(id, text){
  var data = {
      method: "post",
      payload: {
         method: "sendMessage",
         chat_id: String(id),
         text: text,
         parse_mode: "Markdown" // add markdown formatting
         //reply_markup: JSON.stringify(keyBoard)
      }
  }
  //var response = UrlFetchApp.fetch(url + "/sendMessage?chat_id=" + id + "/" + data);
  //Logger.log(url +"/"+ data);
  var response = UrlFetchApp.fetch(url +"/", data);
  Logger.log(response.getContentText());
}

function sendPhoto(id,photo,captiontext){
  var data = {
    method: "post",
    payload:{
      method: "sendPhoto",
      chat_id: String(id),
      photo: String(photo),
      caption: String(captiontext)
    }
  }
  var response = UrlFetchApp.fetch(url +"/", data);
  Logger.log(response.getContentText());

}

function doGet(e){
  //serialize the Javascript object as JSON
  return HTMLService.createHtmlOutput("Hello "+ JSON.stringify(e));
}

function format(x, n){
    x = parseFloat(x);
    n = n || 2;
    return parseFloat(x.toFixed(n))
}

/*
function onEdit(e) {
  //telelogsheet.getRange('Y1').setValue(Math.random());
  return True;
  
}
*/

/* failed attempt at global variables
PropertiesService.getScriptProperties().setProperty('mykey', 'myvalue');
var somerange = PropertiesService.getScriptProperties().getProperty(telelogsheet.getRange('B1:B'));
var msgtime = PropertiesService.getScriptProperties().getProperty(telelogsheet.getRange("A1:A").getValues());
*/

function reminder(){
  
  //var somerange = telelogsheet.getRange('B1:B');
  var id = 372601813;
  sendText(id, "Hey " + "Andante Moss" + " do remember to add expenses. Type 'help' for more commands.");
  var currtime = new Date().valueOf();
  Utilities.sleep(500000);  
  var msgtime = telelogsheet.getRange("A1:A").getValues();
  
  //get values from telelog sheet
  var lengthmsgtime = msgtime.length; //length of the array
  var lastmsg = new Array(); 
  
  //enter values which are not none
  for (i=0; i<(lengthmsgtime); i++){
      if (msgtime[i] != ""){
        //sendText(id,lengthlastmsg[i]);
        lastmsg.push(msgtime[i]);
      }
    }
    
  var lengthlastmsg = lastmsg.length;
  var finmsg = lastmsg[lengthlastmsg-1];
  var finmsg2 = new Date(finmsg).valueOf(); //convert to a Google Apps script Object
  
  //double reminder
  if (finmsg2 < currtime){
    sendText(id, "Hey "+"Andante"+" act on your promises. Add your expenses.");
    
  }
}  

//main receiving function
function doPost(e) {
  var contents = JSON.parse(e.postData.contents);
  
  //GmailApp.sendEmail(Session.getEffectiveUser().getEmail(),"BudgetBot Updates!", JSON.stringify(e,null,4));
  //GmailApp.sendEmail("kenneth.911.koh@gmail.com","BudgetBot Log!", JSON.stringify(e,null,4));
  
  var text = contents.message.text;
  var id = contents.message.from.id;
  var updateid = contents.update_id;
  var name = contents.message.from.first_name + " " + contents.message.from.last_name;
  var date = new Date();
  var currmonth = date.getMonth();
  var year = date.getYear();
  
  //appending message content to 3rd telegram spreadsheet
  telelogsheet.appendRow([date,currmonth,id,updateid,name,text,contents]);
  

  //sendTelegram("bot1","Iphone Meli  %s", TelegramMessage.toString)
  if (text.toLowerCase() == "help"){
    sendText(id, "Hi " + name + " come record your expenses "+"*Possible Commands:* "+"/deposit, /addexpense, /undo, /show"+ " Formatting: all values are comma separated.");
    
    /*var keyboard = {
      reply_markup: {
        inline_keyboard: [[
          {
            text: "A",
            callback_data: "A1"            
          }, 
          {
            text: "B",
            callback_data: "C1"            
          }]
        ]
      }
    }
    */
    //sendText(id,"lol",keyboard);
    
  }
  
  if (text.toLowerCase().slice(0, 11)=="/addexpense"){
    //cancelled = true;
    var amt = text.split(",")[1];
    //sendText(id,amt);
    var reason = text.split(",")[2];
    //sendText(id,reason);
    secondsheet.appendRow([date,currmonth,amt,reason,"expense"]);
    sendText(id, "You have _successfully_ added $"+amt+" to your expenses.");
    
    /*
    if (typeof money == 'number'){
      var amt = text;
      sendText(id, "Reason?");
      var reason = text;
      
    }*/
    
  }
  
  if (text.toLowerCase().slice(0,8)=="/deposit"){
    var amt = text.split(",")[1];
    //sendText(id,amt);
    var reason = text.split(",")[2];
    //sendText(id,reason);
    secondsheet.appendRow([date,currmonth,amt,reason,"deposit"]);
    sendText(id, "You have _successfully_ deposited $"+amt+" to your home account.");
      
    }

  if (text.toLowerCase().slice(0,5)=="/undo"){
    var sheetvalues = secondsheet.getRange("D1:D").getValues();
    //sendText(id,sheetvalues)
    var lengthval = sheetvalues.length;
    var delrow = new Array();
    
    for (i=0; i<(lengthval); i++){
      if (sheetvalues[i] != ""){
        //sendText(id,sheetvalues[i]);
        delrow.push(sheetvalues[i]);
      }
    }
    var lengthdel = delrow.length;
    
    //sendText(id,lengthdel);
    //sendText(id,delrow[lengthdel-1]);
    
    //Deletes row by index
    secondsheet.deleteRow(lengthdel);
    
    sendText(id, "You have successfully removed the previous operation.");
    }  
  
  /* Display of Current money and expense for the month*/
  //var months = {0:'January', 1:'February',2:'March', 3:'April', 4:'May',5:'June',6:'July',7:'August',8:'September',9:'October',10:'November',11:'December'};
  
  if (text.toLowerCase().slice(0,5)=="/show"){
    //cancelled = true;
    var sheetvalues2 = bank.getRange("C3:C").getValues();
    var lengthval2 = sheetvalues2.length;
    var monthtext = Utilities.formatDate(date, Session.getScriptTimeZone(), "MMMM").toLowerCase();
    var sheetyear = bank.getRange("A3:A").getValues();
    var spending = bank.getRange("E3:E").getValues();
    var balance = bank.getRange("F3:F").getValues();
    
    //sendText(id,"currmonth "+monthtext+" "+sheetyear+" "+year);
    
    for (i=0; i<lengthval2; i++){
      if ((sheetvalues2[i] == monthtext) && (sheetyear[i] == year)){
      sendText(id,"Your current expense for the month is $"+format(spending[i])+", while you have $"+format(balance[i])+" left.");
      }
    }
  }
  
  if (text.toLowerCase().slice(0,9)=="/analysis"){
    var name = "spendbal";
    var chart = graphsheet.getCharts()[0];
    var imageData = Utilities.base64Encode(chart.getAs('image/png').getBytes());
    sendText(id,typeof(chart)+typeof(imageData));
    
    //getting image as a jpeg
    var imgData2 = chart.getAs('image/png');
    sendText(id,typeof(imgData2));
    
    //testing
    sendPhoto(id,"https://upload.wikimedia.org/wikipedia/commons/thumb/4/49/Olympus_E-420.jpg/193px-Olympus_E-420.jpg","LoL");
    
    var destination_id = "1voVU5nKhWo6pebdvY0Mm8vt8kdvmcff2";
    //var destination = DriveApp.getFolderById(destination_id);
    var destination = DriveApp.getFilesByName('budgetingbot');
    sendText(id,"got the folder open");
    
    //unique file name for the chart
    var chartname = name+String(updateid%10)+'.jpg';
    sendText(id,chartname);
    destination.createFile(imgData2);
    sendText(id,"created testimagefile");
    //destination.createFile(chartname,imgData2);
    sendText(id,"wait 20sec");
    Utilities.sleep(20000);
    sendText(id,"20 seconds is up");
    
    //getting chart from drive
    var img3 = destination.getFilesByName(chartname);
    sendPhoto(id,img3,"Here are the spending and balances for the past few months. Watch your spending!");
    
    do {
      Utilities.sleep(5000);
      sendText(id,"sleeping for 5 seconds");
      var img3 = destination.getFilesByName(chartname);
      sendPhoto(id,img3,"Here are the spending and balances for the past few months. Watch your spending!");
    }
    while (img3=="");
  
  }
    
}

/*
do {
  //reminder using sendText function
  sendText(id, "Hey "+"Andante"+" act on your promises. Add your expenses."+lengthlastmsg);
  sendText(id,String(finmsg2)+" "+String(currtime));
    
    
  //clear up the array
  Utilities.sleep(10000);
  msgtime = "";
  lengthmsgtime = "";
  lastmsg = "";
  somerange = "";
  //var change = telelogsheet.getRange('Y1').getValue();
  //sendText(id,String(change));
  //reminder(msgtime,somerange);
  }
  
  while ((finmsg2 < currtime) && (text2 == ""));*/
