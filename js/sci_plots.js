//############################################################################
//       library_plots.js
//
//       by Brian Kaney, Oct 2013
//############################################################################

//----------------------------------------------------------------------------
//    CartesianCoordinateSystem object
//----------------------------------------------------------------------------

//OrderedPairArray

function Point2D(x,y) {
  this.x = x;
  this.y = y;
  }

//----------------------------------------------------------------------------

function ScreenRect(x_origin,y_origin,width,height) {
  this.origin = new Point2D(x_origin,y_origin);
  this.width  = width;
  this.height = height;
  return; 
  }

function CartesianRect(x_units,min_x,max_x,y_units,min_y,max_y) {
  this.x_units = x_units;   //--not used yet, needed?
  this.min_x   = min_x;
  this.max_x   = max_x;

  this.y_units = y_units;
  this.min_y   = min_y;
  this.max_y   = max_y;
  return; 
  }

function CoordRect(x_units,x_type,min_x,max_x,y_units,y_type,min_y,max_y) {
  this.x_units = x_units;
  this.x_units = x_type;
  this.min_x   = min_x;
  this.max_x   = max_x;

  this.y_units = y_units;
  this.y_units = y_type;
  this.min_y   = min_y;
  this.max_y   = max_y;
  return; 
  }

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function ScreenCartesian() {
  this.screen = new ScreenRect(0,0,800,640);
  this.coord  = new CartesianRect("m",0,100,"m",0,100);
  return; 
  }

ScreenCartesian.prototype.SetScreen = function(x_origin,y_origin,width,height) {
  this.screen.origin.x = x_origin;
  this.screen.origin.y = y_origin;
  if(width==0) width = 1;
  if(height==0) height = 1;
  this.screen.width = width;
  this.screen.height = height;
  return;
  };

ScreenCartesian.prototype.SetCartesian = function(x_units,min_x,max_x,y_units,min_y,max_y) {
  this.coord.x_units = x_units;
  this.coord.min_x   = min_x;
  this.coord.max_x   = max_x;

  this.coord.y_units = y_units;
  this.coord.min_y   = min_y;
  this.coord.max_y   = max_y;
  return;
  };

ScreenCartesian.prototype.ScrPtFromCoordPt = function(coord_pt) {
  var scr_pt = new Point2D(-9876,-9876);
  var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
  var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
  var scr_pt = new Point2D(this.screen.origin.x+(coord_pt.x-this.coord.min_x)/x_scale,this.screen.origin.y-(coord_pt.y-this.coord.min_y)/y_scale);
  return scr_pt;
  };

ScreenCartesian.prototype.CoordPtFromScrPt = function(scr_pt) {
  var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
  var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
  var coord_pt = new Point2D(this.coord.min_x + (scr_pt.x-this.screen.origin.x)*this.x_scale,this.coord.min_y +(this.screen.origin.y-scr_pt.y)*this.y_scale);
  return coord_pt;
  };

//----------------------------------------------------------------------------

function HistoBins(num_bins,min_value,max_value) {
  this.num_bins  = num_bins;
  this.min_value = min_value;
  this.max_value = max_value;

  this.bin = new Array(num_bins);
  for(var i=0;i<num_bins;++i) { this.bin[i] = 0; }

  return; 
  }

HistoBins.prototype.ImportBins = function(data) {
  for(var i=0;i<this.num_bins;++i) {
    this.bin[i] = data[i];
    }

  return;
  };

HistoBins.prototype.BinData = function(num_data,data) {
  for(var i=0;i<num_data;++i) {
    if(data[i]<this.min_value || data[i]>this.max_value) continue;
    
    ++this.bin[Math.floor(this.num_bins*(data[i]-this.min_value)/(this.max_value-this.min_value))];  //--handle case where data[i]==max_value
    }

  return;
  };

HistoBins.prototype.LogBinData = function(num_data,data) {
  for(var i=0;i<num_data;++i) {
    if(data[i]<this.min_value || data[i]>this.max_value) continue;
    
    ++this.bin[Math.floor(this.num_bins*(Math.log(data[i])-Math.log(this.min_value))/(Math.log(this.max_value)-Math.log(this.min_value)))];
    }

  return;
  };

HistoBins.prototype.NormalizeWeightByCnt = function() {
  var sum_bins = 0;
  for(var i=0;i<this.num_bins;++i) {
    sum_bins = sum_bins + this.bin[i];
    }

  if(sum_bins==0) return;

  for(var i=0;i<this.num_bins;++i) {
    this.bin[i] = this.bin[i]/sum_bins;
    }

  return;
  };

HistoBins.prototype.NormalizeWeightByValue = function() {
//  var value_per_bin = (this.max_value-this.min_value)/this.num_bins

  var mid_bin_value = new Array(this.num_bins)
  for(var i=0;i<this.num_bins;++i) {
    mid_bin_value[i] = Math.pow(Math.E,Math.log(this.min_value) + (i+0.5)*(Math.log(this.max_value)-Math.log(this.min_value))/this.num_bins);
    }

  var sum_bins = 0;
  for(var i=0;i<this.num_bins;++i) {
    sum_bins = sum_bins + this.bin[i]*mid_bin_value[i];
    }

  if(sum_bins==0) return;

  for(var i=0;i<this.num_bins;++i) {
    this.bin[i] = (this.bin[i]*mid_bin_value[i])/sum_bins;
    }

  return;
  };

function HistoBins2D(num_x_bins,num_y_bins,min_x_value,min_y_value,max_x_value,max_y_value) {
  this.num_x_bins  = num_x_bins;
  this.num_y_bins  = num_y_bins;
  this.min_x_value = min_x_value;
  this.min_y_value = min_y_value;
  this.max_x_value = max_x_value;
  this.max_y_value = max_y_value;

  this.bin = new Array(num_x_bins);
  for(var i=0;i<num_x_bins;++i) {
    this.bin[i] = new Array(num_y_bins);
    for(var j=0;j<num_y_bins;++j) {
      this.bin[i][j] = 0;
      }
    }

  return; 
  }


HistoBins2D.prototype.ImportBins = function(data) {
  for(var i=0;i<this.num_x_bins;++i) {
    for(var j=0;j<this.num_y_bins;++j) {
      this.bin[i][j] = data[i][j];
      }
    }

  return;
  };


HistoBins2D.prototype.BinData = function(num_data,x_data,y_data) {
  for(var i=0;i<num_data;++i) {
    if(x_data[i]<this.min_x_value || x_data[i]>this.max_x_value || y_data[i]<this.min_y_value || y_data[i]>this.max_y_value) continue;
    
    var x_index = Math.floor(this.num_x_bins*(x_data[i]-this.min_x_value)/(this.max_x_value-this.min_x_value));
    var y_index = Math.floor(this.num_y_bins*(y_data[i]-this.min_y_value)/(this.max_y_value-this.min_y_value));
    ++this.bin[x_index][y_index];
    }

  return;
  };

HistoBins2D.prototype.LogBinData = function(num_data,x_data,y_data) {
  for(var i=0;i<num_data;++i) {
    if(x_data[i]<this.min_x_value || x_data[i]>this.max_x_value || y_data[i]<this.min_y_value || y_data[i]>this.max_y_value) continue;
    
    var x_index = Math.floor(this.num_x_bins*(Math.log(x_data[i])-Math.log(this.min_x_value))/(Math.log(this.max_x_value)-Math.log(this.min_x_value)));
    var y_index = Math.floor(this.num_y_bins*(Math.log(y_data[i])-Math.log(this.min_y_value))/(Math.log(this.max_y_value)-Math.log(this.min_y_value)));
    ++this.bin[x_index][y_index];
    }

  return;
  };

//function HistoScatterPlot(num_colors) {
//  this.num_colors = num_colors;
//  this.bin_cuts   = new Array(num_colors+1);
//  this.colors     = new Array(num_colors);

//  return; 
//  }

HistoBins2D.prototype.Draw = function(canvas_id,screen,palette) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  var w = screen.width/this.num_x_bins;
  var h = screen.height/this.num_y_bins;

  for(var i=0;i<this.num_x_bins;++i) {
    for(var j=0;j<this.num_y_bins;++j) {
      var x = screen.origin.x + Math.floor(i*w);
      var y = screen.origin.y - Math.floor((j+1)*h); 

      ctx.fillStyle = palette.GetColor(this.bin[i][j]);

      ctx.fillRect(x,y,Math.ceil(w),Math.ceil(h));
      }
    }
          //---diagonal needs to be separate or optional
  ctx.strokeStyle = "#000000";
  ctx.beginPath();
  ctx.moveTo(screen.origin.x,screen.origin.y);
  ctx.lineTo(screen.origin.x+screen.width,screen.origin.y-screen.height);
  ctx.stroke();
  ctx.closePath();

  return;
  };

//----------------------------------------------------------------------------

function ScreenCoord() {
  this.screen = new ScreenRect(0,0,800,640);
  this.coord  = new CoordRect("m","cart",0,100,"m","cart",0,100);
  return; 
  }

ScreenCoord.prototype.SetScreen = function(x_origin,y_origin,width,height) {
  this.screen.origin.x = x_origin;
  this.screen.origin.y = y_origin;
  if(width==0) width = 1;
  if(height==0) height = 1;
  this.screen.width = width;
  this.screen.height = height;
  return;
  };

ScreenCoord.prototype.SetCoord = function(x_units,x_type,min_x,max_x,y_units,y_type,min_y,max_y) {
  this.coord.x_units = x_units;
  this.coord.x_type  = x_type;
  this.coord.min_x   = min_x;
  this.coord.max_x   = max_x;

  this.coord.y_units = y_units;
  this.coord.y_type  = y_type;
  this.coord.min_y   = min_y;
  this.coord.max_y   = max_y;
  return;
  };

ScreenCoord.prototype.ScrPtFromCoordPt = function(coord_pt) {
  var scr_pt = new Point2D(-9876,-9876);

  if(this.coord.x_type == "cart") {
    var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
    scr_pt.x = this.screen.origin.x + (coord_pt.x-this.coord.min_x)/x_scale;
    }
  if(this.coord.x_type == "log" && coord_pt.x>0) {
    var x_scale = (Math.log(this.coord.max_x)-Math.log(this.coord.min_x))/this.screen.width;
    scr_pt.x = this.screen.origin.x + (Math.log(coord_pt.x)-Math.log(this.coord.min_x))/x_scale;
    }

  if(this.coord.y_type == "cart") {
    var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
    scr_pt.y = this.screen.origin.y - (coord_pt.y-this.coord.min_y)/y_scale;
    }
  if(this.coord.y_type == "log" && coord_pt.y>0) {
    var y_scale = (Math.log(this.coord.max_y)-Math.log(this.coord.min_y))/this.screen.height;
    scr_pt.y = this.screen.origin.y - (Math.log(coord_pt.y)-Math.log(this.coord.min_y))/y_scale;
    }

  return scr_pt;
  };

//---not tested anywhere
// ---not completed
ScreenCoord.prototype.CoordPtFromScrPt = function(scr_pt) {
  var coord_pt = new Point2D(this.coord.min_x,this.coord.min_y);

  if(this.coord.x_type == "cart") {
    var x_scale = (this.coord.max_x-this.coord.min_x)/this.screen.width;
    coord_pt.x = this.coord.min_x + (scr_pt.x-this.screen.origin.x)*this.x_scale;
    }
  if(this.coord.x_type == "log") {
    }

  if(this.coord.y_type == "cart") {
    var y_scale = (this.coord.max_y-this.coord.min_y)/this.screen.height;
    coord_pt.y = this.coord.min_y + (this.screen.origin.y-scr_pt.y)*this.y_scale;
    }
  if(this.coord.y_type == "log") {
    }

  return coord_pt;
  };

//----------------------------------------------------------------------------

function ScatterPlot(symbol_type,symbol_param,symbol_color) {
  this.symbol_type    = symbol_type;
  this.symbol_param   = symbol_param;
  this.symbol_color   = symbol_color;
  return;
  }

ScatterPlot.prototype.Draw = function(canvas_id,rect,num_pts,x_data,y_data) {
  var value = new Point2D(0,0);
  var point = new Point2D(0,0);

  for(var i=0;i<=num_pts;++i) {
    if(x_data[i]<rect.coord.min_x || x_data[i]>rect.coord.max_x || y_data[i]<rect.coord.min_y || y_data[i]>rect.coord.max_y) continue;

    value.x = x_data[i];
    value.y = y_data[i];
    point = rect.ScrPtFromCoordPt(value);

    DrawSymbol(canvas_id,point.x,point.y,this.symbol_type);
    }
  }


function DrawSymbol(canvas_id,x,y,type) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.fillStyle = "#0000FF";
  ctx.fillRect(x-2,y-2,5,5);
  }




//----------------------------------------------------------------------------

function LinePlot(line_width,line_color,symbol_type,symbol_color,missing_thresh) {
  this.line_width     = line_width;
  this.line_color     = line_color;
  this.symbol_type    = symbol_type;
  this.symbol_color   = symbol_color;
  this.missing_thresh = missing_thresh;
  return;
  }

LinePlot.prototype.DrawDepDataVsIndepData = function(canvas_id,rect,num_pts,first_x_value,last_x_value,y_data) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  var value = new Point2D(0,0);
  var point = new Point2D(0,0);

  if(this.line_width>0) {
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.line_color;

    var start = 1;
    ctx.beginPath();
    for(var i=0;i<num_pts;++i) {
      if(y_data[i]<this.missing_thresh) {
        start = 1;
        continue;
        }

      if(y_data[i]>=this.missing_thresh) {
        value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
        value.y = y_data[i];
        point = rect.ScrPtFromCoordPt(value);

        if(start==0)  ctx.lineTo(point.x,point.y);
        if(start==1) {
          ctx.moveTo(point.x,point.y);
          start = 0;
          }
        }
      }
    ctx.stroke();
    ctx.closePath();
    }

  ctx.fillStyle = this.symbol_color;  //---only one symbol type
  for(var i=0;i<num_pts;++i) {
    if(y_data[i]>=this.missing_thresh) {
      value.x = first_x_value + i*(last_x_value-first_x_value)/(num_pts-1);
      value.y = y_data[i];
      point = rect.ScrPtFromCoordPt(value);
//      ctx.fillRect(point.x-1,point.y-1,3,3);
//      ctx.fillRect(point.x-2,point.y-2,5,5);
        ctx.beginPath();
        ctx.arc(point.x,point.y,2,0,Math.PI*2,true);
        ctx.fill();
        ctx.closePath();
      }
    }
  return;
  };

//--Above simplifications are not made below yet...

LinePlot.prototype.DrawYDataVsXData = function(canvas_id,rect,num_pts,x_data,y_data) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  var plot_x,plot_y;

  if(this.line_width>0) {
    ctx.lineWidth = this.line_width;
    ctx.strokeStyle = this.line_color;

    var start = 1;
    ctx.beginPath();
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]<this.missing_thresh) {
        start = 1;
        continue;
        }

      if(y_data[i]>=this.missing_thresh) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));

        if(start==0)  ctx.lineTo(plot_x,plot_y);
        if(start==1) {
          ctx.moveTo(plot_x,plot_y);
          start = 0;
          }
        }
      }
    ctx.stroke();
    ctx.closePath();
    }


  if(this.symbol_type=="big_dot")  {
    ctx.fillStyle = this.symbol_color;
    ctx.strokeStyle = this.symbol_color;
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]>=0) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));

        ctx.beginPath();
        ctx.arc(plot_x,plot_y,7,0,Math.PI*2,true);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();
        }
      }
    }

  else {
    ctx.fillStyle = this.symbol_color;
    for(var i=0;i<=num_pts;++i) {
      if(y_data[i]>=0) {
        plot_x = rect.screen.origin.x + (x_data[i]-rect.coord.min_x)*(rect.screen.width/(rect.coord.max_x-rect.coord.min_x));
        plot_y = rect.screen.origin.y - (y_data[i]-rect.coord.min_y)*(rect.screen.height/(rect.coord.max_y-rect.coord.min_y));
        ctx.fillRect(plot_x-2,plot_y-2,5,5);
        }
      }
    }

  return;
  };
 
//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function RectangleGrid(x,y,width,height,num_x,num_y,grid_line_width,grid_color,frame_line_width,frame_color,back_color) {
  this.origin = new screenPoint(x,y);

  this.width = width;
  this.height = height;

  this.num_x = num_x;
  this.num_y = num_y;

  this.grid_line_width = grid_line_width;
  this.grid_color = grid_color;

  this.frame_line_width = frame_line_width;
  this.frame_color = frame_color;

  this.back_color = back_color;
  }

RectangleGrid.prototype.Draw = function(canvas_id) {
  if(this.num_x<=0 || this.num_y<=0) return;
  
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.lineWidth = this.grid_line_width;
  var offset = 0.5*this.grid_line_width%2;

  if(this.back_color != "none") {
    ctx.fillStyle = this.back_color;
    ctx.fillRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  ctx.strokeStyle = this.grid_color;
  for(var i=0;i<=this.num_y;++i) {
    ctx.beginPath();
    ctx.moveTo(this.origin.x,this.origin.y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.lineTo(this.origin.x+this.width,this.origin.y+offset-Math.floor(0.5+i*(this.height)/this.num_y));
    ctx.stroke();
    ctx.closePath();
    }
  for(var i=0;i<=this.num_x;++i) {
    ctx.beginPath();
    ctx.moveTo(this.origin.x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y-this.height);
    ctx.lineTo(this.origin.x+offset+Math.floor(0.5+i*(this.width)/this.num_x),this.origin.y);
    ctx.stroke();
    ctx.closePath();
    }

  if(this.frame_color != "none") {      //--not yet tested
    ctx.lineWidth = this.frame_line_width;
    offset = 0.5*this.frame_line_width%2;
    ctx.strokeStyle = this.frame_color;
    ctx.strokeRect(this.origin.x+offset,this.origin.y+offset-this.height,this.width,this.height);
    }

  return;
  };

//----------------------------------------------------------------------------

function Ruler() {
  this.x_origin = 0;
  this.y_origin = 0;
  this.rule_length = 100;
  this.orientation = "horiz";
  this.color = "#000000";
  this.rule_width = 1;

  this.num_major_div = 10;
  this.major_tic_length = 12;
  this.major_tic_width = 1;

  this.num_minor_div = 20;
  this.minor_tic_length = 6;
  this.minor_tic_width = 1;

  this.min_label = 0;
  this.max_label = 10;
  this.num_decimals = 0;

  this.x_off = -8;  //---default is suited to vertical implementation
  this.y_off = 5;

  this.label_font = "bold 12pt Arial";
  this.title_font = "bold 20pt Arial";
  this.title = "";
  }

Ruler.prototype.SetRule = function(x_origin,y_origin,rule_length,orientation,color,rule_width) {
  this.x_origin = x_origin;
  this.y_origin = y_origin;
  this.rule_length = rule_length;
  this.orientation = orientation;
  this.color = color;
  this.rule_width = rule_width;

  return;
  };

Ruler.prototype.SetTics = function(num_major_div,major_tic_length,major_tic_width,num_minor_div,minor_tic_length,minor_tic_width) {
  this.num_major_div = num_major_div;
  this.major_tic_length = major_tic_length;
  this.major_tic_width = major_tic_width;

  this.num_minor_div = num_minor_div;
  this.minor_tic_length = minor_tic_length;
  this.minor_tic_width = minor_tic_width;

  return;
  };

Ruler.prototype.SetLabels = function(min_label,max_label,num_decimals,x_off,y_off,label_font,title_font,title) {
  this.min_label = min_label;
  this.max_label = max_label;
  this.num_decimals = Math.floor(num_decimals);
  if(this.num_decimals<0)  this.num_decimals = 0;
  if(this.num_decimals>3)  this.num_decimals = 3;
  this.x_off = x_off;
  this.y_off = y_off;

  this.title_font = title_font;
  this.label_font = label_font;
  this.title = title;

  return;
  };

Ruler.prototype.DrawRule = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.rule_width%2;

  ctx.lineWidth = this.rule_width;
  ctx.beginPath();
  if(this.orientation == "vert") {
    ctx.moveTo(this.x_origin+major_offset,this.y_origin);
    ctx.lineTo(this.x_origin+major_offset,this.y_origin-this.rule_length);
    }
  if(this.orientation == "horiz") {
    ctx.moveTo(this.x_origin,this.y_origin+major_offset);
    ctx.lineTo(this.x_origin+this.rule_length,this.y_origin+major_offset);
    }
  ctx.stroke();
  ctx.closePath();

  return;
  };

Ruler.prototype.DrawTics = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.major_tic_width%2;
  var minor_offset = 0.5*this.minor_tic_width%2;

  ctx.lineWidth = this.minor_tic_width;
  for(var i=0;i<=this.num_minor_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+minor_offset-Math.floor(0.5+i*(this.rule_length)/this.num_minor_div));
      ctx.lineTo(this.x_origin-this.minor_tic_length,this.y_origin+minor_offset-Math.floor(0.5+i*(this.rule_length)/this.num_minor_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+minor_offset+Math.floor(0.5+i*(this.rule_length)/this.num_minor_div),this.y_origin+1+minor_offset);
      ctx.lineTo(this.x_origin+minor_offset+Math.floor(0.5+i*(this.rule_length)/this.num_minor_div),this.y_origin+this.minor_tic_length+1+minor_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  ctx.lineWidth = this.major_tic_width;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      ctx.lineTo(this.x_origin-this.major_tic_length,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+1+major_offset);
      ctx.lineTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+this.major_tic_length+1+major_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  return;
  };

Ruler.prototype.DrawLabels = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.font = this.label_font;

  var message;
  var value;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.fillStyle = this.color;

    value = this.min_label + i*(this.max_label-this.min_label)/this.num_major_div;
    if(value != (Math.floor(value*Math.pow(10,this.num_decimals)))/Math.pow(10,this.num_decimals))  ctx.fillStyle = "#FF0000";

    message = value.toFixed(this.num_decimals);
    if(this.orientation == "vert") {
      ctx.fillText(message,this.x_origin-this.major_tic_length-ctx.measureText(message).width+this.x_off,
                   this.y_origin-Math.floor(0.5+i*(this.rule_length)/this.num_major_div)+this.y_off);
      }
    if(this.orientation == "horiz") {
      ctx.fillText(message,this.x_origin+Math.floor(0.5+i*(this.rule_length)/this.num_major_div-ctx.measureText(message).width/2),
                   this.y_origin+this.major_tic_length+this.y_off);
      }
    }

  return;
  };

Ruler.prototype.DrawTitle = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.fillStyle = this.color;
  ctx.font = this.title_font;
  if(this.orientation == "vert") {
    ctx.save();
    ctx.translate(this.x_origin-52,this.y_origin-this.rule_length/2+ctx.measureText(this.title).width/2);
//    ctx.translate(this.x_origin-46,this.y_origin-this.rule_length/2+ctx.measureText(this.title).width/2);
    ctx.rotate(-0.5*Math.PI);
    ctx.fillText(this.title,0,0);
    ctx.restore();
    }
  if(this.orientation == "horiz") {    //---need to add title mode and other offset varibales (y_off=46 in some places and 64 others))
    ctx.fillText(this.title,this.x_origin+this.rule_length/2-ctx.measureText(this.title).width/2,this.y_origin+46);
    }

  return;
  };

Ruler.prototype.DrawAll = function(canvas_id) {
  this.DrawRule(canvas_id);
  this.DrawTics(canvas_id);
  this.DrawLabels(canvas_id);
  this.DrawTitle(canvas_id);

  return;
  };

Ruler.prototype.ClearCanvas = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.clearRect(0,0,document.getElementById(canvas_id).width,document.getElementById(canvas_id).height);
  }




Ruler.prototype.DrawLogTics = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = this.color;
  var major_offset = 0.5*this.major_tic_width%2;
  var minor_offset = 0.5*this.minor_tic_width%2;

  ctx.lineWidth = this.minor_tic_width;

  var num_tic_per_major = 8;     //--not all choices make sense, how to handle
  var length_major_div = Math.floor(this.rule_length/this.num_major_div);
  var minor_tic_pix = new Array(num_tic_per_major);
  
  for(var i=0;i<num_tic_per_major;++i) {
    minor_tic_pix[i] = length_major_div*(Math.log(2+i)/Math.log(10));
    }

  for(var i=0;i<this.num_major_div;++i) {
    for(var j=0;j<num_tic_per_major;++j) {
      ctx.beginPath();
      if(this.orientation == "vert") {
        ctx.moveTo(this.x_origin,this.y_origin+minor_offset-i*length_major_div-minor_tic_pix[j]);
        ctx.lineTo(this.x_origin-this.minor_tic_length,this.y_origin+minor_offset-i*length_major_div-minor_tic_pix[j]);
        }
      if(this.orientation == "horiz") {
        ctx.moveTo(this.x_origin+minor_offset+i*length_major_div+minor_tic_pix[j],this.y_origin+1+minor_offset);
        ctx.lineTo(this.x_origin+minor_offset+i*length_major_div+minor_tic_pix[j],this.y_origin+this.minor_tic_length+1+minor_offset);
        }
      ctx.stroke();
      ctx.closePath();
      }
    }

  ctx.lineWidth = this.major_tic_width;
  for(var i=0;i<=this.num_major_div;++i) {
    ctx.beginPath();
    if(this.orientation == "vert") {
      ctx.moveTo(this.x_origin,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      ctx.lineTo(this.x_origin-this.major_tic_length,this.y_origin+major_offset-Math.floor(0.5+i*(this.rule_length)/this.num_major_div));
      }
    if(this.orientation == "horiz") {
      ctx.moveTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+1+major_offset);
      ctx.lineTo(this.x_origin+major_offset+Math.floor(0.5+i*(this.rule_length)/this.num_major_div),this.y_origin+this.major_tic_length+1+major_offset);
      }
    ctx.stroke();
    ctx.closePath();
    }

  return;
  };

Ruler.prototype.DrawLogLabels = function(canvas_id) {
  var ctx = document.getElementById(canvas_id).getContext('2d');

  ctx.fillStyle = this.color;
  ctx.font = this.label_font;

  var message;
  var value;
  for(var i=0;i<=this.num_major_div;++i) {
    value = this.min_label*Math.pow(10,i);

    message = value.toString();
    if(this.orientation == "vert") {
      ctx.fillText(message,this.x_origin-this.major_tic_length-ctx.measureText(message).width+this.x_off,
                   this.y_origin-Math.floor(0.5+i*(this.rule_length)/this.num_major_div)+this.y_off);
      }
    if(this.orientation == "horiz") {
      ctx.fillText(message,this.x_origin+Math.floor(0.5+i*(this.rule_length)/this.num_major_div-ctx.measureText(message).width/2),
                   this.y_origin+this.major_tic_length+1+this.y_off);
      }
    }

  return;
  };

Ruler.prototype.DrawLogAll = function(canvas_id) {
  this.DrawRule(canvas_id);
  this.DrawLogTics(canvas_id);
  this.DrawLogLabels(canvas_id);
  this.DrawTitle(canvas_id);

  return;
  };

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

function RectanglePlotBlank(x,y,width,height,num_main_x,num_fine_x,num_main_y,num_fine_y,
                            main_line_width,main_color,fine_line_width,fine_color,main_tic_len,fine_tic_len,frame_color,back_color) {
  this.main_title = "";
  this.origin = new screenPoint(x,y);
  this.width  = width;
  this.height = height;

  this.main_grid = new RectangleGrid(x,y,width,height,num_main_x,num_main_y,main_line_width,main_color,main_line_width,frame_color,"none");
  this.fine_grid = new RectangleGrid(x,y,width,height,num_fine_x,num_fine_y,fine_line_width,fine_color,0,"none",back_color);

  this.x_rule = new Ruler();
  this.x_rule.SetRule(x,y,width,"horiz",frame_color,main_line_width);
  this.x_rule.SetTics(num_main_x,main_tic_len,main_line_width,num_fine_x,fine_tic_len,1);
  this.x_rule.SetLabels(0,10,1,-12,22,"bold 12pt Arial","bold 12pt Arial","");  //--not crazy about way title is set

  this.y_rule = new Ruler();
  this.y_rule.SetRule(x,y,height,"vert",frame_color,main_line_width);
  this.y_rule.SetTics(num_main_y,main_tic_len,main_line_width,num_fine_y,fine_tic_len,1);
  this.y_rule.SetLabels(0,10,1,-10,6,"bold 12pt Arial","bold 12pt Arial","");
  }

RectanglePlotBlank.prototype.Draw = function(canvas_id) {
  this.fine_grid.Draw(canvas_id);
  this.main_grid.Draw(canvas_id);

  this.x_rule.DrawAll(canvas_id);
  this.y_rule.DrawAll(canvas_id);

  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.fillStyle = this.frame_color;
  ctx.font = "bold 16pt Arial";
  ctx.fillText(this.main_title,this.origin.x+this.width/2-ctx.measureText(this.main_title).width/2,this.origin.y-this.height-30);

  return;
  };

//----------------------------------------------------------------------------

RectanglePlotBlank.prototype.SetOrigin = function(x,y) {
  this.origin.x = x;
  this.origin.y = y;

  this.main_grid.origin.x = x;
  this.main_grid.origin.y = y;
  this.fine_grid.origin.x = x;
  this.fine_grid.origin.y = y;
                                //---note diff in handling of origin (2 var vs 1 object).  Seems to be no big advantages - just inconsistent
  this.x_rule.x_origin = x;
  this.x_rule.y_origin = y;
  this.y_rule.x_origin = x;
  this.y_rule.y_origin = y;

  return;
  };

RectanglePlotBlank.prototype.SetDimensions = function(width,height) {
  this.width  = width;
  this.height = height;

  this.main_grid.width  = width;
  this.main_grid.height = height;
  this.fine_grid.width  = width;
  this.fine_grid.height = height;

  this.x_rule.rule_length = width;
  this.y_rule.rule_length = height;
  return;
  };


RectanglePlotBlank.prototype.SetGrids = function(num_main_x,num_main_y,num_fine_x,num_fine_y) {
  this.main_grid.num_x = num_main_x;
  this.main_grid.num_y = num_main_y;
  this.fine_grid.num_x = num_fine_x;
  this.fine_grid.num_y = num_fine_y;

  this.x_rule.SetTics(num_main_x,this.x_rule.major_tic_length,this.x_rule.major_tic_width,num_fine_x,this.x_rule.minor_tic_length,this.x_rule.minor_tic_width);
  this.y_rule.SetTics(num_main_y,this.y_rule.major_tic_length,this.y_rule.major_tic_width,num_fine_y,this.y_rule.minor_tic_length,this.y_rule.minor_tic_width);

  return;
  };

/*
handle special plot overlays (best fit lines/avg levels) and background (greyed out regions) as additional functions acting on a RectanglePlotBlank object?  The following sample is from my scatterplot grey out region code

  var bar_thickness;
  ctx.fillStyle = "rgb(160,160,160)";
  bar_thickness = Math.floor(0.5+axis_length*amount_thresh[gthresh_min_index]/scale_max[scat_max_index]);
  if(gthresh_min_index==1)       bar_thickness=2;
  if(bar_thickness>axis_length)  bar_thickness=axis_length;
  ctx.fillRect(x_origin,y_origin-axis_length,bar_thickness,axis_length);
  bar_thickness = Math.floor(0.5+axis_length*(scale_max[scat_max_index]-amount_thresh[gthresh_max_index])/scale_max[scat_max_index]);
  if(bar_thickness<0)  bar_thickness=0;
  ctx.fillRect(x_origin+axis_length-bar_thickness,y_origin-axis_length,bar_thickness,axis_length);

  bar_thickness = Math.floor(0.5+axis_length*amount_thresh[qthresh_min_index]/scale_max[scat_max_index]);
  if(qthresh_min_index==1)       bar_thickness=2;
  if(bar_thickness>axis_length)  bar_thickness=axis_length;
  ctx.fillRect(x_origin,y_origin-bar_thickness,axis_length,bar_thickness);
  bar_thickness = Math.floor(0.5+axis_length*(scale_max[scat_max_index]-amount_thresh[qthresh_max_index])/scale_max[scat_max_index]);
  if(bar_thickness<0)  bar_thickness=0;
  ctx.fillRect(x_origin,y_origin-axis_length,axis_length,bar_thickness);
*/

//----------------------------------------------------------------------------

/*
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
*/


