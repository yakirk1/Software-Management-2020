const firebaseConfig = {
  apiKey: "AIzaSyCCODva5jiR0t4E28rtk1zmoXsY59BsAMw",
  authDomain: "supersami-76ae9.firebaseapp.com",
  databaseURL: "https://supersami-76ae9.firebaseio.com",
  projectId: "supersami-76ae9",
  storageBucket: "supersami-76ae9.appspot.com",
  messagingSenderId: "227496892156",
  appId: "1:227496892156:web:ac3465e56eea4d0b392979",
  measurementId: "G-44L8XEJG2Y"
};
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const firebase = require("firebase");
firebase.initializeApp(firebaseConfig);
admin.initializeApp();
var db= firebase.firestore();


exports.addAdminRole= functions.https.onCall((data,context)=>{
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid,{
      admin: true
    });
}).then(() => {
  return {
    message :`Sucess, ${data.email} is an admin`
  }
}).catch(err =>{
    return err;
});
});


exports.getStudentStatus = functions.https.onCall((data,context)=>{
  return admin.auth().getUserByEmail(data.email).then(user => {
    return admin.auth().setCustomUserClaims(user.uid,{
      admin: true
    });
}).then(() => {
  return {
    message :`Sucess, ${data.email} is an admin`
  }
}).catch(err =>{
    return err;
});
});

// auth trigger (user deleted)
exports.userDeleted = functions.auth.user().onDelete(user => {
  const doc = admin.firestore().collection('users').doc(user.uid);
  return doc.delete();
});

exports.emptyCart = functions.https.onCall((data,context)=>{
  return db.collection('carts').doc(data.uid).delete();

})
function checkData(data){
  if (data.name.length > 10)
  throw new functions.https.HttpsError('invalid-argument','product name must be no more than 10 characters long');
if (isPictureValid(data.url) === false)
throw new functions.https.HttpsError('invalid-argument','url format must be png or jpg ');
if (isPictureValid(data.url) === false)
throw new functions.https.HttpsError('invalid-argument','url format must be png or jpg ');
if (isAmountValid(data.amount) === false)
throw new functions.https.HttpsError('invalid-argument','amount field is not a number or not a positive number ');
if (isPriceValid(data.price) === false)
throw new functions.https.HttpsError('invalid-argument','price field is not a number between 0 to 1000');
if (isDateValid(data.date) === false)
throw new functions.https.HttpsError('invalid-argument','date is not in the right format - “mm/dd/yyyy”');
}
//add new product
exports.addProduct = functions.https.onCall((data, context) => {
  if (!context.auth)
    throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add products');
  checkData(data);
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
        'product not added'
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

/*
//add new product
exports.addToCart = functions.https.onCall((data, context) => {
  console.log(data.uid);
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can add products to cart'
    );
  }
  const ref = firebase.firestore().collection('carts');
  ref.onSnapshot(snapshot => {
    let carts = [];
    console.log(data.uid);
    snapshot.forEach(doc => {
      if(doc.data().uid===data.uid)
      carts.push({...doc.data(), id:doc.id});
    });
    console.log(carts);
    return admin.firestore().collection('carts').add({
      name: data.name,
      manufacturer: data.manufacturer,
      amount: data.amount,
      price: data.price,
      kashrut: data.kashrut,
      category: data.category,
      expiryDate: data.expiryDate
  }).then(() => {
      return 'new product added';
  }).catch(() => {
      throw new functions.https.HttpsError(
          'internal',
          'product not added'
      );
  });
  });
*/
exports.ourNewUserSignUp = functions.https.onCall((data, context) => {
  console.log(data.user);
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
          );
  }
  return admin.firestore().collection('users').doc(data.user).set({
    email: data.email,
    password: data.password,
    isStudent:data.isStudent,
    url:data.url
  }).then(() => {
    return 'user added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'internal',
        'user not added'
    );
});
});

// // upvote callable function
/*
exports.upvote = functions.https.onCall(async (data, context) => {
  // check auth state
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated', 
      'only authenticated users can vote up requests'
    );
  }
  // get refs for user doc & request doc
  const user = admin.firestore().collection('users').doc(context.auth.uid);
  const request = admin.firestore().collection('requests').doc(data.id);
  const doc = await user.get();
  // check thew user hasn't already upvoted
  if(doc.data().upvotedOn.includes(data.id)){
    throw new functions.https.HttpsError(
      'failed-precondition', 
      'You can only vote something up once'
    );
  }

  // update the array in user document
  await user.update({
    upvotedOn: [...doc.data().upvotedOn, data.id]
  });

  // update the votes on the request
  return request.update({
    upvotes: admin.firestore.FieldValue.increment(1)
  });

});
*/

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


exports.setStudentApproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }

   /*eslint no-useless-catch:*/
  const userProfile =  await admin.auth().getUserByEmail(data.email);
  try {
  const result =await  admin.firestore().collection('users').doc(userProfile.uid).update({isStudent:true});
    return "updated";
  } catch(e){
    throw e
  }
});


exports.setDelivered = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  
  try {
  const result =await  admin.firestore().collection('transactions').doc(data.id).update({delivered:true});
    return "delivery updated";
  } catch(e){
    throw e
  }
});

exports.editProduct = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  
  try {
  const result =await  admin.firestore().collection('products').doc(data.id).update({amount:data.amount,price:data.price});
    return "product edited";
  } catch(e){
    throw e
  }
});
exports.setStudentDisapproval = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  
  const userProfile =  await admin.auth().getUserByEmail(data.email);
  try {
  const result =await  admin.firestore().collection('users').doc(userProfile.uid).update({url:""});
    return "updated";
  } catch(e){
    throw e
  }
});

exports.addToCart = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  try {
    const result =await  admin.firestore().collection('carts').doc(data.uid).update({mycart:data.mycart});
      return "updated";
    } catch(e){
      throw e
    }
  });
  
  exports.addNewCart = functions.https.onCall((data,context) =>{

    return admin.firestore().collection('carts').doc(data.uid).set({
      mycart:data.mycart
    }).then(() => {
      return 'new cart added';
  }).catch(() => {
      throw new functions.https.HttpsError(
          'cart not added'
      );
  });
  });


  exports.addTransaction = functions.https.onCall((data,context)=>{
  if (!context.auth)
    throw new functions.https.HttpsError('unauthenticated', 'only authenticated users can add products');
  return admin.firestore().collection('transactions').add({mycart:data.mycart,firstname:data.firstname,lastname:data.lastname,address:data.address,email:data.email,cardtype:data.cardtype,ownerid:data.ownerid,ownername:data.ownername,cardnumber:data.cardnumber,cvc:data.cvc,expirydate:data.expirydate,delivered:false,totalPrice:data.totalPrice}).then(() => {
    return 'new transaction added';
}).catch(() => {
    throw new functions.https.HttpsError(
        'transaction not added'
    );
});
});

function checkCVC(cvc){
  if(cvc.length !== 3){
    return false;
  }
  return true;
}

function valid_credit_card(value) {
  // Accept only digits, dashes or spaces
    if (/[^0-9-\s]+/.test(value)) return false;

    // The Luhn Algorithm. It's so pretty.
    let nCheck = 0, bEven = false;
    value = value.replace(/\D/g, "");

    for (var n = value.length - 1; n >= 0; n--) {
        var cDigit = value.charAt(n),
              nDigit = parseInt(cDigit, 10);

        if (bEven && (nDigit *= 2) > 9) nDigit -= 9;

        nCheck += nDigit;
        bEven = !bEven;
    }

    return (nCheck % 10) === 0;
}

function validateCardNumber(number) {
    var regex = new RegExp("^[0-9]{16}$");
    if (!regex.test(number))
        return false;

    return true;
}

function luhnCheck(val) {
    var sum = 0;
    for (var i = 0; i < val.length; i++) {
        var intVal = parseInt(val.substr(i, 1));
        if (i % 2 === 0) {
            intVal *= 2;
            if (intVal > 9) {
                intVal = 1 + (intVal % 10);
            }
        }
        sum += intVal;
    }
    return (sum % 10) === 0;
}

function validDate(dValue) {
  dValue = dValue.split('/');
  var pattern = /^\d{2}$/;

  if (dValue[0] < 1 || dValue[0] > 12)
      return false;

  if (!pattern.test(dValue[0]) || !pattern.test(dValue[1]))
      return false;

  if (dValue[2])
      return false;

  return true;
}

exports.updateStock = functions.https.onCall(async (data, context) => {
  if (!context.auth) {
    throw new functions.https.HttpsError(
      'unauthenticated'
    );
  }
  try {
  const result =await  admin.firestore().collection('products').doc(data.id).update({amount:data.amount});
    return "updated";
  } catch(e){
    throw e
  }
});