function getStock(code,obj) {
  var query_str = "";
  if(code.match(/^002/) || code.match(/^000/))
     query_str = "1"+code;
  else if(code.match(/^601/) || code.match(/^600/)) 
     query_str = "0"+code;
  else
     return;
  var sh_a = "0" + "000001"; // shanghai zhishu
  var sz_a = "1" + "399001"; // shenzhen zhishu
  var cy_a = "1" + "399006"; // chuangye bazhi
  var main_a = sh_a + "," + sz_a + "," + cy_a +",";
  var query_site = "http://api.money.126.net/data/feed/" + main_a + query_str + ",money.api";
  console.log(query_site);
  var result="";
  $.ajax({type:'GET',url:query_site,async:true,jsonpCallback:"jsonCallback",
          contentType:"application/json",dataType:"jsonp",
          success:function(data) {
             var sh_json = data[sh_a]; 
             var sz_json = data[sz_a];
             var cy_json = data[cy_a];
             var cx_json = data[query_str];
             $("#item_stock").text(cx_json['name']);
             $("#item_value").text(cx_json['price'].toFixed(2));
             $("#sh_v").text(sh_json['price'].toFixed(2));
             $("#sz_v").text(sz_json['price'].toFixed(2));
             $("#cy_v").text(cy_json['price'].toFixed(2));
             $("#item_rate").text(paraUpdated(cx_json));
             $("#sh_r").text(((sh_json['percent']>=0)?"+":"") + floatSlice(sh_json['percent'])+"%");
             $("#sz_r").text(((sz_json['percent']>=0)?"+":"") + floatSlice(sz_json['percent'])+"%");
             $("#cy_r").text(((cy_json['percent']>=0)?"+":"") + floatSlice(cy_json['percent'])+"%");
             $("#item_content").children().css({"color":(cx_json['percent']>=0?"red":"green")});
             $("#main_sh span").children().css({"color":(sh_json['percent']>=0?"red":"green")});
             $("#main_sz span").children().css({"color":(sz_json['percent']>=0?"red":"green")});
             $("#main_cy span").children().css({"color":(cy_json['percent']>=0?"red":"green")});
             obj.addClass("selected").siblings().removeClass("selected");
          },
          error:function(e) {
            console.log("ajax error");
            //alert("AJAX Error");
          }
     });
}

function floatSlice(in_a){
   var datax100 = in_a * 100;
   return datax100.toFixed(2);
}

function autoUpdated(){
  $("#item_name a").each(function(){
    if($(this).hasClass("selected")) {
      getStock($(this).find("span").text(),$(this));
    }
  });
}

function paraUpdated(obj) {
  var str="";
  str += (obj['percent']>=0) ? "+" : "";
  str += floatSlice(obj['percent']) + "%";
  str += "  ,  ";
  str += (obj['updown']>=0) ? "+" : "";
  str += obj['updown'];
  return str;
}

