var expect = require('chai').expect
const assert = require('assert');
const { AssertionError } = require('assert');


function isEmailValid(email){
   email+="";
   index=email.indexOf("@");
     var check=email.substring(index+1,email.length);
   var re=/^[a-zA-Z0-9]+[@]/;
   if (re.test(email)===false || (check!=="gmail.com"&& check!=="hotmail.com"&&check!=="ymail.com")) {
     throw "email or password are invalid";
   }
   return true;
 }

describe('Email', () => {
    describe('#checkValid', () => {
        it('should have valid ending', () => {
            expect(isEmailValid("abc@gmail.com")).to.be.eql(true)
        })

        it('throws an error when there is no one @', () => {
            try {
              isEmailValid("abgmail.com"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });

          it('throws an error when there is more than one @', () => {
            try {
              isEmailValid("ab@@gmail.com"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });

          it('throws an error when there is invalid ending', () => {
            try {
              isEmailValid("ab@gmail.comm"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });

          it('throws an error when there is no characters before @', () => {
            try {
              isEmailValid("@gmail.comm"); 
              assert.fail('expected exception not thrown'); 
            } catch (e) { 
              assert.equal(e, 'email or password are invalid');
            }
          });
    })
})


