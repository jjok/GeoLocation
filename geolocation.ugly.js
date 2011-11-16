/**
 * Gets the user's latitude and longitude and pass it to any assigned callback functions, when available.
 * @filesource https://github.com/jjok/GeoLocation
 * @author jjok (Jonathan Jefferies)
 * @version 1.20
 */
!function(a){function l(){g=c;try{navigator.geolocation.getCurrentPosition(n,m)}catch(a){m(a.message)}}function m(a){console.log(a),g=e}function n(a){g=d,q(a);for(var b in i)i[b](h);i=[]}function o(){try{k=navigator.geolocation.watchPosition(p,m,f)}catch(a){m(a.message)}}function p(a){if(q(a))for(var b in j)j[b](h)}function q(a){return h.latitude!=a.coords.latitude||h.longitude!=a.coords.longitude?(h.latitude=a.coords.latitude,h.longitude=a.coords.longitude,h.timestamp=a.timestamp,!0):!1}var b=0,c=1,d=2,e=4,f={},g=b,h={},i=[],j=[],k;a.geoLocation={config:function(a){for(var b in a)f[b]=a[b]},addEvent:function(a,e){switch(a){case"ready":switch(g){case b:i.push(e),l();break;case c:i.push(e);break;case d:e(h)}break;case"change":j.push(e),typeof k=="undefined"&&o()}},stopWatching:function(){navigator.geolocation.clearWatch(k),j=[]}}}(this)