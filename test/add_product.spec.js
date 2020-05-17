var expect = require('chai').expect
const assert = require('assert');

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

describe('isDateValid', () => {
    describe('#isDateValid', () => {
        it('date in the right format dd/mm/yyyy', () => {
            expect(isDateValid("12/07/1994")).to.be.eql(true)
        })
        it('date is not in the right format ', () => {
            expect(isDateValid("12/07-1994")).to.be.eql(false)
        })
    });
})

describe('isPriceValid', () => {
    describe('#isPriceValid', () => {
        it('price is between 0-1000', () => {
            expect(isPriceValid("66")).to.be.eql(true)
        })
        it('price is not between 0-1000', () => {
            expect(isDateValid("12/07-1994")).to.be.eql(false)
        })
    });
})

describe('isAmountValid', () => {
    describe('#isAmountValid', () => {
        it('price is smaller than 10', () => {
            expect(isAmountValid("9")).to.be.eql(true)
        })
        it('price is bigger than 10', () => {
            expect(isDateValid("111")).to.be.eql(false)
        })
    });
})

describe('isPictureValid', () => {
    describe('#isPictureValid', () => {
        it('The picture in the right format jpg', () => {
            expect(isPictureValid("xxx.jpg")).to.be.eql(true)
        })
        it('The picture in the right format png', () => {
            expect(isPictureValid("xxx.png")).to.be.eql(true)
        })
        it('The picture is not in the right format png or pnj', () => {
            expect(isDateValid("xxx.abc")).to.be.eql(false)
        })
    });
})




