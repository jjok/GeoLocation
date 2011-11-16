/**
 * Gets the user's latitude and longitude and pass it to any assigned callback functions, when available.
 * @filesource https://github.com/jjok/GeoLocation
 * @author jjok (Jonathan Jefferies)
 * @version 1.20
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
	//Stored location
		location = {},
		callback_queue = [],
		//fallback_queue = [],
		
		ready_queue = [],
		watch_queue = [],
		watch_id;
	
	context['geoLocation'] = {
		/**
		 * TODO
		 */
		config: function(options) {
			//enableHighAccuracy
			//maximumAge
			//timeout
			for(var i in options) {
				config[i] = options[i];
			}
		},
		/**
		 * 
		 * @param event {string}
		 * @param callback_success {fn}
		 * @param callback_failure {fn}
		 */
		addEvent: function(event, callback_success/*, callback_failure*/) {
			switch(event) {
				case 'ready':
					switch(status) {
						case NOT_INIT:
							ready_queue.push(callback_success);
							initialise();
							break;
						case INITIALISING:
							ready_queue.push(callback_success);
							break;
						case SUCCESS:
							callback_success(location);
							break;
						case FAIL:
							callback_failure();
					}
					break;
				case 'change':
					watch_queue.push(callback_success);
					if(typeof watch_id == 'undefined') {
						startWatching();
					}
			}
		},
		stopWatching: function() {
			navigator.geolocation.clearWatch(watch_id);
			watch_queue = [];
			//console.log('stopped watching');
		},
		/**
		 * 
		 * @param callback_success {fn} Called if location is available
		 * @param callback_failure {fn} Called if location is not available (optional)
		 */
		/*call: function(callback_success, callback_failure) {
			//Create a default failure callback
//			if(typeof callback_failure == 'undefined') {
//				var callback_failure = function() {
//					//alert('fail');
//				};
//			}

			switch(status) {
				case NOT_INIT:
					//callback_queue.push(callback_success);
					//fallback_queue.push(callback_failure);
					initialise();
					//break;
				case INITIALISING:
					callback_queue.push(callback_success);
					//fallback_queue.push(callback_failure);
					break;
				case SUCCESS:
					callback_success(location);
					break;
				case FAIL:
					callback_failure();
			}
		}*/
	};

	/**
	 * Try to get the user's current location
	 */
	function initialise() {
		status = INITIALISING;
		//console.log('init');
		try {
			navigator.geolocation.getCurrentPosition(ready, error);
		}
		catch(e) {
			//alert('exception');
			error(e.message);
		}
	}

	/**
	 * Store the current location and call any queued callbacks
	 */
	function success(loc) {
		status = SUCCESS;
		//console.log(loc);
		store(loc);

		for(var i in callback_queue) {
			callback_queue[i](location);
		}
		callback_queue = [];
	}

	/**
	 * Call any queued failure callbacks
	 */
	function error(e) {
		console.log(e);
		status = FAIL;
		//fallback();
		/*for(var i in fallback_queue) {
			fallback_queue[i]();
		}
		fallback_queue = [];*/
	}

	/**
	 * 
	 */
	function ready(loc) {
		status = SUCCESS;
		store(loc);

		for(var i in ready_queue) {
			ready_queue[i](location);
		}
		ready_queue = [];
	}

	/**
	 * 
	 */
	function startWatching() {
		try {
			watch_id = navigator.geolocation.watchPosition(change, error, config);
		}
		catch(e) {
			error(e.message);
		}
	}

	/**
	 * Called when a watched location changes
	 */
	function change(loc) {
		if(store(loc)) {
			for(var i in watch_queue) {
				watch_queue[i](location);
			}
		}
	}

	/**
	 * 
	 * @return boolean
	 */
	function store(loc) {
		//console.log(loc);
		if(location.latitude != loc.coords.latitude || location.longitude != loc.coords.longitude) {
			location.latitude = loc.coords.latitude;
			location.longitude = loc.coords.longitude;
			location.timestamp = loc.timestamp;
			return true;
		}
		return false;
	}

	//console.log(this.geoLocation);
}(this);
