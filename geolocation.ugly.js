/**
 * geoLocation - Get or watch the user's location and pass it to any assigned callback functions, when available or when updated.
 * copyright 2011 Jonathan Jefferies
 * https://github.com/jjok/GeoLocation
 * MIT License
 * v1.50
 */
!function(a){function l(){g=c,navigator.geolocation.getCurrentPosition(n,m,f)}function m(a){console.log(a),g=e}function n(a){g=d,q(a);for(var b in i)i[b](h);i=[]}function o(){k=navigator.geolocation.watchPosition(p,m,f)}function p(a){if(q(a))for(var b in j)j[b](h)}function q(a){return h.latitude!=a.coords.latitude||h.longitude!=a.coords.longitude?(h.latitude=a.coords.latitude,h.longitude=a.coords.longitude,h.timestamp=a.timestamp,!0):!1}var b=0,c=1,d=2,e=4,f={},g=b,h={},i=[],j=[],k;a.geoLocation={config:function(a){for(var b in a)f[b]=a[b]},addEvent:function(a,f){try{switch(a){case"ready":switch(g){case b:i.push(f),l();break;case c:i.push(f);break;case d:f(h)}break;case"change":j.push(f),typeof k=="undefined"&&g!=e&&o()}}catch(n){m(n)}},stopWatching:function(){navigator.geolocation.clearWatch(k),j=[]}}}(this)