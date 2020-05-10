const authSwitchLinks = document.querySelectorAll('.switch');
const authModals = document.querySelectorAll('.auth .modal');
const authWrapper = document.querySelector('.auth');
const loginForm = document.querySelector('.login');
const signOut = document.querySelector('.sign-out');
const adminElements = document.querySelectorAll('.admin');
const userElements = document.querySelectorAll('.user');

 function isEmailValid(email){
   console.log(email);
   email+="";
  index=email.indexOf("@");
	var check=email.substring(index+1,email.length);
  var re=/^[a-zA-Z0-9]+[@]/;
  if (re.test(email)===false || (check!=="gmail.com"&& check!=="hotmail.com"&&check!=="ymail.com")) {
    throw "email or password are invalid";
  }
  return true;
}

function isPassValid(password){
  var count=0;
  var re=/^[a-z0-9]+$/i;
	for(var i=0;i<password.length;i++){
		if(!isNaN(Number(password[i])))
			count++;
	}
  if ((password.length<7 || password.length>12)||re.test(password)===false||count===0)
  {
    throw "email or password are invalid"
  }
  return true;
}

authSwitchLinks.forEach(link => {
  link.addEventListener('click', () => {
    authModals.forEach(modal => modal.classList.toggle('active'));
    loginForm.querySelector('.error').textContent="";
    registerForm.querySelector('.error').textContent = "";
    registerForm.reset();
    loginForm.reset();

  });
});

// register form
registerForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = registerForm.email.value;
  const password = registerForm.password.value;
  const checkBox = document.getElementById("checkbox");

  try{
  if(isEmailValid(email) == true && isPassValid(password)==true){
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(user => {
      const ourNewUserSignUp= firebase.functions().httpsCallable('ourNewUserSignUp');
      ourNewUserSignUp({
        user:user.user.uid,
        email:email,
        password:password,
        isStudent:checkBox.checked
      })
      .then(() =>{
        console.log('registered', user);
        registerForm.reset();
        registerForm.querySelector('.error').textContent ="";

      });
    })
    .catch(error => {
      registerForm.querySelector('.error').textContent = error.message;
    });
  }
} catch(error){
  registerForm.querySelector('.error').textContent = error;
}
})