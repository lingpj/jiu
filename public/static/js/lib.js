/**
 * Created by Administrator on 2017-5-29 029.
 */
function Fish(){
    this.check = function(str){
        var result = str !== null && str !== undefined;
        if(result === false){
            throw 'Can not pass null variable';
        }else{
            return str.toString();
        }
    };
    this.isPhone = function(str){
        str = this.check(str);
        return /^1[3578]\d{9}$/.test(str);
    };
    this.isEmail = function(str){
        str = this.check(str);
        return /[\da-z_-]{3,30}@[\da-z]{2,6}\.[a-z]{2,5}$/i.test(str);
    };
    this.isNumber = function(str){
        if(str){
            var number = new Number(str);
            return ! isNaN(number);
        }else{
            return false;
        }
    };
    this.isInteger = function(str){
        str = this.check(str);
        return /^\d+$/.test(str);
    };
    this.isFloat = function(str){
        str = this.check(str);
        return /^\d+\.\d+$/.test(str);
    };
    this.lengthBetween = function(str,min,max){
        str = this.check(str);
        var len = str.length;
        return len >= min && len <= max;
    };
    this.valueBetween = function(str,min,max){
        var number = new Number(str);
        if(isNaN(number)){
            return false;
        }else{
            return number >= min && number <= max;
        }
    };
    /**
     * if length str greater than @length
     * @param str
     * @param length
     * @returns {boolean}
     */
    this.lengthGt = function(str,length){
        str = this.check(str);
        return str.length > length;
    };
    this.lengthEgt = function(str,length){
        str = this.check(str);
        return str.length >= length;
    };
    this.lengthLt = function(str,length){
        str = this.check(str);
        return str.length < length;
    };
    this.lengthElt = function(str,length){
        str = this.check(str);
        return str.length <= length;
    };
    this.valueGt = function(str,num){
        var number = new Number(str);
        if(isNaN(number)){
            return false;
        }else{
            return number > num;
        }
    };
    this.valueEgt = function(str,num){
        var number = new Number(str);
        if(isNaN(number)){
            return false;
        }else{
            return number >= num;
        }
    };
    this.valueLt = function(str,num){
        var number = new Number(str);
        if(isNaN(number)){
            return false;
        }else{
            return number < num;
        }
    };
    this.valueElt = function(str,num){
        var number = new Number(str);
        if(isNaN(number)){
            return false;
        }else{
            return number <= num;
        }
    };
    this.isRightNumber = function(str){
        var firstLetter = (str+'').substr(0,1);
        if(firstLetter*1==0){
            return true;
        }else{
            return false;
        }
    }
}