

qx.Class.define("bus.admin.mvp.model.URLModel", {
	extend : qx.core.Object,
	construct : function() {
		this.base(arguments);
		this.setParams([]);
	},
	properties : {
		params : {
			nullable : true
		}
	},
	members : {
		_parseParameters : function() {
			var searchString = window.location.search.substring(1), params = searchString
					.split("&"), hash = [];

			for (var i = 0; i < params.length; i++) {
				var val = params[i].split("=");

				if (unescape(val[0]).toString().length > 0
						&& val[1].toString().length > 0) {
					hash.push({
								key : unescape(val[0]),
								value : val[1]
							});
				}
				// hash[unescape(val[0])] = unescape(val[1]);
			}
			return hash;
		},

		parseURL : function() {
			var params = this._parseParameters();

			this.setParams(params);

		},
		getURL : function() {
			var url = window.location.pathname;
			var params = this.getParams();
			if (params == null) {
				return url;
			} else if (params.length > 0) {
				url = url + "?";
			}
			for (var i = 0; i < params.length; i++) {
				var key = params[i].key;
				var value = params[i].value;
				url = url + key + "=" + value;
				if (i != params.length - 1) {
					url = url + "&";
				}
			}
			
			return url;
		},
		getParameter : function(param_key) {
			var params = this.getParams();
			for (var i = 0; i < params.length; i++) {
				if (params[i].key == param_key) {
					return params[i].value;
				}
			}
			return null;
		},
		insertParameter : function(key, value) {
			this.getParams().push({
						key : key,
						value : value
					});
		},
		setParameter : function(key, value) {
			var params = this.getParams();
			if (params) {
				for (var i = 0; i < params.length; i++) {
					if (params[i].key == key) {
						params[i].value = value;
						return;
					}
				}
			}
			this.insertParameter(key, value);
		}

	}
});