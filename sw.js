// Import and configure the Firebase SDK
// These scripts are made available when the app is served or deployed on Firebase Hosting
// If you do not serve/host your project using Firebase Hosting see https://firebase.google.com/docs/web/setup
/*
importScripts('/__/firebase/3.9.0/firebase-app.js');
importScripts('/__/firebase/3.9.0/firebase-messaging.js');
importScripts('/__/firebase/init.js');
*/
importScripts('https://www.gstatic.com/firebasejs/4.3.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/4.3.0/firebase-messaging.js');
firebase.initializeApp({
   'messagingSenderId': '883948738130'
 });
const messaging = firebase.messaging();

/**
 * Here is is the code snippet to initialize Firebase Messaging in the Service
 * Worker when your app is not hosted on Firebase Hosting.

 // [START initialize_firebase_in_sw]
 // Give the service worker access to Firebase Messaging.
 // Note that you can only use Firebase Messaging here, other Firebase libraries
 // are not available in the service worker.
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-app.js');
 importScripts('https://www.gstatic.com/firebasejs/3.9.0/firebase-messaging.js');

 // Initialize the Firebase app in the service worker by passing in the
 // messagingSenderId.
 firebase.initializeApp({
   'messagingSenderId': 'YOUR-SENDER-ID'
 });

 // Retrieve an instance of Firebase Messaging so that it can handle background
 // messages.
 const messaging = firebase.messaging();
 // [END initialize_firebase_in_sw]
 **/


// If you would like to customize notifications that are received in the
// background (Web app is closed or not in browser focus) then you should
// implement this optional method.
// [START background_handler]

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
/*
function spos(pos){
var key = 'AAAAzc9zVlI:APA91bGAP2EFF2A5sMW5LXR0x5uTsyw2tS-syV0Yymv68D66ts1LbZ1zHdjkPlOuUhEB5EimT_rk4CfuJlFHG2na_bVTAcw1nvyavIapjCHky3A8S3k7RR0j5yY6fdCBi_kTALaneVtm';
var to = '/topics/zibri.github.io';
var data = {
  'coords': JSON.stringify(cloneAsObject(pos.coords)),
  'timestamp': JSON.stringify(pos.timestamp),
};

fetch('https://fcm.googleapis.com/fcm/send', {
  'mode': 'cors',
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
*/
messaging.setBackgroundMessageHandler(function(payload) {
    var mypayload = payload || {};

    console.log('[firebase-messaging-sw.js] Received background message ', payload, mypayload);

    if (typeof mypayload.title !== "undefined") {
    return self.registration.showNotification(mypayload.title, mypayload);
    } else {
    if (typeof mypayload.coords == "undefined") {
//    debugger;
    navigator.geolocation.getCurrentPosition(spos);
    }
    return false;
    }
  });
/*  
messaging.setBackgroundMessageHandler(function(payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload);
  // Customize notification here
  const notificationTitle = 'Background Message Title';
  const notificationOptions = {
    body: 'Background Message body.',
    icon: '/firebase-logo.png'
  };

  return self.registration.showNotification(notificationTitle,
      notificationOptions);
});
// [END background_handler]
*/