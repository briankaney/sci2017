//############################################################################
//       sci_map_math.js
//
//       by Brian Kaney, March 2016
//############################################################################

function angleSubtendedBetweenTwoSphCoordPts(lat1,lon1,lat2,lon2) {
  var DegToRad = Math.PI/180;
  lat1 = lat1*DegToRad;
  lon1 = lon1*DegToRad;
  lat2 = lat2*DegToRad;
  lon2 = lon2*DegToRad;

  return Math.acos(Math.sin(lat1)*Math.sin(lat2) + Math.cos(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1));
  }

function distanceBetweenTwoLatLonPts(lat1,lon1,lat2,lon2,units) {
  var EarthRadiusKm = 6371;

  var angle_subtended = angleSubtendedBetweenTwoSphCoordPts(lat1,lon1,lat2,lon2);

  if(units=="km")  return EarthRadiusKm*angle_subtended;
  if(units=="m")   return EarthRadiusKm*1000*angle_subtended;
  if(units=="mi")  return EarthRadiusKm*0.621371*angle_subtended;
  if(units=="ft")  return EarthRadiusKm*3280.84*angle_subtended;

  return -999;
  }

function bearingBetweenTwoLatLonPts(lat1,lon1,lat2,lon2,units) {
  var DegToRad = Math.PI/180;
  lat1 = lat1*DegToRad;
  lon1 = lon1*DegToRad;
  lat2 = lat2*DegToRad;
  lon2 = lon2*DegToRad;

  var x = Math.cos(lat2)*Math.sin(lon2-lon1);
  var y = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lon2-lon1);
  var bearing = Math.atan2(x,y);
  if(bearing<0)  bearing = bearing + 2*Math.PI;

  if(units=="rad")  return bearing;
  if(units=="deg")  return bearing*180/Math.PI;

  return -999;
  }

//----------------------------------------------------------------------------

function pixToEquatorFromLat(zoom_level,lat) {
  var pix_radius = 256*Math.pow(2,zoom_level)/(2*Math.PI);
  var deg_to_rad = (2*Math.PI)/360;
  return pix_radius*Math.log((1+Math.sin(lat*deg_to_rad))/Math.cos(lat*deg_to_rad));
  }

function latFromPixToEquator(zoom_level,pix) {
  var pix_radius = 256*Math.pow(2,zoom_level)/(2*Math.PI);
  var rad_to_deg = 360/(2*Math.PI);
  return (rad_to_deg)*(2*Math.atan(Math.pow(Math.E,pix/pix_radius))) - 90;
  }

function getLatFromFractionOfInterval(lat1,lat2,fraction) {
  var pix1 = pixToEquatorFromLat(10,lat1);
  var pix2 = pixToEquatorFromLat(10,lat2);
  var fpix = pix1 + (pix2-pix1)*fraction;
  return latFromPixToEquator(10,fpix);
  }

function getLonFromFractionOfInterval(lon1,lon2,fraction) {
  return lon1 + (lon2-lon1)*fraction;
  }

function latFromRefLatPlusPix(zoom_level,ref_lat,pixel_shift) {
  var old_pix_to_eq = pixToEquatorFromLat(zoom_level,ref_lat);
  return latFromPixToEquator(zoom_level,old_pix_to_eq+pixel_shift);
  }

function shiftLon(lon,lon_mode) {
  if(lon_mode=="-180to180") {
    if(lon>180)    lon = lon-360;
    if(lon<=-180)  lon = lon+360;
    return lon;
    }
  if(lon_mode=="-360to0") {
    if(lon>0)      lon = lon-360;
    if(lon<=-360)  lon = lon+360;
    return lon;
    }
  if(lon_mode=="0to360") {
    if(lon>=360)   lon = lon-360;
    if(lon<0)      lon = lon+360;
    return lon;
    }
  }

function lonFromRefLonPlusPix(zoom_level,ref_lon,pixel_shift,lon_mode) {
  if(arguments.length==3)  var lon_mode = "-180to180";
  var pix_circumference = 256*Math.pow(2,zoom_level);
  var raw_lon = (ref_lon+360*(pixel_shift/pix_circumference));
  return shiftLon(raw_lon,lon_mode);
  }

//function lonFromRefLonPlusPix(zoom_level,ref_lon,lon_mode,pixel_shift) {
//  var pix_circumference = 256*Math.pow(2,zoom_level);
//  var raw_lon = (ref_lon+360*(pixel_shift/pix_circumference));
//  if(raw_lon>0)      return raw_lon-360;
//  if(raw_lon<=-360)  return raw_lon+360;
//  if(raw_lon>180)    return raw_lon-360;
//  if(raw_lon<=-180)  return raw_lon+360;
//  return raw_lon;
//  }

function yPixFromLatOnMap(zoom_level,center_lat,height,lat) {
  var pix_to_equator_clat = pixToEquatorFromLat(zoom_level,center_lat);
  var pix_to_equator_lat = pixToEquatorFromLat(zoom_level,lat);
  return height/2+(pix_to_equator_clat-pix_to_equator_lat);
  }

function xPixFromLonOnMap(zoom_level,center_lon,width,lon) {
  var pixel_per_deg_lon = (256*Math.pow(2,zoom_level))/360;
  return width/2-pixel_per_deg_lon*(center_lon-lon);
  }

function yPixFromRefLatPlusLat(zoom_level,ref_lat,lat) {
  return yPixFromLatOnMap(zoom_level,ref_lat,0,lat);
  }

function xPixFromRefLonPlusLon(zoom_level,ref_lon,lon) {
  return xPixFromLonOnMap(zoom_level,ref_lon,0,lon);
  }


/*

Below is rough code from notes.  Syntax may need work.  Think about use of zoom level in library that is supposed to be pure math.
Needs to be done but odd.  There are two step math problems where zoom level does not effect the answer and yet you need to pick one
to do the intermediate step?  Really?

function latFromLatIntervalFraction(start_lat,end_lat,fraction) {
  var start_pix = pixToEquatorFromLat
  var end_pix = pixToEquatorFromLat
  var pix = start_pix + (end_pix-start_pix)*fraction;
  return latFromPixToEquator(zl,pix)
  }

function lonFromLonIntervalFraction(start_lon,end_lon,fraction) {
  just linear, except for IDL handling?

  need more IDL handling here anyway.  In QVS IDL problem addressed by just going from 180 to -180 
  to 0 to -360 - bascially shifting IDL to PM.  Not a robust fix.
  }



*/

//----------------------------------------------------------------------------
//    The following should go elsewhere.  Higher level.  Only one to use outside
//    object - namely geoLocation
//----------------------------------------------------------------------------

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

//----------------------------------------------------------------------------

