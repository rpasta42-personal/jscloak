

//////////////not very generic

var inflation_rate = 0.03;

//getNextAccountDate(currDate)
function getNextAccountDateFunc(payFreq) {

   if (payFreq == 'Daily')
      return (currDate) => currDate.clone().add(1, 'day');
   else if (payFreq == 'Weekly')
      return (currDate) => currDate.clone().add(1, 'week');
   else if (payFreq == 'Bi-Weekly')
      return (currDate) => currDate.clone().add(2, 'week');
   else if (payFreq == 'Monthly')
      return (currDate) => currDate.clone().add(1, 'month');
   else if (payFreq == 'Quarterly')
      return (currDate) => currDate.clone().add(1, 'quarter');
   else if (payFreq == 'Annually')
      return (currDate) => currDate.clone().add(1, 'year');
   else { //default increment by 1 month
      var msg = 'getNextAccountDateFunc(): unknown payFreq';
      //console.info(msg, payFreq);
      return (currDate) => currDate.clone().add(1, 'month');
   }
}


function enum_owner(otype) {
   var options = ['Me', 'Spouse', 'Joint'];
   return enum_helper(options, otype);
}

//interest passed as percent
function get_pay_freq_mul(pf_type) {
   //pf_type = bpApi.enum_pay_freq(pf_type);
   if (pf_type == 'Daily')
      return 365.0;
   if (pf_type == 'Weekly') //pf_type = 1
      return 52; //4 * 12;
   else if (pf_type == 'Bi-Weekly') //2
      return 52.0/2.0; //2 * 12;
   else if (pf_type == 'Monthly') //3
      return 12;
   else if (pf_type == 'Quarterly') //4
      return 4;
   else if (pf_type == 'Annually') //5
      return 1;
   else {
      console.log('get_pay_freq_mul(' + pf_type + '): pf_type not recognized');
      return 12; //assume monthly
      return null;
   }
}

function convertAmountFreq(amount, curr_freq, needed_freq) {
   var toYearMult = get_pay_freq_mul(curr_freq);
   var fromYearDiv = get_pay_freq_mul(needed_freq);

   return (amount * 1.0 * toYearMult) / fromYearDiv;
}

function payFreqToDesc(pf_type) {
   pf_type = parseInt(pf_type);
   var options = ['day', 'week', '2 weeks', 'month', 'quarter', 'year'];
   return enum_helper(options, pf_type);
}

function normalizePayment(payment, pay_freq) {
   var mult = get_pay_freq_mul(parseInt(pay_freq));
   return parseInt(payment) * mult;
}

//////////////end not very generic





function timestampToMoment(timestamp) {
   if (timestamp == null)
      return timestamp;
   var jsDate = new Date(timestamp*1000);
   var momentDate = moment(jsDate);
   return momentDate;
}

function momentToTimestamp(mom) {
   if (mom == null)
      return mom;
   var unixStamp = mom.format('X');
   //var isoDate = mom.toISOString();
   return unixStamp;
}


//var _getEmptyDash_cache = {}; //key=val+needEmptyDash
function getEmptyDash(val, needEmptyDash) {
   if (needEmptyDash) {
      if (typeof(val) === undefined
          || val == null
          || typeof(val.length) === undefined
          || val.length == 0
          || val == 'None')
         return '-';
   }
   return val;
}



//should capitalize each word but for now only capitalizes first letter
function capitalizeTitle(text) {
   if (text == null)
      return null;
   var ret = text[0].toUpperCase();
   ret += text.substring(1);
   return ret;
}




//given number of years, returns number of years and month rounded up
function formatYearMonth(days) {
   var rem_from_years = days % 365;
   var months = Math.floor(rem_from_years / 30);
   //var months = Math.ceil(rem_from_years / 30);
   var years = (days - rem_from_years) / 365;


   var years_txt = years + ' years';
   var months_txt = months + ' months';

   if (months < 1 && years < 1)
      return '0 months'; //return Math.floor(days) + ' days';
   if (months > 0 && years > 0)
      return years_txt + ' and ' + months_txt;
   if (years > 0 && months < 1)
      return years_txt;
   else if (months >= 1 && years < 1)
      return months_txt;

   return 'formatYearsMonths(): error';
}

function formatDate(date) {
   var hours = date.getHours();
   var am_or_pm = null;
   if (hours > 12)
      hours -= 12;
   if (hours < 10)
      hours = '0' + hours;

   if (hours >= 1 && hours < 12)
      am_or_pm = 'AM';
   if (hours >= 12 && hours < 24)
      am_or_pm = 'PM';

   var minutes = date.getMinutes();
   if (minutes < 10)
      minutes = '0' + minutes;

   //we don't need seconds so first version doesn't work well
   //var time = date.toDateString() + ' ' + date.toLocaleTimeString();
   //var time = date.toDateString() + ' ' + hours + ':' + minutes + am_or_pm;

   var datePart = date.toDateString();
   var datePartLen = datePart.length;
   var datePartYear = datePart.substring(datePartLen - 2, datePartLen);
   var datePartOther = datePart.substring(0, datePartLen - 3 - 2);

   var month = date.getMonth();
   if (month < 10)
      month = '0' + month;

   var datePart = datePartOther + '/' + month + '/' + datePartYear; //+ ' ' +

   var datetime = sprintf('%i:%i %s %s', hours, minutes, am_or_pm, datePart);
   return datetime;
}

//missing_prepend (is empty or 0: no extra text, 1 = add __missing__{b/l/f}, 2 = add text
function formatName(first, last, missing_prepend) {
   if (missing_prepend === undefined)
      missing_prepend = 0;

   var extra = null, extra_first = null, extra_last = null;

   if (missing_prepend == 0)
      extra = extra_first = extra_last = '';
   else if (missing_prepend == 1) {
      extra = extra_first = extra_last = '__missing__';
      extra += 'b'; //both
      extra_first += 'l'; //l means missing last name
      extra_last += 'f'; //f means missing first name
   }
   else if (missing_prepend == 2) {
      extra_first = ' (missing lastname)';
      extra_last = ' (missing firstname)';
   }

   var fullName = sprintf('%s %s', first, last);

   if ((first == null || first.trim() == '') && (last == null || last.trim() == ''))
      fullName = extra;
   else if (first == null || first.trim() == '')
      fullName = last + extra_last;
   else if (last == null || last.trim() == '')
      fullName = first + extra_first;

   return fullName.trim();
}

const jutils = require('../src/utils.js');

var _filterNumsFromStr_nums = '1234567890.'.split('');
function filterNumsFromStr(str) {
   var nums = _filterNumsFromStr_nums;
   var ret_str = '';
   str = String(str);
   //var ret_arr = [];

   for (var i in str) {
      var c = str[i];
      if (jutils.contains(nums, c))
         //ret_arr.push(c);
         ret_str += c;
   }
   //return ret_arr.join('');
   return ret_str;
}


var alwaysAddZeroDollars = true;

//key: num+shouldDash
var _formatDollars_cache = {};
function formatDollars(num, shouldDash) {
   //var key = (shouldDash ? '1' : '0') + num;
   var key = num;
   if (key in _formatDollars_cache)
      return _formatDollars_cache[key];

   if (shouldDash)
      num = getEmptyDash(num, true);

   if (num == '-')
      return num;

   var str_num = filterNumsFromStr(String(num));

   var decimal = str_num.split('.');
   var isFloat = false;
   if (decimal.length > 1) {
      isFloat = true;
      str_num = decimal[0];
   }

   str_num = '' + str_num;
   var new_str = '';
   var count3s = 0;
   for (var i = str_num.length-1; i >= 0; i--) {
      var extraStr = '';
      if (count3s++ == 3) {
         count3s = 1;
         extraStr = ',';
      }
      new_str = str_num[i] + extraStr + new_str;
   }
   new_str = '$' + new_str;

   if (isFloat) {
      decimal[1] = decimal[1].substring(0, 2); //TODO: fixme

      if (decimal[1].length == 1)
         decimal[1] += '0';
      new_str += '.' + decimal[1];
   }

   if (alwaysAddZeroDollars) {
      var new_str_len = new_str.length;
      if (new_str[new_str_len-3] != '.')
         new_str += '.00';
   }

   _formatDollars_cache[key] = new_str;
   return new_str;
}

//TODO: format_phone_parens or add flag for parenthesis around area code
function formatPhone(phone_str) {
   var good_phone = filterNumsFromStr(phone_str);

   if (good_phone.length < 10)
      return good_phone;

   if (good_phone.length > 11)
      return good_phone;

   var extra = '';
   if (good_phone.length == 11) {
      extra = phone_str[0] + '-';
      phone_str = good_phone.substring(1);
   }

   //return good_phone;
   return sprintf('%s%s-%s-%s', extra, good_phone.substring(0, 3), good_phone.substring(3, 6), good_phone.substring(6, 10));

}

var alwaysAddZeroPercent = true;

function formatPercent(percent, shouldDash) {

   if (shouldDash)
      percent = getEmptyDash(percent, true);

   var percent_str = filterNumsFromStr(String(percent));
   var decimal = percent_str.split('.');

   var ret = null;

   if (decimal.length > 1)
      ret = decimal[0] + '.' + decimal[1].substring(0, 2); //TODO: fixme
   else
      ret = percent_str;

   if (alwaysAddZeroPercent) {
      if (!(decimal.length > 1))
         ret += '.00';
      else if (decimal[1].length == 1)
         ret += '0';
   }

   return ret + '%';
}

function formatMomentDate(d) {
   return d.format('MMM Do YYYY');
}




////////////////


function getNumDaysInEachMonth(monthN) { //0-indexed month, returns number (1-indexed)
   var numDays = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
   return numDays[monthN];
}

//list with days of the year (represented by index 0-364) which payment is made
function payFreqToDayList(pay_freq) {
   pay_freq = bpApi.enum_pay_freq(pay_freq);

   if (pay_freq == 'Anually')
      return [364];

   var month = 0;
   var currMonthDay = 0;
   var currMonthNumDays = getNumDaysInEachMonth(month++);
   var ret = [];
   for (var i = 0; i < days_in_year; i++) {
      currMonthDay++;

      if (pay_freq == 'Weekly' && (i % 7 == 0))
         ret.push(i);
      else if (pay_freq == 'Bi-Weekly' && (i % 14 == 0))
         ret.push(i);

      if (currMonthDay == currMonthNumDays) {
         currMonthDay = 0;
         currMonthNumDays = getNumDaysInEachMonth(month);

         if (pay_freq == 'Monthly')
            ret.push(i);
         else if (pay_freq == 'Quarterly' && contains([2, 5, 8, 11], month))
            ret.push(i);

         month++;
      }
      //else if (pay_freq == 'Anually' && i == 364) ret.push(i)
   }

   return ret;
}



function _BuzUtils() {
   this.momentToTimestamp = momentToTimestamp;
   this.timestampToMoment = timestampToMoment;
   this.formatDate = formatDate;
   this.formatMomentDate = formatMomentDate;
   this.formatName = formatName;
   this.formatPhone = formatPhone;
   this.formatDollars = formatDollars;
   this.getEmptyDash = getEmptyDash;
   this.formatPercent = formatPercent;
   this.payFreqToDesc = payFreqToDesc;
   this.capitalizeTitle = capitalizeTitle;
   this.formatYearMonth = formatYearMonth;
   this.convertAmountFreq = convertAmountFreq;
   return this;
}


function inNode() {
   return (typeof module !== 'undefined' && module.exports);
}

var BuzUtils = new _BuzUtils();

(function() {
   var root = this;

   if (inNode()) {
      //module.exports.func = func;
      module.exports = BuzUtils;
      root.BuzUtils = BuzUtils;
   }
   else {
      //this.func = func;
      root.Utils = Utils;
   }

})();



