//############################################################################
//       sci_html_elements.js
//
//       by Brian Kaney, Jan 2016
//############################################################################

function divStyle() {
  this.div_position = "absolute";
  this.div_left = "0px";
  this.div_top = "0px";
  this.div_width = "default";
  this.div_height = "default";
  this.font_family = "arial";
  this.font_weight = "normal";
  this.font_size = "10pt";
  this.text_align = "center";
  this.border_radius = "3px";
  this.border_thickness = "1px";
  this.border_line = "solid";
  this.border_color = "#555555";
  this.border_radius = "3px";
  this.padding_top = "2px";
  this.padding_left = "3px";
  this.padding_right = "3px";
  this.padding_bottom = "2px";
  this.back_color = "none";
  this.back_color_alt = "none";
  }

function createStyledDiv(parent_id,child_id,style) {
  var new_div = document.createElement('div');

  new_div.id = child_id;
  new_div.style.position = style.div_position;
  new_div.style.left = style.div_left;
  new_div.style.top = style.div_top;
  if(style.div_width!='default')   new_div.style.width = style.div_width;
  if(style.div_height!='default')  new_div.style.height = style.div_height;
  new_div.style.fontFamily = style.font_family;
  new_div.style.fontSize = style.font_size;
  new_div.style.fontWeight = style.font_weight;
  new_div.style.textAlign = style.text_align;
  new_div.style.borderRadius = style.border_radius;
  if(style.border_thickness!=0)  new_div.style.border = style.border_thickness + " " + style.border_line + " " + style.border_color;

  new_div.style.paddingTop = style.padding_top;
  new_div.style.paddingLeft = style.padding_left;
  new_div.style.paddingRight = style.padding_right;
  new_div.style.paddingBottom = style.padding_bottom;

  if(style.back_color!='none')  new_div.style.backgroundColor = style.back_color;

  document.getElementById(parent_id).appendChild(new_div);
  }

function shiftColor(color) {
  var red_hex = parseInt(color.substring(1,3),16);
  var green_hex = parseInt(color.substring(3,5),16);
  var blue_hex = parseInt(color.substring(5,7),16);

//  red_hex = Math.round(red_hex + 0.5*(255-red_hex));
//  green_hex = Math.round(green_hex + 1.0*(255-green_hex));
//  blue_hex = Math.round(blue_hex + 0.5*(255-blue_hex));

  green_hex = 255;

  if(red_hex<0)     red_hex=0;
  if(green_hex<0)   green_hex=0;
  if(blue_hex<0)    blue_hex=0;
  if(red_hex>255)   red_hex=255;
  if(green_hex>255) green_hex=255;
  if(blue_hex>255)  blue_hex=255;

  if(red_hex<16)   var red_hex_str = "0" + red_hex.toString(16);
  else             var red_hex_str = red_hex.toString(16);
  if(green_hex<16) var green_hex_str = "0" + green_hex.toString(16);
  else             var green_hex_str = green_hex.toString(16);
  if(blue_hex<16)  var blue_hex_str = "0" + blue_hex.toString(16);
  else             var blue_hex_str = blue_hex.toString(16);

  return "#" + red_hex_str + green_hex_str + blue_hex_str;
  }




//  a lot of overlap in first three - think about this.  all three in use, but limited.

function createTextButtonDiv(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,text,back_color) {
  var new_div = document.createElement('div');

  new_div.id = child_id;
  if(pix_width!='none')  new_div.style.width = pix_width + "px";
  if(pix_height!='none') new_div.style.height = pix_height + "px";
  new_div.style.position = "absolute";
  new_div.style.left = pix_left + "px";
  new_div.style.top = pix_top + "px";

  new_div.style.fontFamily = "arial";
  new_div.style.fontSize = "11pt";
  new_div.style.textAlign = "center";
  new_div.style.borderRadius = "4px";
  new_div.style.border = "1px solid #555555";
  new_div.style.paddingTop = "3px";
  if(arguments.length==8)  new_div.style.backgroundColor = back_color;

  document.getElementById(parent_id).appendChild(new_div);
  document.getElementById(child_id).innerHTML = text;
  }

//    color: #000000;
//    padding-top: 2px;
//    background-color: #D5BBBB;

function createTextDiv(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,text,back_color) {
  var new_div = document.createElement('div');

  new_div.id = child_id;
  if(pix_width!='none')  new_div.style.width = pix_width + "px";
  if(pix_height!='none') new_div.style.height = pix_height + "px";
  new_div.style.position = "absolute";
  new_div.style.left = pix_left + "px";
  new_div.style.top = pix_top + "px";

  new_div.style.fontFamily = "arial";
  new_div.style.fontWeight = "bold";
  new_div.style.fontSize = "12pt";
  new_div.style.textAlign = "center";
  new_div.style.paddingTop = "3px";
  if(arguments.length==8)  new_div.style.backgroundColor = back_color;

  document.getElementById(parent_id).appendChild(new_div);
  document.getElementById(child_id).innerHTML = text;
  }

function createDiv(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,back_color) {
  var new_div = document.createElement('div');

  new_div.id = child_id;
  if(pix_width!='none')  new_div.style.width = pix_width + "px";
  if(pix_height!='none') new_div.style.height = pix_height + "px";
  new_div.style.position = "absolute";
  new_div.style.left = pix_left + "px";
  new_div.style.top = pix_top + "px";
  if(arguments.length==7)  new_div.style.backgroundColor = back_color;

  document.getElementById(parent_id).appendChild(new_div);
  }

function createCanvas(parent_id,pix_left,pix_top,child_id,pix_width,pix_height,back_color) {
  var new_canvas = document.createElement('canvas');

  new_canvas.id = child_id;
  new_canvas.width = pix_width;
  new_canvas.height = pix_height;
  new_canvas.style.position = "absolute";
  new_canvas.style.left = pix_left + "px";
  new_canvas.style.top = pix_top + "px";
  if(arguments.length==7)  new_canvas.style.backgroundColor = back_color;

  document.getElementById(parent_id).appendChild(new_canvas);
  }

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

function ddMenu(dd_id,selected_option) {
  this.dd_id = dd_id;
  this.div_id = dd_id + '_div';
  this.selected_option = selected_option;
  this.options;
  this.display_strs;
  this.updateRestOfPage;
  }

ddMenu.prototype.setDiv = function(container_id,pix_left,pix_top) {
  createDiv(container_id,pix_left,pix_top,this.div_id,'none','none');
  };

ddMenu.prototype.initialize = function() {
  insertDropDownMenu(this.div_id,this.dd_id,'none',this.options,this.selected_option,this.display_strs);

  document.getElementById(this.dd_id).addEventListener('change',this.ddMenuHandler.bind(this),false);
  };

ddMenu.prototype.ddMenuHandler = function(e) {
  var handle = document.getElementById(this.dd_id);
  this.selected_option = handle.options[handle.selectedIndex].value;

  this.updateRestOfPage();
  };

ddMenu.prototype.getIndexOfSelectedOption = function() {
  for(var i=0;i<this.options.length;++i) {
    if(this.selected_option == this.options[i])  return i;
    }
  };

//---------------------------------------------------------------------------

function insertDropDown(container_id,dd_id,dd_name,display_strs,selected_option,options) {
  var html_str = "<select";
  if(dd_id   != 'none')   html_str = html_str + ' id=\"' + dd_id + '\"';
  if(dd_name != 'none')   html_str = html_str + ' name=\"' + dd_name + '\"';
  html_str = html_str + ' size=\"1\" style=\"font-size:9pt;\">\n';

  if(arguments.length==5) {
    var options = new Array(display_strs.length);
    for(var i=0;i<display_strs.length;++i)  options[i] = i;
    }

  for(var i=0;i<options.length;++i) {
    if(options[i] == 'div')  {  html_str = html_str + '<optgroup label=\"' + display_strs[i] + '\" style=\"color:#000099\"></optgroup>\n';  continue; }
    if(options[i] == selected_option)   html_str = html_str + '<option selected value=\"' + options[i] + '\">' + display_strs[i]+ '</option>\n';
    else                                html_str = html_str + '<option value=\"' + options[i] + '\">' + display_strs[i]+ '</option>\n';
    }
  html_str = html_str + '</select>\n';

  document.getElementById(container_id).innerHTML = html_str;
  }

function insertDropDownMenu(container_id,dd_id,dd_name,options,selected_option,display_strs) {
  var html_str = "<select";
  if(dd_id   != 'none')   html_str = html_str + ' id=\"' + dd_id + '\"';
  if(dd_name != 'none')   html_str = html_str + ' name=\"' + dd_name + '\"';
  html_str = html_str + ' size=\"1\" style=\"font-size:9pt;\">\n';

  for(var i=0;i<options.length;++i) {
    if(options[i] == 'div')  {  html_str = html_str + '<optgroup label=\"' + display_strs[i] + '\" style=\"color:#000099\"></optgroup>\n';  continue; }
    if(options[i] == selected_option)   html_str = html_str + '<option selected value=\"' + options[i] + '\">' + display_strs[i]+ '</option>\n';
    else                                html_str = html_str + '<option value=\"' + options[i] + '\">' + display_strs[i]+ '</option>\n';
    }
  html_str = html_str + '</select>\n';

  document.getElementById(container_id).innerHTML = html_str;
  }

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

function textDivButton(button_id,label_string) {
  this.button_id = button_id;
  this.label_string = label_string;
  this.style = new divStyle();

  this.updateRestOfPage;
  }

textDivButton.prototype.setDiv = function(container_id,pix_left,pix_top) {
  this.style.div_left = pix_left + "px";   //---here is place to have some pre-defined qvs button styles
  this.style.div_top = pix_top + "px";
  this.style.back_color = "#DDEEDD"
  this.style.back_color_alt = "#DDFFDD"
  createStyledDiv(container_id,this.button_id,this.style);
  document.getElementById(this.button_id).innerHTML = this.label_string;
  };

textDivButton.prototype.initialize = function() {
  document.getElementById(this.button_id).addEventListener('mousemove',this.textDivButtonHandler.bind(this),false);
  document.getElementById(this.button_id).addEventListener('mousedown',this.textDivButtonHandler.bind(this),false);
  document.getElementById(this.button_id).addEventListener('mouseout',this.textDivButtonHandler.bind(this),false);
  };

textDivButton.prototype.textDivButtonHandler = function(e) {
  e.preventDefault();

  if(e.type == "mousemove")  {
    document.getElementById(this.button_id).style.cursor = "pointer";
    document.getElementById(this.button_id).style.backgroundColor = this.style.back_color_alt;
    }
  if(e.type == "mouseout")  {
    document.getElementById(this.button_id).style.cursor = "default";
    document.getElementById(this.button_id).style.backgroundColor = this.style.back_color;
    }
  if(e.type == 'mousedown')  {
    document.getElementById(this.button_id).style.backgroundColor = this.style.back_color;
    this.updateRestOfPage();
    }
  };

//---------------------------------------------------------------------------

//---------------------------------------------------------------------------

function checkBox(check_id,state) {
  this.check_id = check_id;
  this.check_id_div = check_id + "_div";
  this.state = state;

  this.updateRestOfPage;
  }

checkBox.prototype.setDiv = function(container_id,pix_left,pix_top) {
  var new_div = document.createElement('div');
  new_div.id = this.check_id_div;
  new_div.style.position = "absolute";
  new_div.style.left = pix_left + "px";
  new_div.style.top = pix_top + "px";
  new_div.style.width = "16px";
  new_div.style.height = "16px";

  document.getElementById(container_id).appendChild(new_div);
  document.getElementById(this.check_id_div).innerHTML = "<input type=\"checkbox\" id=\"" + this.check_id + "\">";
  };

checkBox.prototype.initialize = function() {
  if(this.state=='off')  document.getElementById(this.check_id).checked = false;
  if(this.state=='on')   document.getElementById(this.check_id).checked = true;

  document.getElementById(this.check_id).addEventListener('change',this.checkBoxHandler.bind(this),false);
  };

checkBox.prototype.checkBoxHandler = function(e) {
  if(document.getElementById(this.check_id).checked == false)  this.state = "off";
  if(document.getElementById(this.check_id).checked == true)   this.state = "on";

  this.updateRestOfPage();
  };

//---------------------------------------------------------------------------

