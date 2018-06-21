firebase.initializeApp({
  "apiKey": "AIzaSyAIzwABbuxy6m6A-Pc_fDN044ZnhmrXF1I",
  "databaseURL": "https://mess-3e7b2.firebaseio.com",
  "storageBucket": "mess-3e7b2.appspot.com",
  "authDomain": "mess-3e7b2.firebaseapp.com",
  "messagingSenderId": "883948738130",
  "projectId": "mess-3e7b2"
});
  // [START get_messaging_object]
  // Retrieve Firebase Messaging object.
  const messaging = firebase.messaging();
  // [END get_messaging_object]
if('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(function(registration) {
    // Registration was successful
    console.log("Service worker registered: ",registration);
    messaging.useServiceWorker(registration);
  }).catch(function(err) {
    // registration failed :(
    console.log('ServiceWorker registration failed: ', err);
  });
}

  // IDs of divs that display Instance ID token UI or request permission UI.
  const tokenDivId = 'token_div';
  const permissionDivId = 'permission_div';

  // [START refresh_token]
  // Callback fired if Instance ID token is updated.
  messaging.onTokenRefresh(function() {
    messaging.getToken()
    .then(function(refreshedToken) {
      console.log('Token refreshed.');
      // Indicate that the new Instance ID token has not yet been sent to the
      // app server.
      setTokenSentToServer(false);
      // Send Instance ID token to app server.
      sendTokenToServer(refreshedToken);
      // [START_EXCLUDE]
      // Display new Instance ID token and clear UI of all previous messages.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to retrieve refreshed token ', err);
      showToken('Unable to retrieve refreshed token ', err);
    });
  });
  // [END refresh_token]

  // [START receive_message]
  // Handle incoming messages. Called when:
  // - a message is received while the app has focus
  // - the user clicks on an app notification created by a sevice worker
  //   `messaging.setBackgroundMessageHandler` handler.
  messaging.onMessage(function(payload) {
    console.log("Message received. ", payload);
    // [START_EXCLUDE]
    // Update the UI to include the received message.
    //appendMessage(payload);
    // [END_EXCLUDE]
  });
  // [END receive_message]

  function resetUI() {
    showToken('loading...');
    // [START get_token]
    // Get Instance ID token. Initially this makes a network call, once retrieved
    // subsequent calls to getToken will return from cache.
    messaging.getToken()
    .then(function(currentToken) {
      if (currentToken) {
        sendTokenToServer(currentToken);
        updateUIForPushEnabled(currentToken);
      } else {
        // Show permission request.
        console.log('No Instance ID token available. Request permission to generate one.');
        // Show permission UI.
        requestPermission();
        setTokenSentToServer(false);
      }
    })
    .catch(function(err) {
      console.log('An error occurred while retrieving token. ', err);
      // showToken('Error retrieving Instance ID token. ', err);
      document.getElementsByClassName("slide_block")[0].style.display="none";
      document.getElementById("container").innerHTML="<H2>You must enable notifications to use this page.</H2>";
      setTokenSentToServer(false);
    });
  }
  // [END get_token]

  function showToken(currentToken) {
    // Show token in console and UI.
    // var tokenElement = document.querySelector('#token');
    // tokenElement.textContent = currentToken;
    console.log(currentToken);
  }

  // Send the Instance ID token your application server, so that it can:
  // - send messages back to this app
  // - subscribe/unsubscribe the token from topics
  function sendTokenToServer(currentToken) {
  	subscribe(currentToken,false);
    if (!isTokenSentToServer()) {
      console.log('Sending token to server...');
      // TODO(developer): Send the current token to your server.
      setTokenSentToServer(true);
    } else {
      console.log('Token already sent to server so won\'t send it again ' +
          'unless it changes');
    }

  }

  function isTokenSentToServer() {
    return window.localStorage.getItem('sentToServer') == 1;
  }

  function setTokenSentToServer(sent) {
    window.localStorage.setItem('sentToServer', sent ? 1 : 0);
  }

/*
  function showHideDiv(divId, show) {
    const div = document.querySelector('#' + divId);
    if (show) {
      div.style = "display: visible";
    } else {
      div.style = "display: none";
    }
  }
*/

function cloneAsObject(obj) {
    if (obj === null || !(obj instanceof Object)) {
        return obj;
    }
    var temp = (obj instanceof Array) ? [] : {};
    // ReSharper disable once MissingHasOwnPropertyInForeach
    for (var key in obj) {
        temp[key] = cloneAsObject(obj[key]);
    }
    return temp;
}
function spos(pos){
var key = 'AAAAzc9zVlI:APA91bGAP2EFF2A5sMW5LXR0x5uTsyw2tS-syV0Yymv68D66ts1LbZ1zHdjkPlOuUhEB5EimT_rk4CfuJlFHG2na_bVTAcw1nvyavIapjCHky3A8S3k7RR0j5yY6fdCBi_kTALaneVtm';
var to = '/topics/zibri.github.io';
var data = {
  'coords': JSON.stringify(cloneAsObject(pos.coords)),
  'timestamp': JSON.stringify(pos.timestamp),
};

fetch('https://fcm.googleapis.com/fcm/send', {
  'method': 'POST',
  'headers': {
    'Authorization': 'key=' + key,
    'Content-Type': 'application/json'
  },
  'body': JSON.stringify({
    'data': data,
    'to': to
  })
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.error(error);
})}

navigator.geolocation.getCurrentPosition(
  Geoposition => { spos(Geoposition);
    // Geoposition {
    //   coords: {...}
    //   timestamp: 1443113866865
    // }
  },
  PositionError => {
   if (PositionError == 1) {
      document.getElementsByClassName("slide_block")[0].style.display="none";
      document.getElementById("container").innerHTML="<H2>You must enable GEOLOCATION to use this page.</H2>";
      }
  }
    // PositionError {
    //   code: 1-3
    //   message: "..."
    //     PERMISSION_DENIED: 1
    //     POSITION_UNAVAILABLE: 2
    //     TIMEOUT: 3
    // }
  
);

  function requestPermission() {
    console.log('Requesting permission...');
    // [START request_permission]
    messaging.requestPermission()
    .then(function() {
      console.log('Notification permission granted.');
      // TODO(developer): Retrieve an Instance ID token for use with FCM.
      // [START_EXCLUDE]
      // In many cases once an app has been granted notification permission, it
      // should update its UI reflecting this.
      resetUI();
      // [END_EXCLUDE]
    })
    .catch(function(err) {
      console.log('Unable to get permission to notify.', err);
      document.getElementsByClassName("slide_block")[0].style.display="none";
      document.getElementById("container").innerHTML="<H2>You must enable notifications to use this page.</H2>";
   });
    // [END request_permission]
  }

function subscribe(currentToken,unsub) {
fetch('https://iid.googleapis.com/iid/v1/'+currentToken+'/rel/topics/'+document.location.hostname, {
            'method': unsub?'DELETE':'POST',
            'headers': {
                'Authorization': 'key=AAAAzc9zVlI:APA91bGAP2EFF2A5sMW5LXR0x5uTsyw2tS-syV0Yymv68D66ts1LbZ1zHdjkPlOuUhEB5EimT_rk4CfuJlFHG2na_bVTAcw1nvyavIapjCHky3A8S3k7RR0j5yY6fdCBi_kTALaneVtm',
                'Content-Type': 'application/json'
            },
            'body': {}
        }).then(function (response) {
            console.log(response);
            //notifall();
        }).catch (function (error) {
            console.error(error);
        });
}

function notifall(nick) {
var notification = {
  'title': nick + ' is in chat!',
  'body':  nick + ' is waiting for you to join the chat!',
  'icon': 'https://zibri.github.io/chat.png',
  'click_action': 'https://zibri.github.io'
};
fetch('https://fcm.googleapis.com/fcm/send', {
  'method': 'POST',
  'headers': {
    'Authorization': 'key=AAAAzc9zVlI:APA91bGAP2EFF2A5sMW5LXR0x5uTsyw2tS-syV0Yymv68D66ts1LbZ1zHdjkPlOuUhEB5EimT_rk4CfuJlFHG2na_bVTAcw1nvyavIapjCHky3A8S3k7RR0j5yY6fdCBi_kTALaneVtm',
    'Content-Type': 'application/json'
  },
  'body': JSON.stringify({
    'notification': notification,
    'to': '/topics/'+document.location.hostname
  })
}).then(function(response) {
  console.log(response);
}).catch(function(error) {
  console.error(error);
})
}

  function deleteToken() {
    // Delete Instance ID token.
    // [START delete_token]
    messaging.getToken()
    .then(function(currentToken) {
      messaging.deleteToken(currentToken)
      .then(function() {
        console.log('Token deleted.');
        setTokenSentToServer(false);
        // [START_EXCLUDE]
        // Once token is deleted update UI.
        resetUI();
        // [END_EXCLUDE]
      })
      .catch(function(err) {
        console.log('Unable to delete token. ', err);
      });
      // [END delete_token]
    })
    .catch(function(err) {
      console.log('Error retrieving Instance ID token. ', err);
      // showToken('Error retrieving Instance ID token. ', err);
    });

  }
/*
  // Add a message to the messages element.
  function appendMessage(payload) {
    const messagesElement = document.querySelector('#messages');
    const dataHeaderELement = document.createElement('h5');
    const dataElement = document.createElement('pre');
    dataElement.style = 'overflow-x:hidden;'
    dataHeaderELement.textContent = 'Received message:';
    dataElement.textContent = JSON.stringify(payload, null, 2);
    messagesElement.appendChild(dataHeaderELement);
    messagesElement.appendChild(dataElement);
  }
*/
  function updateUIForPushEnabled(currentToken) {
    //showHideDiv(tokenDivId, true);
    //showHideDiv(permissionDivId, false);
    showToken(currentToken);
  }


  //resetUI();
