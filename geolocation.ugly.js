/**
 * Gets the user's latitude and longitude and pass it to any assigned callback functions, when available.
 * @filesource https://github.com/jjok/GeoLocation
 * @author jjok (Jonathan Jefferies)
 * @version 1.00
 */
!function(a){function j(){f=c;try{navigator.geolocation.getCurrentPosition(k,l)}catch(a){l(a.message)}}function k(a){f=d,g.latitude=a.coords.latitude,g.longitude=a.coords.longitude;for(var b in h)h[b](g);h=[]}function l(a){f=e;for(var b in i)i[b]();i=[]}var b=0,c=1,d=2,e=4,f=b,g={},h=[],i=[];a.geoLocation={call:function(a,k){if(typeof k=="undefined")var k=function(){};switch(f){case b:j();case c:h.push(a),i.push(k);break;case d:a(g);break;case e:k()}}}}(this)