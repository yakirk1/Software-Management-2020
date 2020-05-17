var expect = require('chai').expect
const assert = require('assert');

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
          if (i % 2 == 0) {
              intVal *= 2;
              if (intVal > 9) {
                  intVal = 1 + (intVal % 10);
              }
          }
          sum += intVal;
      }
      return (sum % 10) == 0;
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

describe('checkCVC', () => {
    describe('#checkCVC', () => {
        it('CVC in the right format XXX', () => {
            expect(checkCVC("363")).to.be.eql(true)
        })
        it('CVC is not in the right format ', () => {
            expect(checkCVC("123456")).to.be.eql(false)
        })
    });
})


describe('validateCardNumber', () => {
    describe('#validateCardNumber', () => {
        it('card number should contain 16 digits', () => {
            expect(validateCardNumber("1234567891234567")).to.be.eql(true)
        })
        it('validate_creditcardnumber is not in the right format ', () => {
            expect(validateCardNumber("1111111")).to.be.eql(false)
        })
    });
})

describe('validDate', () => {
    describe('#validDate', () => {
        it('card valid date format should be mm/yy', () => {
            expect(validDate("12/22")).to.be.eql(true)
        })
        it('card valid date is not in the right format mm/yy ', () => {
            expect(validDate("222")).to.be.eql(false)
        })
    });
})
