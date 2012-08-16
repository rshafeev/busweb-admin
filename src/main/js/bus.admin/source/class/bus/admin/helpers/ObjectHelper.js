

qx.Class.define("bus.admin.helpers.ObjectHelper", {
			type : "static",

			statics : {

				clone : function(obj) {
					// Handle the 3 simple types, and null or undefined
					if (null == obj || "object" != typeof obj)
						return obj;

					// Handle Date
					if (obj instanceof Date) {
						var copy = new Date();
						copy.setTime(obj.getTime());
						return copy;
					}

					// Handle Array
					if (obj instanceof Array) {
						var copy = [];
						var len = obj.length;
						for (var i = 0; i < len; ++i) {
							copy[i] = bus.admin.helpers.ObjectHelper
									.clone(obj[i]);
						}
						return copy;
					}

					// Handle Object
					if (obj instanceof Object) {
						var copy = {};
						for (var attr in obj) {
							if (obj.hasOwnProperty(attr))
								copy[attr] = bus.admin.helpers.ObjectHelper
										.clone(obj[attr]);
						}
						return copy;
					}

					throw new Error("Unable to copy obj! Its type isn't supported.");
				}
			}
		});
