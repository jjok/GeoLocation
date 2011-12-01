/**
 * geoLocation - Get or watch the user's location and pass it to any assigned callback functions, when available or when updated.
 * copyright 2011 Jonathan Jefferies
 * https://github.com/jjok/GeoLocation
 * MIT License
 * v1.51
 */
!function(a){function m(){g=c,navigator.geolocation.getCurrentPosition(o,n,f)}function n(a){g=e;for(var b=0,c=k.length;b<c;b++)k[b](a);k=[]}function o(a){g=d,r(a);for(var b=0,c=i.length;b<c;b++)i[b](h);i=[]}function p(){g=c,l=navigator.geolocation.watchPosition(q,n)}function q(a){if(i.length>0)o(a);else if(r(a))for(var b=0,c=j.length;b<c;b++)j[b](h)}function r(a){if(h.latitude!=a.coords.latitude||h.longitude!=a.coords.longitude){for(var b in a.coords)h[b]=a.coords[b];return h.timestamp=a.timestamp,!0}return!1}var b=0,c=1,d=2,e=4,f={},g=b,h={},i=[],j=[],k=[],l;a.geoLocation={config:function(a){for(var b in a)f[b]=a[b]},get:function(a){try{switch(g){case b:case c:a.ready&&i.push(a.ready),a.change&&j.push(a.change),a.error&&k.push(a.error),g==b&&(a.change?p():m());break;case d:a.ready&&a.ready(h),a.change&&j.push(a.change);break;case e:a.error&&a.error()}}catch(f){n(f)}},stopWatching:function(){navigator.geolocation.clearWatch(l),j=[]}}}(this)