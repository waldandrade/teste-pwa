const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.generateThumbnail = functions.storage.object().onFinalize((objectMetadata) => {
  var pathArray = objectMetadata.name.split('/')
  var filename = pathArray.pop()
  pathArray.splice(-1,1)
  var path = pathArray.join('/')

  return admin.database().ref(path).push({name: filename, abstractName: objectMetadata.name, link: objectMetadata.selfLink}).then((snapshot) => {
    return true
  });
});
