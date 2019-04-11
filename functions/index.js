const functions = require('firebase-functions');

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const admin = require('firebase-admin');
admin.initializeApp();

exports.generateThumbnail = functions.storage.object().onFinalize((objectMetadata, eventContext) => {

  var pathArray = objectMetadata.name.split('/')
  var filename = pathArray.pop()
  pathArray.splice(-1,1)
  var path = pathArray.join('/')

  var ref = admin.database().ref(path + '/' + filename.replace('.', '%2e'))
  return ref.transaction((currentData) => {
    if (currentData === null) {
      return { name: filename, abstractName: objectMetadata.name, link: objectMetadata.selfLink }
    } else {
      console.log('User ada already exists.')
      return
    }
  }, (error, committed, snapshot) => {
    if (error) {
      console.log('Transaction failed abnormally!', error)
    } else if (!committed) {
      console.log('We aborted the transaction (because ada already exists).')
    } else {
      console.log('User ada added!')
    }
    console.log("Ada's data: ", snapshot.val())
  })
});
