var expect = require('chai').expect
const assert = require('assert');



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

describe('Password', () => {
    describe('#checkValid', () => {
        it('contain 7 characters', () => {
            expect(isPassValid("ABCJSK1")).to.be.eql(true)
        })

        it('contain 12 characters', () => {
            expect(isPassValid("ABCJSKADSQ1")).to.be.eql(true)
        })

        it('should contain at least one numerical character', () => {
            expect(isPassValid("aaaaaa1")).to.be.eql(true)
        })

        it('throws an error when contains 6 characters', () => {
            try {
                isPassValid("abcfs2"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });

          it('throws an error when contains 13 characters', () => {
            try {
              isEmailValid("abcasew123fs2"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });

          it('throws an error when there is no numerical character', () => {
            try {
              isEmailValid("asdkjask"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });
    })
})

