NASA = window.NASA || {};

/*
 * @link https://raw.github.com/kvz/phpjs/master/functions/var/serialize.js
 */
NASA.serialize = function(mixed_value) {
  // *     example 2: serialize({firstName: 'Kevin', midName: 'van', surName: 'Zonneveld'});
  // *     returns 2: 'a:3:{s:9:"firstName";s:5:"Kevin";s:7:"midName";s:3:"van";s:7:"surName";s:9:"Zonneveld";}'
  var val, key, okey, ktype = '',
    vals = '',
    count = 0,
    _utf8Size = function(str) {
      var size = 0,
        i = 0,
        l = str.length,
        code = '';
      for (i = 0; i < l; i++) {
        code = str.charCodeAt(i);
        if (code < 0x0080) {
          size += 1;
        } else if (code < 0x0800) {
          size += 2;
        } else {
          size += 3;
        }
      }
      return size;
    },
    _getType = function(inp) {
      var match, key, cons, types, type = typeof inp;

      if (type === 'object' && !inp) {
        return 'null';
      }
      if (type === 'object') {
        if (!inp.constructor) {
          return 'object';
        }
        cons = inp.constructor.toString();
        match = cons.match(/(\w+)\(/);
        if (match) {
          cons = match[1].toLowerCase();
        }
        types = ['boolean', 'number', 'string', 'array'];
        for (key in types) {
          if (cons == types[key]) {
            type = types[key];
            break;
          }
        }
      }
      return type;
    },
    type = _getType(mixed_value);

  switch (type) {
    case 'function':
      val = '';
      break;
    case 'boolean':
      val = 'b:' + (mixed_value ? '1' : '0');
      break;
    case 'number':
      val = (Math.round(mixed_value) == mixed_value ? 'i' : 'd') + ':' + mixed_value;
      break;
    case 'string':
      val = 's:' + _utf8Size(mixed_value) + ':"' + mixed_value + '"';
      break;
    case 'array':
    case 'object':
      val = 'a';
      /*
       if (type === 'object') {
       var objname = mixed_value.constructor.toString().match(/(\w+)\(\)/);
       if (objname == undefined) {
       return;
       }
       objname[1] = this.serialize(objname[1]);
       val = 'O' + objname[1].substring(1, objname[1].length - 1);
       }
       */

      for (key in mixed_value) {
        if (mixed_value.hasOwnProperty(key)) {
          ktype = _getType(mixed_value[key]);
          if (ktype === 'function') {
            continue;
          }

          okey = (key.match(/^[0-9]+$/) ? parseInt(key, 10) : key);
          vals += this.serialize(okey) + this.serialize(mixed_value[key]);
          count++;
        }
      }
      val += ':' + count + ':{' + vals + '}';
      break;
    case 'undefined':
    // Fall-through
    default:
      // if the JS object has a property which contains a null value, the string cannot be unserialized by PHP
      val = 'N';
      break;
  }
  if (type !== 'object' && type !== 'array') {
    val += ';';
  }
  return val;
}

NASA.openWindow = function(url) {
  if (url != '#') {
    var positionX = screen.width;
    var positionY = ((screen.height)/2);

    var sizeX = 720;
    var sizeY = 640;

    var strWindowFeatures = '';
    strWindowFeatures += 'menubar=yes,location=yes,toolbar=yes,directories=yes,scrollbars=yes,status=yes,resizable=yes,outerWidth='+720+',outerHeight='+640+',width='+720+'height='+640+',left='+80+',top='+60+'screenX='+80+',screenY='+60;
    winPopupWindow = window.open(url, 'NASAWindow', strWindowFeatures);
    winPopupWindow.focus();
  }
}

NASA.openVideoWindow = function(param1, param2, param3,title,imageName, assetId) {
  var myname = 'NASAOnDemandTV';
  var w = 800;
  var h = 550;

  /*var param=param1;
   alert('param '+param);
   if(  param2!='undefined' && param2!=eval('') && param2!=null && param2!='' )
   { param+='|'+param2;
   }
   alert('param '+param);
   if( param3!='undefined' && param3!=eval('') && param3!=null && param3!='' )
   { param+='|'+param3;
   }*/

  var isparam1;
  var isparam2;
  var isparam3;

  if(  param1!='undefined' && param1!=eval('') && param1!=null && param1!='' )
    isparam1 = 'true';
  if(  param2!='undefined' && param2!=eval('') && param2!=null && param2!='' )
    isparam2 = 'true';
  if( param3!='undefined' && param3!=eval('') && param3!=null && param3!='' )
    isparam3 = 'true';

  var param='';
  if (isparam1 == 'true')
  {
    param=param1;
  }

  if (isparam2 == 'true')
  {
    if (isparam1 == 'true')
      param+='|'+param2;
    else
      param=param2;
  }

  if (isparam3 == 'true')
  {
    if (isparam1 == 'true' || isparam2 == 'true')
      param+='|'+param3;
    else
      param=param3;
  }


  //alert('param '+param);

  if(imageName == null || imageName ==eval('') || imageName == 'undefined' || imageName == 'null')
  {
    imageName = 'test.gif';
  }

  param += '&_id=' +  assetId;

  if(title != null || title != eval('') || title != 'undefined')
  {
    title = escape(title);
    param +='&_title=' + title;
  }

  if(imageName != null || imageName != eval('') || imageName != 'undefined')
  {
    param +='&_tnimage=' + imageName;
  }
  // alert('param '+param);
  var mypage = 'http://www.nasa.gov/multimedia/nasatv/on_demand_video.html?param='+param;
  //alert(' mypage ' + mypage);

  var winl = (screen.width - w) / 2;
  var wint = (screen.height - h) / 2;
  winprops = 'height='+h+',width='+w+',top='+wint+',left='+winl+',scrollbars=no,resizable=no';
  win = window.open(mypage, myname, winprops);
}
