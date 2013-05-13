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
 * Модель хранит в себе массив языков.
 */
qx.Class.define("bus.admin.mvp.model.LanguagesModel", {
	extend : qx.core.Object,

	/**
	 * @param  dataModel {Object|null}  Языки.
	 */
	construct : function(dataModel) {
		if(dataModel != undefined)
		{
			this.fromDataModel(dataModel);
		}
	},

	members : {
		
		/**
		 *Массив языков
		 * @type {Object[]}
		 */
		_langs : null,

		/**
		 * Возвращает модель языка по его названию
		 * @param  name {String}  Название языка
		 * @return {Object} Модель языка
		 */
		getLangByName : function(name) {
			if (this._langs == null)
				return null;
			for (var i = 0; i < this._langs.length; i++) {
				if (this._langs[i].getName().toString() == name.toString()) {
					return this._langs[i];
				}
			}
			return null;
		},

		/**
		 * Возвращает массив языков.
		 * @return {Object[]} Массив языков.
		 */
		getLangs : function(){
			return this._langs;
		},

 		 /**
 		  * Формирует модель языков. <br>
 		  * Объект dataModel является массивом объектов, из которых можно сформировать модели языков. Каждый элемент массива имеет
 		  * два поля: id(String) и name (String). Поле id является кодом языка и принимает значения "ru", "en" или "uk". 
 		  * Поле "name" хранит название языка в зависимости от локали.
 		  * Структура dataModel cовпадает со структурой объекта {@link bus.admin.AppProperties.LANGUAGES}.
 		  * @param  dataModel {Object[]}  JS объект.
 		  */
 		  fromDataModel : function(dataModel){
 		  	this._langs = [];
 		  	for(var i=0;i < dataModel.length; i++){
 		  		this._langs.push(qx.data.marshal.Json.createModel(dataModel[i]));
 		  	}
 		  }

 		}
 	});