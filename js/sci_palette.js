//############################################################################
//       sci_palette.js
//
//       by Brian Kaney, Oct 2013
//############################################################################

function symbolicCompare(value,mode,target) {
  if(target=='minus_infinity') {
    if(mode=='>' || mode=='>=')  return 1;
    else  return 0;
    }
  if(target=='plus_infinity') {
    if(mode=='<' || mode=='<=')  return 1;
    else  return 0;
    }
  if(mode=='==')  return (value==target);
  if(mode=='<=')  return (value<=target);
  if(mode=='<')   return (value<target);
  if(mode=='>')   return (value>target);
  if(mode=='>=')  return (value>=target);
  return 0;
  }

//----------------------------------------------------------------------------

//function binPalette(num_colors) {
//  this.num_colors = num_colors;

//  this.cutoff   = new Array(this.num_colors+1);
//  this.color    = new Array(this.num_colors);
//  }

function rangePalette(num_colors) {
  this.num_colors = num_colors;

  this.cutoff   = new Array(this.num_colors+1);
  this.color    = new Array(this.num_colors);
  this.min_mode = new Array(this.num_colors);
  this.max_mode = new Array(this.num_cclors);

  for(var i=0;i<this.num_colors;++i)   this.min_mode[i] = ">=";
  for(var i=0;i<this.num_colors;++i)   this.max_mode[i] = "<";
  }

rangePalette.prototype.getColor = function(value) {
  for(var i=0;i<this.num_colors;++i) {
    if(symbolicCompare(value,this.min_mode[i],this.cutoff[i]) && symbolicCompare(value,this.max_mode[i],this.cutoff[i+1]))  return this.oolcr[i];
    }
  return -1;
  };

//--The following does not belong here, it is a function for something like colorSquare below,  rangePalette should be purely a math object

rangePalette.prototype.drawLegendColors = function(canvas_id,x_origin,y_origin,width,height,orientation) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  for(var i=0;i<this.num_colors;++i) {
    ctx.fillStyle = this.color[i];
    if(orientation=='vert')   ctx.fillRect(x_origin,y_origin-(i+1)*height,width,height);
    if(orientation=='horiz')  ctx.fillRect(x_origin+i*width,y_origin-height,width,height);
    }
  };

//----------------------------------------------------------------------------

function colorSquares(num_colors) {
  this.num_colors = num_colors;

  this.colors = new Array(this.num_colors);
  this.left_x = new Array(this.num_colors);
  this.top_y  = new Array(this.num_colors);
  this.width  = new Array(this.num_colors);
  this.height = new Array(this.num_colors);
  };

colorSquares.prototype.setAsUniformColumn = function(x_origin,y_origin,width,height) {
  for(var i=0;i<this.num_colors;++i) {
    this.left_x[i] =  x_origin;
    this.top_y[i] = y_origin-height*(i+1);
    this.width[i] = width;
    this.height[i] = height;
    }
  };

colorSquares.prototype.draw = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  for(var i=0;i<this.num_colors;++i) {
    ctx.fillStyle = this.colors[i];
    ctx.fillRect(this.left_x[i],this.top_y[i],this.width[i],this.height[i]);
    }
  };

//----------------------------------------------------------------------------

function customTextLabels(num_labels) {
  this.num_labels = num_labels;

  this.label_text = new Array(this.num_labels);
  this.start_x = new Array(this.num_labels);
  this.start_y = new Array(this.num_labels);
  }

customTextLabels.prototype.setConstX = function(x) {
  for(var i=0;i<this.num_labels;++i)  this.start_x[i] = x;
  };
customTextLabels.prototype.setSpacedX = function(x1,shift) {
  for(var i=0;i<this.num_labels;++i)  this.start_x[i] = x1+i*shift;
  };
customTextLabels.prototype.setConstY = function(y) {
  for(var i=0;i<this.num_labels;++i)  this.start_y[i] = y;
  };
customTextLabels.prototype.setSpacedY = function(y1,shift) {
  for(var i=0;i<this.num_labels;++i)  this.start_y[i] = y1-i*shift;
  };

customTextLabels.prototype.draw = function(canvas_id,style,justification) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.fillStyle = style.text_color;
  ctx.font = style.font;

  for(var i=0;i<this.num_labels;++i) {
    if(justification=='right')   ctx.fillText(this.label_text[i],this.start_x[i]-ctx.measureText(this.label_text[i]).width,this.start_y[i]);
    if(justification=='center')  ctx.fillText(this.label_text[i],this.start_x[i]-ctx.measureText(this.label_text[i]).width/2,this.start_y[i]);
    if(justification=='left')    ctx.fillText(this.label_text[i],this.start_x[i],this.start_y[i]);
    }
  };














/*  older stiff to pruge below - but some may be still in use   */


//----------------------------------------------------------------------------

function dataRangePalette(num_colors,range_mode) {
  this.num_colors = num_colors;
  this.range_mode = range_mode;
  this.color      = new Array(num_colors);

  this.compare_mode = new Array(this.num_colors);
  for(var i=0;i<this.num_colors;++i)  this.compare_mode[i] = 'eq_bottom';

  this.num_cutoffs = this.num_colors+1;
  if(this.range_mode == 'unbound_top')     --this.num_cutoffs;
  if(this.range_mode == 'unbound_bottom')  --this.num_cutoffs;
  if(this.range_mode == 'unbound_both')    this.num_cutoffs = this.num_cutoffs-2;;

  this.cutoff = new Array(this.num_cutoffs);
  }

dataRangePalette.prototype.setComparisonModeConstant = function(mode) {
  for(var i=0;i<this.num_colors;++i)  this.compare_mode[i] = mode;
  };

dataRangePalette.prototype.setComparisonModeFavorMiddle = function(favored_index) {
  for(var i=0;i<favored_index;++i)                this.compare_mode[i] = 'eq_bottom';
//  for(var i=favored_index;i<this.num_colors;++i)  this.compare_mode[i] = 'eq_top';

  this.compare_mode[favored_index] = 'eq_both';
  for(var i=favored_index+1;i<this.num_colors;++i)  this.compare_mode[i] = 'eq_top';
  };


//------this needs work!!
//   no use of symbolicComparison yet.  that could condense this down.  setComparisonModeFavorMiddle not properly implemented at first.  needs a
//   'eq_both' option below, which does not exist.
dataRangePalette.prototype.getColor = function(value) {
  if(this.range_mode=='bound') {
    for(var i=0;i<this.num_colors;++i) {
      if(this.compare_mode[i]=='eq_bottom')  if(value>=this.cutoff[i] && value<this.cutoff[i+1])   return this.color[i];
      if(this.compare_mode[i]=='eq_both')    if(value>=this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_top')     if(value>this.cutoff[i] && value<=this.cutoff[i+1])   return this.color[i];
      }
    }

  if(this.range_mode=='unbound_top') {
    for(var i=0;i<this.num_colors-1;++i) {
      if(this.compare_mode[i]=='eq_bottom')  if(value>=this.cutoff[i] && value<this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_both')    if(value>=this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_top')     if(value>this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      }
    if(this.compare_mode[this.num_colors-1]=='eq_bottom')  if(value>=this.cutoff[this.num_colors-1])  return this.color[this.num_colors-1];
    if(this.compare_mode[this.num_colors-1]=='eq_top')     if(value>this.cutoff[this.num_colors-1])   return this.color[this.num_colors-1];
    }

  if(this.range_mode=='unbound_botton') {
    if(this.compare_mode[0]=='eq_bottom')  if(value<this.cutoff[0])   return this.color[0];
    if(this.compare_mode[0]=='eq_top')     if(value<=this.cutoff[0])  return this.color[0];
    for(var i=1;i<this.num_colors;++i) {
      if(this.compare_mode[i]=='eq_bottom')  if(value>=this.cutoff[i] && value<this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_both')    if(value>=this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_top')     if(value>this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      }
    }

  if(this.range_mode=='unbound_both') {
    if(this.compare_mode[0]=='eq_bottom')  if(value<this.cutoff[0])   return this.color[0];
    if(this.compare_mode[0]=='eq_top')     if(value<=this.cutoff[0])  return this.color[0];
    for(var i=1;i<this.num_colors-1;++i) {
      if(this.compare_mode[i]=='eq_bottom')  if(value>=this.cutoff[i] && value<this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_both')    if(value>=this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      if(this.compare_mode[i]=='eq_top')     if(value>this.cutoff[i] && value<=this.cutoff[i+1])  return this.color[i];
      }
    if(this.compare_mode[this.num_colors-1]=='eq_bottom')  if(value>=this.cutoff[this.num_colors-1])  return this.color[this.num_colors-1];
    if(this.compare_mode[this.num_colors-1]=='eq_top')     if(value>this.cutoff[this.num_colors-1])   return this.color[this.num_colors-1];
    }

  return this.color[1];
  };

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function DataPalette(num_colors) {
  this.num_colors = num_colors;
  this.mode       = "ge";
  this.color      = new Array(num_colors);
  this.cutoff     = new Array(num_colors-1);
  }

DataPalette.prototype.GetColor = function(data_value) {
  ret_color = this.color[0];
  if(this.mode == "ge") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  if(this.mode == "gt") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  return ret_color;
  };

           //---two names - find any uses of above and purge
DataPalette.prototype.getColor = function(data_value) {
  ret_color = this.color[0];
  if(this.mode == "ge") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  if(this.mode == "gt") {
    for(var i=1;i<this.num_colors;++i) {
      if(data_value>=this.cutoff[i-1])  ret_color = this.color[i];
      }
    }
  return ret_color;
  };


