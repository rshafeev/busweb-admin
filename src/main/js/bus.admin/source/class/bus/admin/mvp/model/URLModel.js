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
 * Модель для парсинга и составления url строки.
 */
qx.Class.define("bus.admin.mvp.model.URLModel", {
	extend : qx.core.Object,
	construct : function() {
		this.base(arguments);
		this.setParams([]);
	},
	properties : {

		/**
		 * Параметры url
		 * Каждый параметр имеет два поля:
		 * key - название параметра
		 * value - значение параметра
		 * @type {Object[]}
		 */
		params : {
			nullable : true
		}
	},
	members : {

		/**
		 * Считывает строку URL и парсит параметры
		 * @return {Object[]} параметры URL
		 */
		_parseParameters : function() {
			var searchString = window.location.search.substring(1), params = searchString.split("&"), hash = [];

			for (var i = 0; i < params.length; i++) {
				var val = params[i].split("=");

				if (unescape(val[0]).toString().length > 0
						&& val[1].toString().length > 0) {
					hash.push({
								key : unescape(val[0]),
								value : val[1]
							});
				}
			}
			return hash;
		},

		/**
		 * Парсит URL строку
		 */
		parseURL : function() {
			var params = this._parseParameters();
			this.setParams(params);

		},

		/**
		 * Формирует URL строку из данных модели
		 * @return {String} URL строка
		 */
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

		/**
		 * Возвращает значение параметра URL
		 * @param param_key {String}  Название параметра
		 * @return {String}  Значение параметра
		 */
		getParameter : function(param_key) {
			var params = this.getParams();
			for (var i = 0; i < params.length; i++) {
				if (params[i].key == param_key) {
					return params[i].value;
				}
			}
			return null;
		},

		/**
		 * Добавляет новый параметр
		 * @param  key {String}   Название параметра
		 * @param  value {String}  Значение параметра
		 */
		insertParameter : function(key, value) {
			this.getParams().push({
						key : key,
						value : value
					});
		},

		/**
		 * Устанавливает значение параметру. Если параметра с указанным key нет, то создается повый
		 * @param  key {String}     Название параметра
		 * @param  value {String}   Значение параметра
		 */
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