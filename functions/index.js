const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();



//add new product
exports.addProduct = functions.https.onCall((data, context) => {
  console.log("in addProduct cloud function");
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can add products'
    );
  }
  if (data.name.length > 10) {
      throw new functions.https.HttpsError(
      'invalid-argument', 
      'product name must be no more than 10 characters long'
    );}
  if (isPictureValid(data.url) === false) {
      throw new functions.https.HttpsError(
      'invalid-argument', 
      'url format must be png or jpg '
    );}
  if (isPictureValid(data.url) === false) {
    throw new functions.https.HttpsError(
    'invalid-argument', 
    'url format must be png or jpg '
  );}
  if (isAmountValid(data.amount) === false) {
    throw new functions.https.HttpsError(
    'invalid-argument', 
    'amount field is not a number or not a positive number '
  );}
  if (isPriceValid(data.price) === false) {
    throw new functions.https.HttpsError(
    'invalid-argument', 
    'price field is not a number between 0 to 1000'
  );}
  if (isDateValid(data.date) === false) {
    throw new functions.https.HttpsError(
    'invalid-argument', 
    'date is not in the right format - “mm/dd/yyyy”'
  );}
  return admin.firestore().collection('products').add({
    name: data.name,
    manufacturer: data.manufacturer,
    amount: data.amount,
    price: data.price,
    kashrut: data.kashrut,
    category: data.category,
    expiryDate: data.expiryDate,
    url: data.url
}).then(() => {
    return 'new product added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'internal',
        'product not added-badURL?'
    );
});
});

function isDateValid(date)
{
    // First check for the pattern
    if(!/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date))
        return false;

    // Parse the date parts to integers
    var parts = date.split("/");
    var day = parseInt(parts[1], 10);
    var month = parseInt(parts[0], 10);
    var year = parseInt(parts[2], 10);

    // Check the ranges of month and year
    if(year < 1000 || year > 3000 || month === 0 || month > 12)
        return false;

    var monthLength = [ 31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31 ];

    // Adjust for leap years
    if(year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0))
        monthLength[1] = 29;

    // Check the range of the day
    return day > 0 && day <= monthLength[month - 1];
}

function isPriceValid(price){
  if(isNaN(price) === true){
    return false;
  }
  if(parseInt(price, 10) <= 0 || parseInt(price, 10) >= 1000 ){
    return false;
  }
  return true;
}

function isAmountValid(amount){
  if(isNaN(amount) === true){
    return false;
  }
  if(parseInt(amount, 10) < 0){
    return false;
  }
  return true;
}

function isPictureValid(url){
  console.log(url);
  url+="";
 index=url.indexOf(".");
 if(index === -1){
   return false;
 }
 var check=url.substring(index+1,url.length);
 if (check!=='png' && check!=='jpg') {
    return false;
 }
 return true;
}


// firestore trigger for tracking activity
exports.logActivities = functions.firestore.document('/{collection}/{id}')
  .onCreate((snap, context) => {
    console.log(snap.data());

    const activities = admin.firestore().collection('activities');
    const collection = context.params.collection;
    if (collection === 'users') {
      return activities.add({ text: 'a new user signed up'});
    }
    if (collection === 'products') {
      return activities.add({ text: 'a new product was added'});
    }
    return null;
});

