//############################################################################
//       sci_slider.js
//
//       by Brian Kaney, March 2015
//############################################################################

function simpleLineSlider(canvas_id,thickness,length,orientation,current_pixel,line_color,line_width) {
  this.canvas_id     = canvas_id;
  this.thickness     = thickness;
  this.length        = length;
  this.orientation   = orientation;
  this.current_pixel = current_pixel;
  this.line_color    = line_color;
  this.line_width    = line_width;
  }

simpleLineSlider.prototype.draw = function() {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  ctx.clearRect(0,0,this.thickness,this.length);

  ctx.strokeStyle = this.line_color;
  ctx.lineWidth = this.line_width;
  var offset = 0.5*this.line_width%2;

  if(this.orientation == "vert") {
    ctx.beginPath();
    ctx.moveTo(0,this.current_pixel+offset);
    ctx.lineTo(this.thickness,this.current_pixel+offset);
    ctx.stroke();
    ctx.closePath();
    }
  if(this.orientation == "horiz") {
    ctx.beginPath();
    ctx.moveTo(this.current_pixel+offset,0);
    ctx.lineTo(this.current_pixel+offset,this.thickness);
    ctx.stroke();
    ctx.closePath();
    }
  return;
  };




function singleSlider(c_id,c_width,c_height,orientation,num_pixels,current_pixel,min_pos_x,min_pos_y,k_width,k_height,k_color) {
  this.canvas_id     = c_id;
  this.canvas_width  = c_width;  //--purge this, not needed
  this.canvas_height = c_height;  //purge, it a piece of data for canvas object
  this.orientation   = orientation;  //----Values = "vert" or "horiz", Slider goes up or right from min pos accordingly
  this.num_pixels    = num_pixels;
  this.current_pixel = current_pixel;
  this.min_pos_x     = min_pos_x;    //---relative to upper left corner of container canvas
  this.min_pos_y     = min_pos_y;    //---relative to upper left corner of container canvas
  this.knob_width    = k_width;
  this.knob_height   = k_height;
  this.knob_color    = k_color;

  if(this.orientation=="horiz") {
    this.max_pos_x = this.min_pos_x + this.num_pixels;
    this.max_pos_y = this.min_pos_y;
    }
  if(this.orientation=="vert") {
    this.max_pos_x = this.min_pos_x;
    this.max_pos_y = this.min_pos_y + this.num_pixels;
    }
  this.slider_mode = "fixed";
  }

singleSlider.prototype.draw = function() {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  ctx.clearRect(0,0,this.canvas_width,this.canvas_height);

  ctx.fillStyle = this.knob_color;
  ctx.strokeStyle = "rgb(0,0,0)";

  if(this.orientation=="vert") {
    ctx.fillRect(this.min_pos_x-this.knob_width/2,this.min_pos_y-this.current_pixel-this.knob_height/2,this.knob_width,this.knob_height);
    ctx.strokeRect(this.min_pos_x-this.knob_width/2+0.5,this.min_pos_y-this.current_pixel-this.knob_height/2+0.5,this.knob_width,this.knob_height);
    }
  if(this.orientation=="horiz") {
    ctx.fillRect(this.min_pos_x+this.current_pixel-this.knob_height/2,this.min_pos_y-this.knob_width/2,this.knob_height,this.knob_width);
    ctx.strokeRect(this.min_pos_x+this.current_pixel-this.knob_height/2+0.5,this.min_pos_y-this.knob_width/2-0.5,this.knob_height,this.knob_width);
    }
  };

singleSlider.prototype.processNewSetting = function(allowed_steps,form_element_name,e) {
//SingleSlider.prototype.processNewSetting = function(pix_off,allowed_steps,form_element_name,e) {
  var pix;
  if(this.orientation=="horiz")  pix = getMouseScreenX(this.canvas_id,e) - this.min_pos_x;
  if(this.orientation=="vert")   pix = -1*getMouseScreenY(this.canvas_id,e) - this.min_pos_y;  //algebraic sign here untested
//  if(this.orientation=="horiz")  pix = getMouseScreenX(pix_off,e);
//  if(this.orientation=="vert")   pix = -1*getMouseScreenY(pix_off,e);

  e.preventDefault();

  if(pix<0)  pix=0;
  if(pix>this.num_pixels)  pix=this.num_pixels;

  if(e.type=="mouseup" || e.type=="mouseout") {
    this.slider_mode = "fixed";
    document.getElementById(this.canvas_id).style.cursor = "default";
    return;
    }

  if(this.slider_mode=="fixed") {
    if(e.type=="mousedown") {
      document.getElementById(this.canvas_id).style.cursor = "pointer";
      this.slider_mode = "adjust";
      }
    else { return; }
    }

  if(this.slider_mode=="adjust") {
    if(allowed_steps>1)  this.current_pixel = allowed_steps*Math.floor(pix/allowed_steps+0.5);
    else                 this.current_pixel = pix;
    if(form_element_name != "none")  document.MainForm[form_element_name].value = this.current_pixel/allowed_steps;
    }

  this.draw();
  return;
  };

//  no longer needed, added to default behavior above (mouseout), purged but there may be a couple of instances in use
//SingleSlider.prototype.Reset = function() {
//  this.slider_mode = "fixed";
//  document.getElementById(this.canvas_id).style.cursor = "default";
//  };


function rangeSlider(c_id,c_width,c_height,orientation,num_pixels,current_pixel_min,current_pixel_max,min_max_buffer,
                                           min_pos_x,min_pos_y,k_width,k_height,k_color_min,k_color_max) {
  this.canvas_id     = c_id;
  this.canvas_width  = c_width;   //---not needed, purge
  this.canvas_height = c_height;
  this.orientation   = orientation;  //----Values = "vert" or "horiz", Slider goes up or right from min pos accordingly
  this.num_pixels    = num_pixels;
  this.current_pixel_min = current_pixel_min;
  this.current_pixel_max = current_pixel_max;
  this.min_max_buffer    = min_max_buffer;
  this.min_pos_x         = min_pos_x;    //---relative to upper left corner of container canvas
  this.min_pos_y         = min_pos_y;    //---relative to upper left corner of container canvas
  this.knob_width        = k_width;
  this.knob_height       = k_height;
  this.knob_color_min    = k_color_min;
  this.knob_color_max    = k_color_max;

  if(this.orientation=="horiz") {
    this.max_pos_x = this.min_pos_x + this.num_pixels;
    this.max_pos_y = this.min_pos_y;
    }
  if(this.orientation=="vert") {
    this.max_pos_x = this.min_pos_x;
    this.max_pos_y = this.min_pos_y + this.num_pixels;
    }
  this.slider_mode = "fixed";
  }

rangeSlider.prototype.draw = function() {
  var ctx = document.getElementById(this.canvas_id).getContext('2d');
  ctx.clearRect(0,0,this.canvas_width,this.canvas_height);

  ctx.strokeStyle = "rgb(0,0,0)";

  if(this.orientation=="vert") {
    ctx.fillStyle = this.knob_color_min;
    ctx.fillRect(this.min_pos_x-this.knob_width/2,this.min_pos_y-this.current_pixel_min-this.knob_height/2,this.knob_width,this.knob_height);
    ctx.strokeRect(this.min_pos_x-this.knob_width/2+0.5,this.min_pos_y-this.current_pixel_min-this.knob_height/2+0.5,this.knob_width,this.knob_height);
    ctx.fillStyle = this.knob_color_max;
    ctx.fillRect(this.min_pos_x-this.knob_width/2,this.min_pos_y-this.current_pixel_max-this.knob_height/2,this.knob_width,this.knob_height);
    ctx.strokeRect(this.min_pos_x-this.knob_width/2+0.5,this.min_pos_y-this.current_pixel_max-this.knob_height/2+0.5,this.knob_width,this.knob_height);


    ctx.font = "9pt Arial"; 
    ctx.fillStyle = "rgb(0,0,0)";
    ctx.fillText("Min",this.min_pos_x-10,this.min_pos_y-this.current_pixel_min+5);
    ctx.fillText("Max",this.min_pos_x-10,this.min_pos_y-this.current_pixel_max+5);


    }
  if(this.orientation=="horiz") {
    ctx.fillStyle = this.knob_color_min;
    ctx.fillRect(this.min_pos_x+this.current_pixel_min-this.knob_height/2,this.min_pos_y-this.knob_width/2,this.knob_height,this.knob_width);
    ctx.strokeRect(this.min_pos_x+this.current_pixel_min-this.knob_height/2+0.5,this.min_pos_y-this.knob_width/2-0.5,this.knob_height,this.knob_width);
    ctx.fillStyle = this.knob_color_max;
    ctx.fillRect(this.min_pos_x+this.current_pixel_max-this.knob_height/2,this.min_pos_y-this.knob_width/2,this.knob_height,this.knob_width);
    ctx.strokeRect(this.min_pos_x+this.current_pixel_max-this.knob_height/2+0.5,this.min_pos_y-this.knob_width/2-0.5,this.knob_height,this.knob_width);
    }
  };

rangeSlider.prototype.processNewSetting = function(allowed_steps,form_min_element_name,form_max_element_name,e) {
//RangeSlider.prototype.processNewSetting = function(pix_off,allowed_steps,form_min_element_name,form_max_element_name,e) {
  var pix;
  if(this.orientation=="horiz")  pix = getMouseScreenX(this.canvas_id,e) - this.min_pos_x;
  if(this.orientation=="vert")   pix = -1*getMouseScreenY(this.canvas_id,e) - this.min_pos_y;  //algebraic sign here untested
//  if(this.orientation=="horiz")  pix = getMouseScreenX(pix_off,e);
//  if(this.orientation=="vert")   pix = -1*getMouseScreenY(pix_off,e);

  if(pix<0)  pix=0;
  if(pix>this.num_pixels)  pix=this.num_pixels;

  e.preventDefault();

  if(e.type=="mouseup" || e.type=="mouseout") {
    this.slider_mode = "fixed";
    document.getElementById(this.canvas_id).style.cursor = "default";
    return;
    }

  if(this.slider_mode=="fixed") {
    if(e.type=="mousedown") {
      document.getElementById(this.canvas_id).style.cursor = "pointer";
      if((pix-this.current_pixel_min) < (this.current_pixel_max-pix)) {
        this.slider_mode = "adjust_min";
        }     
      else  this.slider_mode = "adjust_max";
      }
    else { return; }
    }

  if(this.slider_mode=="adjust_min") {
    if(pix>(this.num_pixels-this.min_max_buffer))  pix=this.num_pixels-this.min_max_buffer;
    if(allowed_steps>1)  this.current_pixel_min = allowed_steps*Math.floor(pix/allowed_steps+0.5);
    else                 this.current_pixel_min = pix;
    if((this.current_pixel_max - this.current_pixel_min) < this.min_max_buffer) { 
      this.current_pixel_max = this.current_pixel_max + this.min_max_buffer;
      }
    if(form_min_element_name != "none")  document.MainForm[form_min_element_name].value = this.current_pixel_min/allowed_steps;
    if(form_max_element_name != "none")  document.MainForm[form_max_element_name].value = this.current_pixel_max/allowed_steps;
    }

  if(this.slider_mode=="adjust_max") {
    if(pix<this.min_max_buffer)  pix=this.min_max_buffer;
    if(allowed_steps>1)  this.current_pixel_max = allowed_steps*Math.floor(pix/allowed_steps+0.5);
    else                 this.current_pixel_max = pix;
    if((this.current_pixel_max - this.current_pixel_min) < this.min_max_buffer) { 
      this.current_pixel_min = this.current_pixel_min - this.min_max_buffer;
      }
    if(form_min_element_name != "none")  document.MainForm[form_min_element_name].value = this.current_pixel_min/allowed_steps;
    if(form_max_element_name != "none")  document.MainForm[form_max_element_name].value = this.current_pixel_max/allowed_steps;
    }

  this.draw();
  return;
  };

//  no longer needed, added to default behavior above (mouseout), purged but there may be a couple of instances in use
//RangeSlider.prototype.Reset = function() {
//  this.slider_mode = "fixed";
//  document.getElementById(this.canvas_id).style.cursor = "default";
//  };


