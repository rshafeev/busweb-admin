

qx.Class.define("bus.admin.helpers.ObjectHelper", {
			type : "static",

			statics : {
				/**
				 * Проверка регулярным выражением времени HH:MM
				 * 
				 * @param {время
				 *            в формате HH:MM} value
				 * @return {true/false}
				 */
				validateTime : function(value) {
					// validate if time has the format HH:MM
					var re = /^([0-1][0-9]|[2][0-3])(:([0-5][0-9])){1,2}$/i;
					return re.test(value);
				},

				/**
				 * Обработка HH:MM
				 * 
				 * @param {время
				 *            в формате HH:MM} value
				 * @return {объект: часы, минуты}
				 */
				parseTime : function(value) {
					// parse time HH:MM
					var time = value.split(":");
					return {
						hh : time[0],
						mm : time[1]
					};
				},

				/**
				 * Преобразование в секунды
				 * 
				 * @param {время
				 *            в формате HH:M} value
				 */
				convertTimeToSeconds : function(value) {
					var time = value.split(":");
					var t = {
						hh : time[0],
						mm : time[1]
					};
					return (t.hh * 60 * 60 + t.mm * 60);
				},

				convertSecsToHM : function(secs) {
					var d = new Date();
					d.setTime(secs * 1000);
					var hours = parseInt(secs / 60 / 60).toString();
					var minutes = parseInt((secs - hours * 60 * 60) / 60)
							.toString();
					if (hours.length == 1) {
						hours = "0" + hours;
					}
					if (minutes.length == 1) {
						minutes = "0" + minutes;
					}
					return hours + ":" + minutes;
				},

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
