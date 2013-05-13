/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Класс {@link bus.admin.helpers.ObjectHelper} имеет статические функции для упрощения работы с js-объектами.
 */
qx.Class.define("bus.admin.helpers.ObjectHelper", {
			type : "static",

			statics : {

				/**
				 * Глубокое копирование объекта
				 * @param  obj{Object}  Объект-источник
				 * @return {Object}     Объект-клон
				 */
				clone : function(obj) {
					if(obj == null)
						return null;
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
							copy[i] = bus.admin.helpers.ObjectHelper.clone(obj[i]);
						}
						return copy;
					}

					// Handle Object
					if (obj instanceof Object) {
						var copy = {};
						for (var attr in obj) {
							if (obj.hasOwnProperty(attr))
								copy[attr] = bus.admin.helpers.ObjectHelper.clone(obj[attr]);
						}
						return copy;
					}

					throw new Error("Unable to copy obj! Its type isn't supported.");
				}
			}
		});
