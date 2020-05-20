# Experimental Bots


## Bot 0 --> Discord Bot 
__Let's get rid of rude words in your chats!__

### Current features
1. Detects rude words (nltk tokenization/regex)
2. Tells user to stop being rude


## Bot 1 --> Telegram Bot
Remind myself to keep budgets, provide a easy connection to google sheets to record and showcase the breakdown of expenses

### Current features
1. Deposit
2. Add expenses
3. Undoing of Previous operation
4. Daily reminders, which persist for one more time, if no action is taken. 
- Tried to get read receipts, but does not seem to be available on the Telegram Bot API


### Debug Log

#### __1. Strange caching in the Google Apps Script prevented input variables from changing even though google sheets was already updated__

__References to the same problem__
1. https://issuetracker.google.com/issues/36753882
2. https://stackoverflow.com/questions/17341399/refresh-data-retrieved-by-a-custom-function-in-google-sheet
3. https://stackoverflow.com/questions/9022984/script-to-summarise-data-not-updating/9023954#9023954

###### Example Code
```javascript
do {

  //get curr time
  var currtime = new Date().valueOf();
  
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
    
  //clear up the array
  Utilities.sleep(10000);
  msgtime = "";
  lengthmsgtime = "";
  lastmsg = "";

  }
  
while (finmsg2 < currtime);
```

The code above continues to be stuck in the while loop endlessly, as the caching issue cannot allow it to continuous receive the new array updated by the telegram bot. 

#### Attempted solution #1
Tried to get *"dummy"* variables as inputs, but it did not work.
#### Attempted solution #2
Maybe one can kill a function from another function, but dosen't seem like a achievable thing in google Apps script
