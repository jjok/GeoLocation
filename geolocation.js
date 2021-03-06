/**
 * geoLocation - Get or watch the user's location and pass it to any assigned callback functions, when available or when updated.
 * copyright 2011 Jonathan Jefferies
 * https://github.com/jjok/GeoLocation
 * MIT License
 * v1.51
 */
!function(context) {
	//Statuses
	var NOT_INIT = 0,
		INITIALISING = 1,
		SUCCESS = 2,
		FAIL = 4,

	//Position options
		config = {},
	//Current status
		status = NOT_INIT,
	//Current location
		location = {},

	//Queued functions
		ready_queue = [],
		watch_queue = [],
		error_queue = [],
	//
		watch_id;

	//Public methods
	context['geoLocation'] = {
		/**
		 * Set location options
		 * @visibility public
		 * @param options {object}
		 */
		config: function(options) {
			for(var i in options) {
				config[i] = options[i];
			}
		},

		/**
		 * Get location or, if 'change' is passed, start watching location
		 * @visibility public
		 * @param params {object}
		 */
		get: function(params) {
			try {
				switch(status) {
					case NOT_INIT:
					case INITIALISING:
						//Queue up callback functions
						if(params.ready) {
							ready_queue.push(params.ready);
						}
						if(params.change) {
							watch_queue.push(params.change);
						}
						if(params.error) {
							error_queue.push(params.error);
						}

						if(status == NOT_INIT) {
							//Start watching if 'change' option is passed
							if(params.change) {
								startWatching();
							}
							//Get location once
							else {
								getLocation();
							}
						}
						break;
					/*case INITIALISING:
						if(params.ready) {
							ready_queue.push(params.ready);
						}
						if(params.change) {
							watch_queue.push(params.change);
						}
						if(params.error) {
							error_queue.push(params.error);
						}
						break;*/
					case SUCCESS:
						if(params.ready) {
							params.ready(location);
						}
						if(params.change) {
							watch_queue.push(params.change);
						}
						break;
					case FAIL:
						if(params.error) {
							params.error();
						}
				}
			}
			catch(e) {
				error(e);
			}
		},
		
		/**
		 * Stop watching the user's location
		 * @visibility public
		 */
		stopWatching: function() {
			navigator.geolocation.clearWatch(watch_id);
			watch_queue = [];
		}
	};

	/**
	 * Try to get the user's current location
	 * @visibility private
	 */
	function getLocation() {
		status = INITIALISING;
		navigator.geolocation.getCurrentPosition(ready, error, config);
	}

	/**
	 * Call any queued failure callbacks
	 * @param e {object?} TODO find out if this is always an exception
	 * @visibility private
	 */
	function error(e) {
		/*console.log('error');
		alert(typeof e);
		if(typeof e == 'object') {
			alert(e.message);
		}
		else alert(e);
		
		console.log(e);*/
		status = FAIL;

		for(var i = 0, l = error_queue.length; i < l; i++) {
			error_queue[i](e);
		}
		error_queue = [];
	}

	/**
	 * Location is first ready
	 * @visibility private
	 */
	function ready(loc) {
		//console.log('ready');
		status = SUCCESS;
		updateLocation(loc);

		for(var i = 0, l = ready_queue.length; i < l; i++) {
			ready_queue[i](location);
		}
		ready_queue = [];
	}

	/**
	 * Start watching the user's location
	 * @visibility private
	 */
	function startWatching() {
		status = INITIALISING;
		watch_id = navigator.geolocation.watchPosition(change, error/*, config*/);
	}

	/**
	 * Called when a watched location changes
	 * @visibility private
	 */
	function change(loc) {
		//First update
		if(ready_queue.length > 0) {
			ready(loc);
		}
		//All other updates
		else {
			//console.log('change');
			if(updateLocation(loc)) {
				//console.log(watch_queue);
				for(var i = 0, l = watch_queue.length; i < l; i++) {
					watch_queue[i](location);
				}
			}
		}
	}

	/**
	 * 
	 * @visibility private
	 * @return boolean
	 */
	function updateLocation(loc) {
		//console.log(loc);
		if(location.latitude != loc.coords.latitude || location.longitude != loc.coords.longitude) {
			for(var i in loc.coords) {
				//console.log(i);
				location[i] = loc.coords[i];
			}

			location.timestamp = loc.timestamp;

			return true;
		}
		return false;
	}
}(this);
