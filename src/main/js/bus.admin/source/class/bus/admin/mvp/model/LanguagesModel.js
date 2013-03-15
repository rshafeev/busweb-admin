

qx.Class.define("bus.admin.mvp.model.LanguagesModel", {
	extend : qx.core.Object,

	construct : function(dataModel) {
		if(dataModel != undefined)
		{
			this.fromDataModel(dataModel);
		}
	},

	members : {
		
		_langs : null,

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

		getLangs : function(){
			return this._langs;
		},

 		 /**
 		  * Формирует модель языков. <br>
 		  * Объект dataModel является массивом объектов, из которых можно сформировать модели языков. Каждый элемент массива имеет
 		  * два поля: id(String) и name (String). Поле id является кодом языка и принимает значения "c_ru", "c_en" или "c_uk". 
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