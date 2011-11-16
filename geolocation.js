!function(context) {
	//Statuses
	var NOT_INIT = 0,
		INITIALISING = 1,
		SUCCESS = 2,
		FAIL = 4,

	//Current status
		status = NOT_INIT,
	//Stored location
		location = {},
		callback_queue = [],
		fallback_queue = [];
	
	context['geoLocation'] = {
		/**
		 * 
		 * @param callback_success {fn} Called if location is available
		 * @param callback_failure {fn} Called if location is not available (optional)
		 */
		call: function(callback_success, callback_failure) {
			if(typeof callback_failure == 'undefined') {
				var callback_failure = function() {
					//alert('fail');
				}
			}

			switch(status) {
				case NOT_INIT:
					callback_queue.push(callback_success);
					fallback_queue.push(callback_failure);
					initialise();
					break;
				case INITIALISING:
					callback_queue.push(callback_success);
					fallback_queue.push(callback_failure);
					break;
				case SUCCESS:
					callback_success(location);
					break;
				case FAIL:
					callback_failure();
			}
		}
	};

	/**
	 * 
	 */
	function initialise() {
		status = INITIALISING;
		//console.log('init');
		try {
			navigator.geolocation.getCurrentPosition(success, error);
		}
		catch(e) {
			//alert('exception');
			error(e.message);
		}
	}

	/**
	 * 
	 */
	function success(loc) {
		status = SUCCESS;
		//console.log(loc);
		location.latitude = loc.coords.latitude;
		location.longitude = loc.coords.longitude;

		for(var i in callback_queue) {
			callback_queue[i](location);
		}
		callback_queue = [];
	}

	/**
	 * 
	 */
	function error(e) {
		//alert(e);
		status = FAIL;
		//fallback();
		for(var i in fallback_queue) {
			fallback_queue[i]();
		}
		fallback_queue = [];
	}

	//console.log(this.geoLocation);
}(this);
