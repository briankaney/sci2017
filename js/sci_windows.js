//############################################################################
//       sci_windows.js
//
//       by Brian Kaney, May 2015
//############################################################################

function divSingleWindow(dwin_id_root,width) {
  var id_str;

  id_str = dwin_id_root.concat("_window");
  this.div_window_id = id_str;
  id_str = dwin_id_root.concat("_parked");
  this.parked_window_id = id_str;
  id_str = dwin_id_root.concat("_move");
  this.move_control_id = id_str;

  this.mouse_mode = "hover";
  this.win_status = "closed";

  this.width = width;
  this.close_width = 30;
  this.height = 25;
  this.margin = 6;
  this.ref_xoff = 0;
  this.ref_yoff = 0;

  this.park_label = "";
  this.park_width = "118px";
  this.park_height = "18px";
  this.park_top = "0px"; 
  this.park_left = "0px";
  this.park_container_id;

  this.button_color = "#DDE6DD";
  this.hover_color = "#FFFFFF";
  this.border_color = "#555555";
  this.under_color = "#E8E8E8";
  return; 
  }

divSingleWindow.prototype.setParkedWindow = function(park_label,park_width,park_top,park_left) {
  this.park_label = park_label;
  this.park_width = park_width + "px"; 
  this.park_top = park_top + "px"; 
  this.park_left = park_left + "px";
  return; 
  };

divSingleWindow.prototype.initialize = function(win_status) {
  var park_div = document.createElement('div');

//---sub for this
  park_div.id = this.parked_window_id;
  park_div.style.width = this.park_width;
  park_div.style.height = this.park_height;
  park_div.style.position = "absolute";
  park_div.style.top = this.park_top;
  park_div.style.left = this.park_left;
  park_div.style.backgroundColor = this.button_color;
  park_div.style.fontFamily = "arial";
  park_div.style.fontSize = "11pt";
  park_div.style.textAlign = "center";
  park_div.style.borderRadius = "4px";
  park_div.style.border = "1px solid #555555";
  park_div.style.paddingTop = "1px";

  document.getElementById(this.park_container_id).appendChild(park_div);
  park_div.innerHTML = this.park_label;

//  document.getElementById(this.parked_window_id).addEventListener('mousemove',this.defaultOpen.bind(this),false);
//  document.getElementById(this.parked_window_id).addEventListener('mousedown',this.defaultOpen.bind(this),false);
//  document.getElementById(this.parked_window_id).addEventListener('mouseout',this.defaultOpen.bind(this),false);

  var move_canvas = document.createElement('canvas');
  move_canvas.id = this.move_control_id;
  move_canvas.width = this.width;
  move_canvas.height = 40;
  move_canvas.style.position = "absolute";
  move_canvas.style.top = "0px";
  move_canvas.style.left = "0px";

  document.getElementById(this.div_window_id).appendChild(move_canvas);

//  document.getElementById(this.move_control_id).addEventListener('mousemove',this.defaultMove.bind(this),false);
//  document.getElementById(this.move_control_id).addEventListener('mousedown',this.defaultMove.bind(this),false);
//  document.getElementById(this.move_control_id).addEventListener('mouseup',this.defaultMove.bind(this),false);
//  document.getElementById(this.move_control_id).addEventListener('mouseout',this.defaultMove.bind(this),false);

  var ctx = document.getElementById(this.move_control_id).getContext('2d');
  ctx.fillStyle = "#CCCCCC";
  ctx.font = "bold 13pt Arial";
  ctx.fillRect(6,6,this.width-42,23);
  ctx.fillStyle = "#000000";
  ctx.fillText(this.park_label,(this.width-42-ctx.measureText(this.park_label).width)/2,23);
  ctx.fillStyle = "#D5BBBB";
  ctx.fillRect(this.width-6-30,6,30,23);
  ctx.fillStyle = "#FFFFFF";
  ctx.fillRect(this.width-6-21,15,12,5);
  ctx.strokeStyle = "#535666";
  ctx.strokeRect(this.width-6-21+0.5,15.5,11,4);
      
  this.win_status = win_status;
  this.setWindow();
  }

//divWindow.prototype.dwin_move_handler = function() {
//  this.defaultMove(e);
//  }

//function dwin_open_handler(e) {
//  divWin.defaultOpen(e);
//  }

divSingleWindow.prototype.setWindow = function() {
  if(this.win_status=='open') {
    document.getElementById(this.div_window_id).style.display = "inline";
    document.getElementById(this.parked_window_id).style.borderColor = this.under_color;
    document.getElementById(this.parked_window_id).style.backgroundColor = this.under_color;
    }
  if(this.win_status=='closed') {
    document.getElementById(this.div_window_id).style.display = "none";
    document.getElementById(this.parked_window_id).style.borderColor = this.border_color;
    document.getElementById(this.parked_window_id).style.backgroundColor = this.button_color;
    }
  };

divSingleWindow.prototype.singleOpen = function(e) {
  e.preventDefault();
  document.getElementById(this.parked_window_id).style.cursor = "default";

  if(e.type=='mousemove' && this.win_status=='closed') {
    document.getElementById(this.parked_window_id).style.backgroundColor = this.hover_color;
    }
  if(e.type=='mouseout' && this.win_status=='closed') {
    document.getElementById(this.parked_window_id).style.backgroundColor = this.button_color;
    }
  if(e.type=='mousedown') {
    if(this.win_status=='closed')  this.win_status = "open";
    else                           this.win_status = "closed";
    this.setWindow();
    }
  return;
  };

divSingleWindow.prototype.singleMove = function(e) {
  e.preventDefault();
  var pt = getMouseScreenPoint(this.div_window_id,e);

  if(e.type=="mouseup" || e.type=="mouseout") {
    this.mouse_mode="hover";
    }

  if(e.type=="mousedown" && pt.x>=this.margin && pt.x<=this.width-this.margin-this.close_width 
                         && pt.y>=this.margin && pt.y<=this.margin+this.height) {
    this.mouse_mode="drag";

    this.ref_xoff = pt.x;
    this.ref_yoff = pt.y;
    }

  if(e.type=="mousedown" && pt.x>this.width-this.margin-this.close_width && pt.x<=this.width-this.margin 
                         && pt.y>=this.margin && pt.y<=this.margin+this.height) {
    document.getElementById(this.div_window_id).style.display = "none";   //---replace with setWindow?
    document.getElementById(this.parked_window_id).style.borderColor = this.border_color;
    document.getElementById(this.parked_window_id).style.backgroundColor = this.button_color;
    this.win_status = "closed";
    }

  if(e.type=="mousemove" && this.mouse_mode=='drag') {
    var offset = document.getElementById(this.div_window_id).getBoundingClientRect();

    var value = offset.top + document.body.scrollTop + document.documentElement.scrollTop + pt.y - this.ref_yoff;
    document.getElementById(this.div_window_id).style.top = value + "px";

    value = offset.left + document.body.scrollLeft + document.documentElement.scrollLeft + pt.x - this.ref_xoff;
    document.getElementById(this.div_window_id).style.left = value + "px";
    }
  return; 
  };

/*   Room for improvement?  The above code doesn't work if the windows div are not declared in the original html
     document as being directly in the body.  If they are nested in another container within the body (with its
     own offsets) then this fails.

     I want to eventually fix the hybrid behavior of declaring divs in the orig html and the lib.  Want to be
     able to place a specify all with js.  So this gets rolled into that fix.
*/

//----------------------------------------------------------------------
//----------------------------------------------------------------------

function divWindowSet(num_windows) {
  this.num_windows = num_windows;

  this.window_id = new Array(num_windows);
  this.div_win_handle = new Array(num_windows);
  this.window_width = new Array(num_windows);
  this.window_status = new Array(num_windows);

  this.park_container_id;
  this.park_win_label = new Array(num_windows);
  this.park_win_width = new Array(num_windows);
  this.park_win_top = new Array(num_windows);
  this.park_win_left = new Array(num_windows);
  this.park_win_color = new Array(num_windows);

  this.z_order = new Array(num_windows);

  return;
  }

divWindowSet.prototype.initialize = function() {
  for(var i=0;i<this.num_windows;++i) {
    this.div_win_handle[i] = new divSingleWindow(this.window_id[i],this.window_width[i]);
    this.div_win_handle[i].park_container_id = this.park_container_id;
    this.div_win_handle[i].setParkedWindow(this.park_win_label[i],this.park_win_width[i],this.park_win_top[i],this.park_win_left[i]);
    this.div_win_handle[i].button_color = this.park_win_color[i];
    this.div_win_handle[i].initialize(this.window_status[i]);

    document.getElementById(this.div_win_handle[i].parked_window_id).addEventListener('mousemove',this.masterOpen.bind(this),false);
    document.getElementById(this.div_win_handle[i].parked_window_id).addEventListener('mousedown',this.masterOpen.bind(this),false);
    document.getElementById(this.div_win_handle[i].parked_window_id).addEventListener('mouseout',this.masterOpen.bind(this),false);

    document.getElementById(this.div_win_handle[i].move_control_id).addEventListener('mousemove',this.masterMove.bind(this),false);
    document.getElementById(this.div_win_handle[i].move_control_id).addEventListener('mousedown',this.masterMove.bind(this),false);
    document.getElementById(this.div_win_handle[i].move_control_id).addEventListener('mouseup',this.masterMove.bind(this),false);
    document.getElementById(this.div_win_handle[i].move_control_id).addEventListener('mouseout',this.masterMove.bind(this),false);

    this.z_order[i] = i;
    }

  this.orderWindows();

  return; 
  };

divWindowSet.prototype.masterOpen = function(e) {
  var e_index = 0;
  for(var i=0;i<this.num_windows;++i) {
    if(e.target.id == this.div_win_handle[i].parked_window_id)  e_index = i;
    }
  this.div_win_handle[e_index].singleOpen(e);

  if(e.type == 'mousedown') {
    this.indexToTop(e_index);
    this.orderWindows();
    }
  return; 
  };

divWindowSet.prototype.masterMove = function(e) {
  var e_index = 0;
  for(var i=0;i<this.num_windows;++i) {
    if(e.target.id == this.div_win_handle[i].move_control_id)  e_index = i;
    }
  this.div_win_handle[e_index].singleMove(e);

  if(e.type == 'mousedown') {
    this.indexToTop(e_index);
    this.orderWindows();
    }
  return; 
  };

divWindowSet.prototype.indexToTop = function(index) {
  for(var i=0;i<this.num_windows;++i) {
    if(this.z_order[i]>this.z_order[index])   --this.z_order[i];
    }
  this.z_order[index] = this.num_windows-1;
  }

divWindowSet.prototype.orderWindows = function() {
  for(var i=0;i<this.num_windows;++i) {
    document.getElementById(this.div_win_handle[i].div_window_id).style.zIndex = 100 + this.z_order[i];
    }
  }

