//############################################################################
//       sci_symbols_canvas.js
//       by Brian Kaney, Mar 2016
//############################################################################

function drawLine(x1,y1,x2,y2,ctx) {
  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);
  ctx.stroke();
  }

function drawCanvasCircle(x,y,radius,style,canvas_id,ctx) {
  if(arguments.length==5)  var ctx = document.getElementById(canvas_id).getContext('2d');
  if(style.fill_color!='none')    ctx.fillStyle   = style.fill_color;
  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2,true);
  if(style.fill_color!='none')    ctx.fill();
  if(style.stroke_color!='none')  ctx.stroke();
  }

function drawCanvasRect(x,y,width,height,style,canvas_id,ctx) {
  if(arguments.length==6)  var ctx = document.getElementById(canvas_id).getContext('2d');
  if(style.fill_color!='none')    ctx.fillStyle = style.fill_color;
  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  if(style.fill_color!='none')    ctx.fillRect(Math.round(x),Math.round(y),Math.round(width-1),Math.round(height-1));
  if(style.stroke_color!='none')  ctx.strokeRect(Math.round(x)+0.5,Math.round(y)+0.5,Math.round(width-1),Math.round(height-1));
  }

function drawCanvasLine(x1,y1,x2,y2,style,canvas_id,ctx) {
  if(arguments.length==6)  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  drawLine(x1,y1,x2,y2,ctx);
  }

function drawCanvasPolygon(x,y,ctx,style,num_points) {  //--rename to 'DeltaList', same as below in thta it uses a descrete list, but uses x and y deltas instead of full vlalues.  Both can have an array version too!!!  
  if(style.fill_color!='none')    ctx.fillStyle = style.fill_color;
  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth   = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  for(var i=0;i<num_points;++i) {
    ctx.lineTo(x+arguments[5+2*i],y+arguments[5+2*i+1]);
    }
  ctx.closePath();
  if(style.fill_color!='none')    ctx.fill();
  if(style.stroke_color!='none')  ctx.stroke();
  }

function drawCanvasPolygonFullList(x,y,ctx,mode,num_points) {  //  here ctx, must be sent so just as easy to set colors there. passing styyle multi layers deep
//  if(style.fill_color!='none')    ctx.fillStyle = style.fill_color;
//  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
//  ctx.lineWidth   = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  for(var i=0;i<num_points;++i) {
    ctx.lineTo(arguments[5+2*i],arguments[5+2*i+1]);
    }
  ctx.closePath();
  if(mode=='both' || mode=='fill')    ctx.fill();
  if(mode=='both' || mode=='stroke')  ctx.stroke();
  }

//-------------------------------------------------------------------------

function drawCanvasPlus(x,y,length,style,canvas_id,ctx) {
  if(arguments.length==5)  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth   = style.line_width;
  var nudge = (ctx.lineWidth%2)/2;
  var ooch = ctx.lineWidth%2;   //--- to what extent have these 'tricks' been fully tested?  check it out sometime

  drawLine(x-length,Math.round(y)+nudge,x+length+ooch,Math.round(y)+nudge,ctx);
  drawLine(Math.round(x)+nudge,y-length,Math.round(x)+nudge,y+length+ooch,ctx);
  }

function drawCanvasX(x,y,width,height,style,canvas_id,ctx) {
  if(arguments.length==6)  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth   = style.line_width;

  drawLine(x-width/2,y-height/2,x+width/2,y+height/2,ctx);
  drawLine(x-width/2,y+height/2,x+width/2,y-height/2,ctx);
  }

//----------------------------------------------------------------------------










function drawCanvasLineArrow(x1,y1,x2,y2,arrow_length,style,canvas_id,ctx) {
  if(x2==x1 && y2==y1)  return;
  if(arguments.length==7)  var ctx = document.getElementById(canvas_id).getContext('2d');
  if(style.stroke_color!='none')  ctx.strokeStyle = style.stroke_color;
  ctx.lineWidth = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x1,y1);
  ctx.lineTo(x2,y2);

  var angle = Math.atan2(y2-y1,x2-x1);
//  ctx.lineTo(x2+arrow_length*Math.cos(angle),y2+arrow_length*Math.sin(angle));
  ctx.lineTo(x2-arrow_length*Math.cos(angle+Math.PI/6),y2-arrow_length*Math.sin(angle+Math.PI/6));
  ctx.moveTo(x2,y2);
  ctx.lineTo(x2-arrow_length*Math.cos(angle-Math.PI/6),y2-arrow_length*Math.sin(angle-Math.PI/6));

  if(style.stroke_color!='none')  ctx.stroke();
  }

function drawCanvasRectLabel(x,y,label_text,style,canvas_id) {
  if(arguments.length==5)  var ctx = document.getElementById(canvas_id).getContext('2d');
  var text_x_offset = Math.round(ctx.measureText(label_text).width/2);
  var text_y_offset = Math.round(approxFontHeight(style.font)/2);

  drawCanvasRect(x-text_x_offset-4,y-text_y_offset-4,2*(text_x_offset+4),2*(text_y_offset+4),style,canvas_id);
  ctx.fillStyle = style.text_color;
  ctx.font = style.font;
  ctx.fillText(label_text,x-text_x_offset,y+text_y_offset);
  }



//------------separate out

function drawHorizDataLegend(canvas_id,left_x,top_y,width,height,num_colors,colors,labels,label_font,tic_length,mode,ctx) {
  if(arguments.length==11)  var ctx = document.getElementById(canvas_id).getContext('2d');
  for(var i=0;i<num_colors;++i) {
    ctx.fillStyle = colors[i];
    if(i==0 && mode=="range_unbound") {
      ctx.beginPath();
      ctx.moveTo(left_x,top_y+height/2);
      ctx.lineTo(left_x+width/3,top_y);
      ctx.lineTo(left_x+width,top_y);
      ctx.lineTo(left_x+width,top_y+height);
      ctx.lineTo(left_x+width/3,top_y+height);
      ctx.closePath();
      ctx.fill();
      continue;
      }
    if(i==num_colors-1 && (mode=="range_unbound" || mode=="range_unbound_top")) {
      ctx.beginPath();
      ctx.moveTo(left_x+width*(num_colors-1),top_y);
      ctx.lineTo(left_x+width*(num_colors-1)+width*2/3,top_y);
      ctx.lineTo(left_x+width*(num_colors),top_y+height/2);
      ctx.lineTo(left_x+width*(num_colors-1)+width*2/3,top_y+height);
      ctx.lineTo(left_x+width*(num_colors-1),top_y+height);
      ctx.closePath();
      ctx.fill();
      continue;
      }
    ctx.fillRect(left_x+width*i,top_y,width,height);
    }

  ctx.beginPath();
  ctx.strokeStyle = "#000000";
  var num_tics = num_colors+1;
  if(mode=="range_unbound_top")  --num_tics;
  if(mode=="range_unbound")      num_tics=num_tics-2;
  for(var i=0;i<num_tics;++i) {
    ctx.moveTo(left_x+width*i,top_y+height);
    ctx.lineTo(left_x+width*i,top_y+height+tic_length);
    }
  ctx.stroke();

  ctx.font = label_font;
  ctx.fillStyle = "#000000";
  var indent = 0;
  var num_labels = num_colors;
  if(mode=="bin")            indent = width/2;
  if(mode=="range_unbound")  { indent = width; --num_labels; }
  if(mode=="range")          ++num_labels;
  for(var i=0;i<num_labels;++i) {
    ctx.fillText(labels[i],left_x+width*i+indent-ctx.measureText(labels[i]).width/2,top_y+height+tic_length+14);
    }

  return;
  }



