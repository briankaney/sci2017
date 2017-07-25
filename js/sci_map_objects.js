//############################################################################
//       sci_map_objects.js
//
//       by Brian Kaney, March 2016
//############################################################################

//----------------------------------------------------------------------------
//    
//----------------------------------------------------------------------------

function geoPoint(lon,lat) {
  if(arguments.length==2) {
    this.lon = lon;
    this.lat = lat;
    }
  else {
    this.lon = -95;
    this.lat = 36;
    }
  }

geoPoint.prototype.set = function(lon,lat) {
  this.lon = lon;
  this.lat = lat;
  };

//----------------------------------------------------------------------------
//    
//----------------------------------------------------------------------------

function geoBox(wlon,nlat,elon,slat) {
  if(arguments.length==2) {
    this.wlon = wlon;
    this.nlat = nlat;
    this.elon = elon;
    this.slat = slat;
    }
  else {
    this.wlon = -96;
    this.nlat = 37;
    this.elon = -94;
    this.slat = 35;
    }
  }

geoBox.prototype.set = function(wlon,nlat,elon,slat) {
  this.wlon = wlon;
  this.nlat = nlat;
  this.elon = elon;
  this.slat = slat;
  };

geoBox.prototype.latHeight = function() {
  return this.nlat-this.slat;
  }

geoBox.prototype.longWidth = function() {
  if(this.elon>=this.wlon)  return this.elon-this.wlon;
  else                      return (this.elon+360)-this.wlon;
  };


//geoBox.prototype.equateToBox(other_box) { }

geoBox.prototype.confineInsideBoundingBox = function(container,zoom,pix_height) {
  var lw = this.longWidth();
  if(this.wlon < container.wlon) {
    this.wlon = container.wlon;
    this.elon = this.wlon + lw;
    }
  if(this.nlat > container.nlat) {
    this.nlat = container.nlat;   
//    this.slat = this.nlat - lh;

    this.slat = latFromRefLatPlusPix(zoom,this.nlat,-1*pix_height);   //  weird in that result does not depend on pix_height,  just used to get to equator and back?  Some core function work needed to clarify this
    }
  if(this.elon > container.elon) {
    this.elon = container.elon;
    this.wlon = this.wlon - lw;
    }
  if(this.slat < container.slat) {
    this.slat = container.slat;
//    this.nlat = this.slat + lh;
    this.nlat = latFromRefLatPlusPix(zoom,this.slat,pix_height);
    }
  };

//  Other box intersection, union and overlap functions

//----------------------------------------------------------------------------

//----------------------------------------------------------------------------

function mapBox(pix_width,pix_height,zoom_level,center_lon,center_lat) {
  if(arguments.length==5) {
    this.pix_width  = pix_width;
    this.pix_height = pix_height;
    this.zoom_level = zoom_level;
    this.center_lon = center_lon;
    this.center_lat = center_lat;
    }
  else {
    this.pix_width  = 900;
    this.pix_height = 600;
    this.zoom_level = 4;
    this.center_lon = -95;
    this.center_lat = 36;
    }
  }

mapBox.prototype.setDimensions = function(pix_width,pix_height) {
  this.pix_width  = pix_width;
  this.pix_height = pix_height;
  };

mapBox.prototype.setMap = function(zoom_level,center_lon,center_lat) {
  this.zoom_level = zoom_level;
  this.center_lon = center_lon;
  this.center_lat = center_lat;
  };

mapBox.prototype.getXFromLon = function(lon,mode) {
  if(arguments.length==1)  var mode = "int";
  if(mode=='int')    return Math.round(xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon));
  if(mode=='float')  return xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,lon);
  };

mapBox.prototype.getYFromLat = function(lat,mode) {
  if(arguments.length==1)  var mode = "int";
  if(mode=='int')    return Math.round(yPixFromLatOnMap(this.zoom_level,this.center_lat,this.pix_height,lat));
  if(mode=='float')  return yPixFromLatOnMap(this.zoom_level,this.center_lat,this.pix_height,lat);
  };



//-------------------------------------------------------------------------------------------



/*    moved from lower down to here to highlight based on written notes (july 2017)
mapRegion.prototype.getBoundingGeoBox = function() {
  var wlon = lonFromRefLonPlusPix(this.zoom_level,this.center_lon,-1*this.pix_width/2);
  var nlat = latFromRefLatPlusPix(this.zoom_level,this.center_lat,this.pix_height/2);
  var elon = lonFromRefLonPlusPix(this.zoom_level,this.center_lon,this.pix_width/2);
  var slat = latFromRefLatPlusPix(this.zoom_level,this.center_lat,-1*this.pix_height/2);
  var box = new geoBox(wlon,nlat,elon,slat);
  return box;
  };*/


/*
Ideas added from hand written notes.  Added here July 2017, notes are quite a bit older:


mapBox.prototype.getCenterOfGeoBox(geobox) {
  loc = new geoPoint(latFromLatIntervalFraction(this.s_lat,this.n_lat,0.5),lonFromLonIntervalFraction(this.w_lon,this.e_lon,0.5));
(above functions don't exist yet, but see notes in map_math.js)
  return loc;
  }
*/



//-------------------------------------------------------------------------------------------




//  Okay, read carefully.  mapRegion below has most extensive features.  But it is called with lat,lon order and I need to quit
//  mixing those.  Want to go to lon,lat order.  The above mapBox does that and only that.  Go to mapBox for future work and 
// add in the rest of the functions.  Make no updates in either object without doing the other. gradually purge use of the one
//  below



/*
function mapRegion(pix_width,pix_height,zoom_level,center_lat,center_lon) {
  }
//above give int value, below gives real value - may want to stick with real values here and handle ints elsewhere where really needed (drawing lines)

mapRegion.prototype.getPtFromLoc = function(loc) {
  var x = Math.floor(0.5+xPixFromLonOnMap(this.zoom_level,this.center_lon,this.pix_width,loc.lon));
  var y = Math.floor(0.5+yPixFromLatOnMap(this.zoom_level,this.center_lat,this.pix_height,loc.lat));
  var pt = new screenPoint(x,y);
  return pt;
  };

mapRegion.prototype.setZoomViaBoundingLon = function(wlon,elon) {
  this.zoom_level = Math.log((this.pix_width)*360/(256*(elon-wlon)))/Math.LN2;
  };

mapRegion.prototype.getWLon = function() {
  return lonFromRefLonPlusPix(this.zoom_level,this.center_lon,-1*this.pix_width/2);
  };

mapRegion.prototype.getELon = function() {
  return lonFromRefLonPlusPix(this.zoom_level,this.center_lon,this.pix_width/2);
  };

mapRegion.prototype.getSLat = function() {
  return latFromRefLatPlusPix(this.zoom_level,this.center_lat,-1*this.pix_height/2);
  };

mapRegion.prototype.getNLat = function() {
  return latFromRefLatPlusPix(this.zoom_level,this.center_lat,this.pix_height/2);
  };

mapRegion.prototype.shiftInsideContainerBox = function(container) {
  var box = this.getBoundingGeoBox();
  if(box.wlon < container.wlon) {
    box.wlon = container.wlon;
    box.elon = lonFromRefLonPlusPix(this.zoom_level,container.wlon,this.pix_width);
    }
  if(box.nlat > container.nlat) {
    box.nlat = container.nlat;   
    box.slat = latFromRefLatPlusPix(this.zoom_level,container.nlat,-1*this.pix_height);
    }
  if(box.elon > container.elon) {
    box.elon = container.elon;
    box.wlon = lonFromRefLonPlusPix(this.zoom_level,container.elon,-1*this.pix_width);
    }
  if(box.slat < container.slat) {
    box.slat = container.slat;
    box.nlat = latFromRefLatPlusPix(this.zoom_level,container.slat,this.pix_height);
    }
  this.center_lat = getLatFromFractionOfInterval(box.nlat,box.slat,0.5);
  this.center_lon = getLonFromFractionOfInterval(box.wlon,box.elon,0.5);
  };
*/





//-----------------Don't use screenPoint here, causes needless interwining of libs
//MapRegion.prototype.GetPtFromGeoLocation = function(loc) {     //--- add same here, and change code to calls of above two functions
//  var x = this.x_indent+Math.floor(0.5+((loc.lon-this.nwlon)*this.pix_width)/(this.selon-this.nwlon));
//  var y = this.y_indent+Math.floor(0.5+((this.nwlat-loc.lat)*this.pix_height)/(this.nwlat-this.selat));
//  var pt = new screenPoint(x,y);
//  return pt;
//  };

//---new april 17, only used in trmm/gpm vs q3 scatter page------will eventually absorb this above
//MapRegion.prototype.GetRealXFromLon = function(lon) {
//  return this.x_indent+((lon-this.nwlon)*this.pix_width)/(this.selon-this.nwlon);
//  };

//MapRegion.prototype.GetRealYFromLat = function(lat) {
//  return this.y_indent+((this.nwlat-lat)*this.pix_height)/(this.nwlat-this.selat);
//  };
//---------------------------------

//MapRegion.prototype.GetLonFromX = function(x) {
//  return this.nwlon+(x-this.x_indent)*(this.selon-this.nwlon)/this.pix_width;
//  };

//MapRegion.prototype.GetLatFromY = function(y) {
//  return this.nwlat-(y-this.y_indent)*(this.nwlat-this.selat)/this.pix_height;
//  };

//MapRegion.prototype.GetGeoLocationFromPt = function(pt) {
//  var lon = this.nwlon+(pt.x-this.x_indent)*(this.selon-this.nwlon)/this.pix_width;
//  var lat = this.nwlat-(pt.y-this.y_indent)*(this.nwlat-this.selat)/this.pix_height;
//  var loc = new GeoLocation(lat,lon);
//  return loc;
//  };

//MapRegion.prototype.clearCanvas = function(ctx) {
//  ctx.clearRect(0,0,this.pix_width,this.pix_height);
//  return;
//  };

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------

//-----replaced by a better version elsewhere - could be used in zoom_pan qvs_objects
//function latlonText(lat,lon,sig_fig,style) {
//  var message = lat.toFixed(sig_fig) + ", " + lon.toFixed(sig_fig);
//  return message;
//  }

//----------------------------------------------------------------------------
//----------------------------------------------------------------------------
/*
function getSphMercGreatCircleLocs(lat1,lon1,lat2,lon2,zoom_level,center_lat,center_lon) {
  var DegToRad = 0.0174533;
  var num_pts = 4;
  if(Math.abs(lon2-lon1)>2)   num_pts = 6;
  if(Math.abs(lon2-lon1)>5)   num_pts = 10;
  if(Math.abs(lon2-lon1)>10)  num_pts = 20;
  if(Math.abs(lon2-lon1)>25)  num_pts = 30;
  if(Math.abs(lon2-lon1)>40)  num_pts = 60;

  lat1 = lat1*DegToRad;
  lon1 = lon1*DegToRad;
  lat2 = lat2*DegToRad;
  lon2 = lon2*DegToRad;

  var sa = angleSubtendedBetweenTwoSphCoordPts(lon1,lon2,lat2,lon2);
  var f,A,B,x,y,z,lat_val,lon_val;

  var pts = new Array(num_pts);
  for(i=0;i<num_pts;++i) {
    f = i/(num_pts-1);

    A = Math.sin((1.0-f)*sa)/Math.sin(sa);
    B = Math.sin(f*sa)/Math.sin(sa);
    x = A*Math.cos(lat1)*Math.cos(lon1) + B*Math.cos(lat2)*Math.cos(lon2);
    y = A*Math.cos(lat1)*Math.sin(lon1) + B*Math.cos(lat2)*Math.sin(lon2);
    z = A*Math.sin(lat1) + B*Math.sin(lat2);

    lat_val = Math.atan2(z,Math.pow(x*x+y*y,0.5))/DegToRad;
    lon_val = Math.atan2(y,x)/DegToRad;

    pts[i] = new geoLocation(lat_val,lon_val);
    }
  return pts;
  }
*/

