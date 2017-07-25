//############################################################################
//       sci_symbols_map.js
//       by Brian Kaney, March 2016
//############################################################################

function drawMapCircle(map,loc,radius,style,canvas_id,ctx) {
  if(arguments.length==5)  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = style.stroke_color;
  ctx.fillStyle   = style.fill_color;
  ctx.lineWidth   = style.line_width;

  var x = map.getXFromLon(loc.lon);
  var y = map.getYFromLat(loc.lat);
  ctx.beginPath();
  ctx.arc(x,y,radius,0,Math.PI*2,true);
  if(style.fill_color!='none')  ctx.fill();
  if(style.stroke_color!='none')  ctx.stroke();
  }

function drawMapRect(map,loc1,loc2,style,canvas_id,ctx) {
  if(arguments.length==5)  var ctx = document.getElementById(canvas_id).getContext('2d');
  ctx.strokeStyle = style.stroke_color;
  ctx.fillStyle   = style.fill_color;
  ctx.lineWidth   = style.line_width;

  var x1 = map.getXFromLon(loc1.lon);
  var y1 = map.getYFromLat(loc1.lat);
  var x2 = map.getXFromLon(loc2.lon);
  var y2 = map.getYFromLat(loc2.lat);
//  if(style.fill_color!='none')
//ctx.fillRect(Math.round(x),Math.round(y),Math.round(width-1),Math.round(height-1));
//  ctx.strokeRect(x1+0.5,y1+0.5,x2-x1-1,y2-y1-1);
  if(style.stroke_color!='none')  ctx.strokeRect(Math.round(x1)+0.5,Math.round(y1)+0.5,Math.round(Math.abs(x2-x1))-1,Math.round(Math.abs(y2-y1))-1);
//  ctx.strokeRect(Math.round(x)+0.5,Math.round(y)+0.5,Math.round(width-1),Math.round(height-1));
  }


/*
function drawCanvasPolygon(x,y,ctx,style,num_points) {
  ctx.strokeStyle = style.stroke_color;
  ctx.fillStyle   = style.fill_color;
  ctx.lineWidth   = style.line_width;

  ctx.beginPath();
  ctx.moveTo(x,y);
  for(var i=0;i<num_points;++i) {
    ctx.lineTo(x+arguments[5+2*i],y+arguments[5+2*i+1]);
    }
  if(style.fill_color!='none')  ctx.fill();
  if(style.stroke_color!='none')  ctx.stroke();
  ctx.closePath();
  }
*/

//----------------------------------------------------------------------------

