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
	//Current location
		location = {},

		//fallback_queue = [],
		ready_queue = [],
		watch_queue = [],

		watch_id;

	//Add public methods
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
		 * 
		 * @visibility public
		 * @param event {string}
		 * @param callback_success {fn}
		 * @param callback_failure {fn}
		 */
		addEvent: function(event, callback_success/*, callback_failure*/) {
			try {
				switch(event) {
					case 'ready':
						switch(status) {
							case NOT_INIT:
								ready_queue.push(callback_success);
								getLocation();
								break;
							case INITIALISING:
								ready_queue.push(callback_success);
								break;
							case SUCCESS:
								callback_success(location);
							/*	break;
							case FAIL:
								callback_failure();*/
						}
						break;
					case 'change':
						watch_queue.push(callback_success);
						if(typeof watch_id == 'undefined' && status != FAIL) {
							startWatching();
						}
				}
			}
			catch(e) {
				//console.log(e.message);
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
	 * @visibility private
	 */
	function error(e) {
		//console.log('error');
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
	 * @visibility private
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
	 * Start watching the user's location
	 * @visibility private
	 */
	function startWatching() {
		//try {
			watch_id = navigator.geolocation.watchPosition(change, error, config);
		//}
		//catch(e) {
			//error(e.message);
		//}
	}

	/**
	 * Called when a watched location changes
	 * @visibility private
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
	 * @visibility private
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
}(this);
