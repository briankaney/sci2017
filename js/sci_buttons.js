//############################################################################
//       sci_buttons.js
//
//       by Brian Kaney, March 2016
//############################################################################

function hotRectangles(num_hotspots) {
  this.num_hotspots = num_hotspots;

  this.active = new Array(num_hotspots);
  for(var i=0;i<this.num_hotspots;++i)  this.active[i] = 1;

  this.left_x = new Array(num_hotspots);
  this.top_y  = new Array(num_hotspots);
  this.width  = new Array(num_hotspots);
  this.height = new Array(num_hotspots);
  return;
  }

hotRectangles.prototype.setAllActive = function() {
  for(var i=0;i<this.num_hotspots;++i)  this.active[i] = 1;
  };

hotRectangles.prototype.setConstWidth = function(const_width) {
  for(var i=0;i<this.num_hotspots;++i)  this.width[i] = const_width;
  };
hotRectangles.prototype.setConstHeight = function(const_height) {
  for(var i=0;i<this.num_hotspots;++i)  this.height[i] = const_height;
  };
hotRectangles.prototype.setConstLeft = function(const_left) {
  for(var i=0;i<this.num_hotspots;++i)  this.left_x[i] = const_left;
  };
hotRectangles.prototype.setConstTop = function(const_top) {
  for(var i=0;i<this.num_hotspots;++i)  this.top_y[i] = const_top;
  };
hotRectangles.prototype.setConstDimensions = function(const_width,const_height) {
  this.setConstWidth(const_width);
  this.setConstHeight(const_height);
  };
hotRectangles.prototype.packLeftFromWidths = function() {
  this.left_x[0] = 0;
  for(var i=1;i<this.num_hotspots;++i)  this.left_x[i] = this.left_x[i-1] + this.width[i-1];
  }

hotRectangles.prototype.setAsBlockOfRows = function(tot_left_x,tot_top_y,num_row,width,height) {
  for(var i=0;i<this.num_hotspots;++i) {
    this.left_x[i] = tot_left_x + width*Math.floor(i/num_row);
    this.top_y[i]  = tot_top_y + height*(i%num_row);
    this.width[i]  = width;
    this.height[i] = height;
    }
  };
hotRectangles.prototype.setAsBlockOfColumns = function(tot_left_x,tot_top_y,num_col,width,height) {
  for(var i=0;i<this.num_hotspots;++i) {
    this.left_x[i] = tot_left_x + width*(i%num_col);
    this.top_y[i]  = tot_top_y + height*Math.floor(i/num_col);
    this.width[i]  = width;
    this.height[i] = height;
    }
  };

hotRectangles.prototype.getIndex = function(pt) {
  var index = -1;

  for(var i=0;i<this.num_hotspots;++i) {
    if(this.active[i]==0)  continue;
    if(pt.x>=this.left_x[i] && pt.x<(this.left_x[i]+this.width[i]) &&
              pt.y>=this.top_y[i] && pt.y<(this.top_y[i]+this.height[i])) {
      index = i;
      }
    }
  return index;
  };

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function rectButtonTheme() {
  this.rect_selected     = "#3799DC";
  this.rect_hover        = "#1E5FA5";
  this.rect_not_selected = "#003A75";
  this.rect_inactive     = "#3C3C3C";
  this.rect_border       = "#000000";

  this.text_selected     = "#FFFFFF";
  this.text_hover        = "#FFFFFF";
  this.text_not_selected = "#FFFFFF";
  this.text_inactive     = "#000000";
  this.font              = "9pt Arial";
  this.left_indent       = "center";
  this.top_indent        = "center";
  }

rectButtonTheme.prototype.setRectColors = function(rect_selected,rect_hover,rect_not_selected,rect_inactive,rect_border) {
  this.rect_selected     = rect_selected;
  this.rect_hover        = rect_hover;
  this.rect_not_selected = rect_not_selected;
  this.rect_inactive     = rect_inactive;
  this.rect_border       = rect_border;
  };

rectButtonTheme.prototype.setTextStyle = function(text_selected,text_hover,text_not_selected,text_inactive,font,left_indent,top_indent) {
  this.text_selected     = text_selected;
  this.text_hover        = text_hover;
  this.text_not_selected = text_not_selected;
  this.text_inactive     = text_inactive;
  this.font              = font;
  this.left_indent       = left_indent;
  this.top_indent        = top_indent;
  };

rectButtonTheme.prototype.setTheme = function(theme) {
  this.setRectColors(theme.rect_selected,theme.rect_hover,theme.rect_not_selected,theme.rect_inactive,theme.rect_border);
  this.setTextStyle(theme.text_selected,theme.text_hover,theme.text_not_selected,theme.text_inactive,theme.font,theme.left_indent,theme.top_indent); 
  };

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function radioButtons(canvas_id,num_controls,index) {
  this.canvas_id      = canvas_id;
  this.num_controls   = num_controls;
  if(arguments.length>2)  this.selected_index = index;
  else                    this.selected_index = 0;
  this.hover_index    = -1;
  this.state_change   = 0;

  this.corner_radius = 0;
  this.theme = new rectButtonTheme();
  this.rect = new hotRectangles(this.num_controls);

  this.option_str  = new Array(this.num_controls);
  this.display_txt = new Array(this.num_controls);
  this.updateRestOfPage;
  }

radioButtons.prototype.setIndexViaOptionStr = function(option) {
  for(var i=0;i<this.num_controls;++i) {
    if(option==this.option_str[i])  this.selected_index = i;
    }
  };

radioButtons.prototype.setCanvas = function(container_id,left_pix,top_pix,pix_width,pix_height,back_color) {
  createCanvas(container_id,left_pix,top_pix,this.canvas_id,pix_width,pix_height,back_color);
  };

radioButtons.prototype.initialize = function() {
  document.getElementById(this.canvas_id).addEventListener('mousemove',this.buttonAction.bind(this),false);
  document.getElementById(this.canvas_id).addEventListener('mousedown',this.buttonAction.bind(this),false);
  document.getElementById(this.canvas_id).addEventListener('mouseout',this.buttonAction.bind(this),false);
  };

radioButtons.prototype.defaultAction = function(e) {
  var pt = getMouseScreenPoint(this.canvas_id,e);
  e.preventDefault();

  var new_index = this.rect.getIndex(pt);
  this.state_change = 0;

  if(e.type == "mousemove" && new_index!=this.hover_index) {
    this.hover_index = new_index;
    this.setMouse();
    this.state_change = 1;
    this.draw();
    }
  if(e.type == "mousedown" && new_index>=0 && new_index!=this.selected_index) {
    this.selected_index = new_index;
    this.hover_index = -1;
    this.state_change = 2;
    this.draw();
    }
  if(e.type == "mouseout") {
    this.hover_index = -1;
    this.draw();
    }
  };

radioButtons.prototype.buttonAction = function(e) {
  this.defaultAction(e);
  if(this.state_change>0)  this.updateRestOfPage();
  };

radioButtons.prototype.setMouse = function(e) {
  if(this.hover_index>=0 && this.hover_index!=this.selected_index)  {
    document.getElementById(this.canvas_id).style.cursor = "pointer";
    }
  else {
    document.getElementById(this.canvas_id).style.cursor = "default";
    }
  };

radioButtons.prototype.draw = function() {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');

  for(var i=0;i<this.num_controls;++i) {
    ctx.clearRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
    }

  if(this.theme.rect_selected != 'none') {
    for(var i=0;i<this.num_controls;++i) {
      ctx.fillStyle = this.theme.rect_not_selected;
      if(i==this.hover_index)     ctx.fillStyle = this.theme.rect_hover;
      if(i==this.selected_index)  ctx.fillStyle = this.theme.rect_selected;
      if(this.rect.active[i]==0)  ctx.fillStyle = this.theme.rect_inactive;

      if(this.corner_radius==0)  ctx.fillRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
      else                       this.fillTabButton(i,ctx);
      }
    }

  if(this.theme.rect_border != 'none') {
    ctx.strokeStyle = this.theme.rect_border;
    for(var i=0;i<this.num_controls;++i) {
      if(this.corner_radius==0)  ctx.strokeRect(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5,this.rect.width[i],this.rect.height[i]);
      else                       this.strokeTabButton(i,ctx);
      }
    }

  ctx.font = this.theme.font;
  for(var i=0;i<this.num_controls;++i) {
    ctx.fillStyle = this.theme.text_not_selected;
    if(i==this.hover_index)     ctx.fillStyle = this.theme.text_hover;
    if(i==this.selected_index)  ctx.fillStyle = this.theme.text_selected;
    if(this.rect.active[i]==0)  ctx.fillStyle = this.theme.text_inactive;

    if(this.theme.left_indent == 'center')  var x_indent = (this.rect.width[i]-ctx.measureText(this.display_txt[i]).width)/2;
    else                                    var x_indent = this.theme.left_indent;    
    if(this.theme.top_indent == 'center')   var y_indent = (this.rect.height[i]+approxFontHeight(this.theme.font))/2;
    else                                    var y_indent = this.theme.top_indent;    

    ctx.fillText(this.display_txt[i],this.rect.left_x[i]+x_indent,this.rect.top_y[i]+y_indent);
    }
  };

radioButtons.prototype.fillTabButton = function(i,ctx) {
  ctx.beginPath();
  ctx.moveTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.rect.height[i]);
  ctx.lineTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.corner_radius);
  ctx.arc(this.rect.left_x[i]+0.5+this.corner_radius,this.rect.top_y[i]+0.5+this.corner_radius,this.corner_radius,Math.PI,Math.PI*1.5,false);
  ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_radius,this.rect.top_y[i]+0.5);
  ctx.arc(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_radius,this.rect.top_y[i]+0.5+this.corner_radius,this.corner_radius,Math.PI*1.5,0,false);
  ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i],this.rect.top_y[i]+0.5+this.rect.height[i]);
  ctx.fill();
  };

radioButtons.prototype.strokeTabButton = function(i,ctx) {
    ctx.strokeStyle = this.theme.rect_border;
  ctx.beginPath();
  ctx.moveTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.rect.height[i]);
  ctx.lineTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.corner_radius);
  ctx.arc(this.rect.left_x[i]+0.5+this.corner_radius,this.rect.top_y[i]+0.5+this.corner_radius,this.corner_radius,Math.PI,Math.PI*1.5,false);
  ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_radius,this.rect.top_y[i]+0.5);
  ctx.arc(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_radius,this.rect.top_y[i]+0.5+this.corner_radius,this.corner_radius,Math.PI*1.5,0,false);
  ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i],this.rect.top_y[i]+0.5+this.rect.height[i]);
  if(i==this.selected_index) {
    ctx.stroke();
    ctx.strokeStyle = this.theme.rect_selected;
    ctx.beginPath();
    ctx.moveTo(this.rect.left_x[i]+0.5+this.rect.width[i],this.rect.top_y[i]+0.5+this.rect.height[i]);
    ctx.lineTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.rect.height[i]);
    ctx.stroke();
    }
  else {
    ctx.closePath();
    ctx.stroke();
    }
  };




//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function rectControls(canvas_id,style,num_controls,index) {
  this.canvas_id     = canvas_id;
  this.style         = style;     //---options = simple, text, radio, tab, toggle
  this.num_controls  = num_controls;
  this.simple_press_index = -1;
  this.current_index = 0;
  this.toggle_index  = 0;
  if(arguments.length==4) {
    if(this.style=='radio' || this.style=='text')  this.current_index = index;
    if(this.style=='toggle')  this.toggle_index = index;
    }

  this.rect = new hotRectangles(num_controls);

  this.display_txt  = new Array(num_controls);
  this.font         = "9pt Arial";
  this.indent_mode  = "center";    //---options = fixed, center
  this.txt_x_indent = new Array(num_controls);
  this.txt_y_indent = new Array(num_controls);
  for(var i=0;i<this.num_controls;++i)  this.txt_y_indent[i] = 16;

  this.txt_off_color   = "#FFFFFF";
  this.txt_hover_color = "#FFFFFF";
  this.txt_on_color    = "#FFFFFF";

  this.rect_off_color    = "#003A75";
  this.rect_hover_color  = "#1E5FA5";
  this.rect_on_color     = "#3799DC";
  this.rect_border_color = "#000000";

  this.txt_dead_color    = "#000000";
  this.rect_dead_color   = "#3C3C3C";
  this.rect_reload_color = "#3799DC";

  this.tab_corner_rad = 10;

  this.div_layer_name = new Array(num_controls);
  this.url_string     = new Array(num_controls);
  this.toggle_state   = new Array(num_controls);

  var two_to_i_power = 1;
  for(var i=0;i<this.num_controls;++i) {
    this.toggle_state[i] = Math.floor((this.toggle_index%(2*two_to_i_power))/two_to_i_power);
    two_to_i_power = 2*two_to_i_power;
    }
  }

rectControls.prototype.setTextStyle = function(font,indent_mode,x_indent,y_indent) {
  this.font = font;
  this.indent_mode = indent_mode;
  for(var i=0;i<this.num_controls;++i)  {
    if(x_indent>=0)  this.txt_x_indent[i] = x_indent;
    if(y_indent>=0)  this.txt_y_indent[i] = y_indent;
    }
  };

rectControls.prototype.setTextColors = function(off_color,hover_color,on_color) {
  this.txt_off_color   = off_color;
  this.txt_hover_color = hover_color;
  this.txt_on_color    = on_color;
  };

rectControls.prototype.setRectColors = function(off_color,hover_color,on_color,border_color) {
  this.rect_off_color    = off_color;
  this.rect_hover_color  = hover_color;
  this.rect_on_color     = on_color;
  this.rect_border_color = border_color;
  };

rectControls.prototype.setInactiveColors = function(txt_dead_color,rect_dead_color) {
  this.txt_dead_color  = txt_dead_color;
  this.rect_dead_color = rect_dead_color;
  };

rectControls.prototype.draw = function(hover) {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');

  ctx.strokeStyle = this.rect_border_color;
  ctx.font = this.font;

  for(var i=0;i<this.num_controls;++i) {
    ctx.fillStyle = this.rect_off_color;

    if(this.style == "simple") {
      if(i==hover)                     ctx.fillStyle = this.rect_hover_color;
      if(i==this.simple_press_index)   ctx.fillStyle = this.rect_on_color;
      if(this.rect.active[i]==0)       ctx.fillStyle = this.rect_dead_color;

      ctx.fillRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
      ctx.strokeRect(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5,this.rect.width[i],this.rect.height[i]);
      }
    if(this.style == "text") {
      ctx.clearRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
      }
    if(this.style == "radio") {
      if(i==hover)                ctx.fillStyle = this.rect_hover_color;
      if(i==this.current_index)   ctx.fillStyle = this.rect_on_color;
      if(this.rect.active[i]==0)  ctx.fillStyle = this.rect_dead_color;

      ctx.fillRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
      ctx.strokeRect(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5,this.rect.width[i],this.rect.height[i]);
      }
    if(this.style == "tab") {
      if(i==hover)                ctx.fillStyle = this.rect_hover_color;
      if(i==this.current_index)   ctx.fillStyle = this.rect_on_color;
      if(this.rect.active[i]==0)  ctx.fillStyle = this.rect_dead_color;

      ctx.beginPath();
      ctx.moveTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.rect.height[i]);
      ctx.lineTo(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5+this.corner_rad);
      ctx.arc(this.rect.left_x[i]+0.5+this.corner_rad,this.rect.top_y[i]+0.5+this.corner_rad,this.corner_rad,Math.PI,Math.PI*1.5,false);
      ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_rad,this.rect.top_y[i]+0.5);
      ctx.arc(this.rect.left_x[i]+0.5+this.rect.width[i]-this.corner_rad,this.rect.top_y[i]+0.5+this.corner_rad,this.corner_rad,Math.PI*1.5,0,false);
      ctx.lineTo(this.rect.left_x[i]+0.5+this.rect.width[i],this.rect.top_y[i]+0.5+this.rect.height[i]);
      ctx.fill();
      ctx.stroke();
      }
    if(this.style == "toggle") {
      if(this.toggle_state[i]==1)  ctx.fillStyle = this.rect_on_color;
      if(this.toggle_state[i]==0)  ctx.fillStyle = this.rect_off_color;
      if(this.rect.active[i]==0)   ctx.fillStyle = this.rect_dead_color;

      ctx.fillRect(this.rect.left_x[i],this.rect.top_y[i],this.rect.width[i],this.rect.height[i]);
      ctx.strokeRect(this.rect.left_x[i]+0.5,this.rect.top_y[i]+0.5,this.rect.width[i],this.rect.height[i]);
      }

//---text color does not extend gracefully to 'toggle' mode

    ctx.fillStyle = this.txt_off_color;
    if(i==this.current_index)  ctx.fillStyle = this.txt_on_color;
    if(i==hover && i!=this.current_index)  ctx.fillStyle = this.txt_hover_color;
    if(this.rect.active[i]==0)             ctx.fillStyle = this.txt_dead_color;

    if(this.indent_mode=="fixed") {
      ctx.fillText(this.display_txt[i],this.rect.left_x[i]+this.txt_x_indent[i],this.rect.top_y[i]+this.txt_y_indent[i]);
      }
    if(this.indent_mode=="center") {
      var ix = (this.rect.width[i]-ctx.measureText(this.display_txt[i]).width)/2;
      ctx.fillText(this.display_txt[i],this.rect.left_x[i]+ix,this.rect.top_y[i]+this.txt_y_indent[i]);
      }
    }
  };

rectControls.prototype.setMouse = function(new_index,compare_index) {
  if(new_index>=0 && new_index!=compare_index) {
    document.getElementById(this.canvas_id).style.cursor = "pointer";
    }
  else {
    document.getElementById(this.canvas_id).style.cursor = "default";
    }
  }

//--GetOnlyNewIndex a better name if I keep this
rectControls.prototype.getNewIndex = function(pt) {  //---not to be used below, unique in that it forces new_index to not match current.  why was this done and is there a better way - limite usage
  var new_index = this.rect.getIndex(pt);
  if(new_index==this.current_index)  new_index = -1;
  
  return new_index;
  }


//--could use work
rectControls.prototype.defaultAction = function(e) {
  var pt = getMouseScreenPoint(this.canvas_id,e);
  e.preventDefault();

  var new_index = this.rect.getIndex(pt);

  if(e.type == "mousemove") {
    if(this.style=='simple') this.setMouse(new_index,this.simple_press_index);
    if(this.style=='radio' || this.style=='text')  this.setMouse(new_index,this.current_index);
    this.draw(new_index);
    }
  if(e.type == "mousedown") {
    if(this.style=='simple')  this.simple_press_index = new_index;
    if((this.style=='radio' || this.style=='text') && new_index>=0)   this.current_index = new_index;
    this.draw(-1);
    }
  if(e.type == "mouseup" || e.type == "mouseout") {
    if(this.style=='simple')  this.simple_press_index = -1;
    this.draw(-1);
    }

  return new_index;
  };


rectControls.prototype.previewerAction = function(e) {
  var pt = getMouseScreenPoint(this.canvas_id,e);
  e.preventDefault();

  var new_index = this.rect.getIndex(pt);

  if(e.type == "mousemove") {
    this.setMouse(new_index,this.current_index);
    return -1;
    }
  if(e.type == "mousedown") {
    this.draw(new_index);
    return new_index;
    }
  };













//---is this used yet?  or fully mature??
rectControls.prototype.hoverAction = function(pt,e) {
  var new_index = this.rect.getIndex(pt);

  this.draw(new_index);
  return new_index;
  };
//-------

rectControls.prototype.defaultToggleAction = function(e) {
  var pt = getMouseScreenPoint(this.canvas_id,e);
  e.preventDefault();

  var clicked_index = this.rect.getIndex(pt);

  if(e.type == "mousedown" && clicked_index>=0) {
    if(this.toggle_state[clicked_index]==0)  this.toggle_state[clicked_index]=1;  
    else                                     this.toggle_state[clicked_index]=0;  
    this.draw(-1);
    }

  if(e.type == "mousemove" && clicked_index>=0)  document.getElementById(this.canvas_id).style.cursor = "pointer";
  if(e.type == "mouseout")  document.getElementById(this.canvas_id).style.cursor = "default";

  return clicked_index;
  };












//Better ways to handle what follow.  Move event handlers and canvas for buttons themselves to this lib.  Things like
//form submit and stuff should be external.


//----need to purge x_off and y_off from most of the rest
rectControls.prototype.setForm = function(e,form_element_name) {
  var last_index = this.current_index;
  var new_index = this.defaultAction(e);

  if(e.type == "mousedown" && new_index>=0 && new_index!=last_index) {
    if(form_element_name!="none")  document.MainForm[form_element_name].value = new_index;
    } 
  };

rectControls.prototype.setFormSubmitForm = function(e,form_element_name) {
  var last_index = this.current_index;
  var new_index = this.defaultAction(e);

  if(e.type == "mousedown" && new_index>=0 && new_index!=last_index) {
    if(form_element_name!="none")  document.MainForm[form_element_name].value = new_index;
    document.forms["mainform"].submit();
    } 
  };

rectControls.prototype.setFormDraw = function(e,form_element_name,DrawSomething) {
  var new_index = this.defaultAction(e);

  if(e.type == "mousedown" && new_index>=0) {
    if(form_element_name!="none")  document.MainForm[form_element_name].value = new_index;
    DrawSomething();
    } 
  };

rectControls.prototype.setFormFlipDivs = function(e,form_element_name) {
  var new_index = this.defaultAction(e);

  if(e.type == "mousedown" && new_index>=0) {
    if(form_element_name!="none")   document.MainForm[form_element_name].value = new_index;
    for(var i=0;i<this.num_controls;++i) {
      if(this.rect.active[i]==0)  continue;
      if(new_index==i)  document.getElementById(this.div_layer_name[i]).style.zIndex = 1;
      else              document.getElementById(this.div_layer_name[i]).style.zIndex = -1;
      }
    }
  };

rectControls.prototype.followURL = function(e) {
  var last_index = this.current_index;
  var new_index = this.defaultAction(e);

  if(e.type == "mousedown" && new_index>=0 && new_index!=last_index) {
    window.location.href = this.url_string[new_index];
    } 
  };

rectControls.prototype.setToggleIndexForm = function(e,form_element_name) {
  var clicked_index = this.defaultToggleAction(e);

  if(e.type == "mousedown" && clicked_index>=0) {
    var toggle_index = 0;
    var two_to_i_power = 1;

    for(var i=0;i<this.num_controls;++i) {
      if(this.toggle_state[i]==1)   toggle_index = toggle_index + two_to_i_power;
      two_to_i_power = 2*two_to_i_power;
      }

    if(form_element_name!="none")  document.MainForm[form_element_name].value = toggle_index;
    } 
  return clicked_index;
  };
//----405
