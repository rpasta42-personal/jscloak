

var serv_url = null;

function set_serv_url(new_url) {
   serv_url = new_url;
}

function get_serv_url() {
   return serv_url;
}

function is_undef(x) {
   return x == undefined;
}

function undef_default(givenVal, defaultVal) {
   if (is_undef(givenVal))
      return defaultVal;
   else
      return givenVal;
}


function isStr(x) {
   return (typeof x === 'string' || x instanceof String);
}


function defaultFail() {
   console.log('post or get failed');
   return null;
}

function _rawGet(url, callback_succ, callback_fail) {
   if (callback_fail === undefined)
      callback_fail = defaultFail;
   return $.get(url, callback_succ).fail(callback_fail);

   /*return $.ajax({
      type: 'GET',
      contentType: "application/json; charset=utf-8",
      url : url,
      success : callback_succ,
      error : callback_fail
   });*/
}

function _rawPost(url, callback_succ, callback_fail) {
   if (callback_fail === undefined)
      callback_fail = defaultFail;
   return $.post(url, callback_succ).fail(callback_fail);
}

//request specific data from server
//if dataToget is string, send serv?data=blah,
//otherwise we need dictionary of parameters
function reqData(dataToGet, succ, fail, postOrGet) { //, url1) {
   if (fail === undefined)
      callback_fail = defaultFail;

   if (postOrGet === undefined)
      postOrGet = 'get';
   else if (postOrGet != 'post' && postOrGet != 'get')
      postOrGet = 'get';

   var req_f = null;
   if (postOrGet == 'post')
      req_f = _rawPost;
   else if (postOrGet == 'get')
      req_f = _rawGet;

   /*var req_str = null;
   if (url1 == null)
      req_str = serv_url + 'api?';
   else
      req_str = url1 + '?';*/
   var req_str = serv_url + 'api?';

   if (isStr(dataToGet)) {
      req_str += 'data=' + dataToGet;
      return req_f(req_str, succ, fail);
   }
   var needAndSign = false;
   for (var paramName in dataToGet) {
      if (needAndSign)
         req_str += '&';
      req_str += paramName + '=' + dataToGet[paramName];
      needAndSign = true;
   }

   return req_f(req_str, succ, fail);
}

function getData(dataToGet, succ, fail) {
   return reqData(dataToGet, succ, fail, 'get');
}
function postData(dataToGet, succ, fail) {
   return reqData(dataToGet, succ, fail, 'post');
}

var DEBUG = true;

function getApiData(req, onSucc, onErr) {
   var method = 'getApiData(' + req.type + ') ';

   if (onErr === undefined) {
      onErr = function(res) { console.log(method + ' placeholder onErr()'); };
   }

   function succ_callback(res) {
      var data = JSON.parse(res);

      /*console.log('kkkkzzzz:', res);
      var res_to_parse = (' ' + res).slice(1);
      var res_to_parse = res_to_parse.replace(/u'(?=[^:]+')/g, "'");

      var data = JSON.parse(res_to_parse); //jQuery.parseJSON(res_to_parse); //JSON.parse(res_to_parse);
      console.log('zzzzkkkk:', data);
      alert(JSON.stringify(data)); */

      if (!data['success']) {
         if (DEBUG) { console.error('getApiData(' + req.type + ')\n\tbad request: ', res); }
         return onErr(data);
      }


      //if (DEBUG) { console.info('getApiData(' + req.type + ')\n\tsuccess: ', data); }

      onSucc(data);
   }
   function fail_callback(res) {
      if (DEBUG) {console.log('getApiData' + req.type + '(): $.ajax() failure'); console.log(res);}
      var data = {'success':false,'code':15,'method':'getApiData', extra:res};
      return onErr(data);
   }
   return getData(req, succ_callback, fail_callback);
}

/*function getApiDataJ(type, json_data, onSucc, onErr) {
   var url = serv_url + 'api?type=' + type;
   $.ajax({url : url,});
}*/

function postApiDataOld(req, onSucc, onErr) {
   function succ_callback(res) {
      alert(res);
      //var data = JSON.parse(res);
      onSucc(data);
   }
   if (onErr === undefined)
      onErr = function(res) { console.log('postApiData fail'); return 0; }
   return postData(req, succ_callback, onErr);
}

function postApiData(type, data, onSucc, onErr) {
   function succ_callback(res) {
      //alert(res);
      var data = JSON.parse(res);
      onSucc(data);
   }
   if (onErr === undefined)
      onErr = function (res) { console.log('postApiData fail'); return 0; }

   var dataDict = { 'value' : JSON.stringify(data) }
   var url = serv_url + 'api?type=' + type;
   //return $.post(serv_url + 'api?type=' + type, dataDict, succ_callback);
   return $.post(url, dataDict, succ_callback);
}

function redirect(url) {
   window.location.href = url;
}


function enum_helper(enum_list, enum_arg, to_index) {
   if (typeof(to_index) === undefined)
      to_index = null;

   var options = [];
   for (var i in enum_list) {
      var option = enum_list[i].toLowerCase();
      options.push(option);
   }

   if (to_index == null) {
      if (typeof(enum_arg) == undefined)
         return null;
      else if (typeof(enum_arg) == 'string')
         to_index = true;
      else if (typeof(enum_arg) == 'number')
         to_index = false;
      else
         return null;
   }

   if (to_index)
      return options.indexOf(enum_arg.toLowerCase());
   else
      return enum_list[enum_arg];
}

function contains(lst, el) {
   for (var i in lst) {
      if (lst[i] == el)
         return true;
   }
   return false;
}

function getKeyList(dict) {
   var ret = [];
   for (var key in dict)
      ret.push(key);
   return ret;
}

function getEntryList(dict) {
   var ret = [];
   for (var key in dict)
      ret.push(dict[key]);
   return ret;
}

function loadCss(code) {
   $('head').append('<style>' + code + '</style>');
}





function _MiscUtils() {
   this.set_serv_url = set_serv_url;
   this.get_serv_url = get_serv_url;
   this.is_undef = is_undef;
   this.undef_default = undef_default;

   this.isStr = isStr;
   this._rawGet = _rawGet;
   this.reqData = reqData;
   this.getData = getData;
   this.getApiData = getApiData;
   //this.getApiDataJ = getApiDataJ;
   this.postApiData = postApiData;
   this.redirect = redirect;
   this.enum_helper = enum_helper;

   //contains, getKeyList, getEntryList

   this.loadCss = loadCss;
   return this;
}


function inNode() {
   return (typeof module !== 'undefined' && module.exports);
}

var MiscUtils = new _MiscUtils();

(function() {
   var root = this;

   if (inNode()) {
      //module.exports.func = func;
      module.exports = MiscUtils;
      root.MiscUtils = MiscUtils;
   }
   else {
      //this.func = func;
      root.MiscUtils= MiscUtils;
   }

})();



