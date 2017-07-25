//############################################################################
//       sci_basic.js
//
//       by Brian Kaney, April 2015
//############################################################################

function screenPoint(x,y) {
  this.x = x;
  this.y = y;
  return;
  }

function getMouseScreenX(element_id,e) {
  var offset = document.getElementById(element_id).getBoundingClientRect();

  return Math.round(e.pageX - document.body.scrollLeft - document.documentElement.scrollLeft - offset.left);
  }

function getMouseScreenY(element_id,e) {
  var offset = document.getElementById(element_id).getBoundingClientRect();

  return Math.round(e.pageY - document.body.scrollTop - document.documentElement.scrollTop - offset.top);
  }

function getMouseScreenPoint(element_id,e) {
  var x =  getMouseScreenX(element_id,e);
  var y =  getMouseScreenY(element_id,e);

  var pt = new screenPoint(x,y);
  return pt;
  }

function canvasClear(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.clearRect(0,0,document.getElementById(canvas_id).width,document.getElementById(canvas_id).height);
  }

function drawStyle(fill_color,stroke_color,line_width,font,text_color) {
  this.fill_color = fill_color;
  this.stroke_color = stroke_color;
  this.line_width = line_width;
  this.font = font;
  this.text_color = text_color;
//  if(fill_color!="none")   this.fill_color = fill_color;
//  if(stroke_color!="none") this.stroke_color = stroke_color;
//  if(line_width!="none")   this.line_width = line_width;
//  if(font!="none")         this.font = font;
//  if(text_color!="none")   this.text_color = text_color;
  }

function variableText(value,sig_fig,units,style) {
  var message = value.toFixed(sig_fig);
  message = message.concat(" ",units);
  return message;
  }

//---below is actual version in use at SRP, some improvemens over above which I don't know is in use
function dataText(value,sig_fig,units,missing_cut_off,blank_cut_off) {
  if(arguments.length==3) { var missing_cut_off=-99;  var blank_cut_off=-999; }
  
  var message = value.toFixed(sig_fig);
  if(value<=missing_cut_off)  message = "---";
  if(units!='none') message = message.concat(" ",units);
  if(value<=blank_cut_off)  message = "";
  return message;
  }

function approxFontHeight(font) {
  if(font.indexOf('9pt')>=0)  return 9;
  if(font.indexOf('10pt')>=0)  return 10;
  if(font.indexOf('11pt')>=0 || font.indexOf('12pt')>=0)  return 12;
  return 12;
  }



function labeledValue(ctx,x,y,label,lv_gap,value,sig_fig,blank_out) {
  ctx.font = "bold 9pt Arial";
  ctx.fillStyle = "#000000";
  if(label.length>0)  ctx.fillText(label,x,y);

  var type = "none";
  var test = "none";
  if(arguments.length>7) {
    var type = parseComparisonForType(blank_out);
    var test = parseComparisonForValue(blank_out);
    }

  ctx.font = "9pt Arial";
  ctx.fillStyle = "#0000B4";
  if(makeComparison(value,type,test)==0)  ctx.fillText(value.toFixed(sig_fig),x+lv_gap,y);
  else                                    ctx.fillText("---",x+lv_gap,y);
  }



function indexOfValueInArray(value_array,test_value,not_found_flag) {
  for(var i=0;i<value_array.length;++i) {
    if(test_value==value_array[i])  return i;
    }
  if(arguments.length==3)   return not_found_flag;
  else                      return -1;
  }

/*
function valueCount(value_array,test_value,mode) {
  var cnt = 0;
  if(mode == 'gt') for(var i=0;i<value_array.length;++i) { if(value_array[i]>test_value)  ++cnt; }
  if(mode == 'ge') for(var i=0;i<value_array.length;++i) { if(value_array[i]>=test_value) ++cnt; }
  if(mode == 'lt') for(var i=0;i<value_array.length;++i) { if(value_array[i]<test_value)  ++cnt; }
  if(mode == 'le') for(var i=0;i<value_array.length;++i) { if(value_array[i]<=test_value) ++cnt; }
  if(mode == 'eq') for(var i=0;i<value_array.length;++i) { if(value_array[i]==test_value) ++cnt; }
  if(mode == 'ne') for(var i=0;i<value_array.length;++i) { if(value_array[i]!=test_value) ++cnt; }
  return cnt;
  }
*/
