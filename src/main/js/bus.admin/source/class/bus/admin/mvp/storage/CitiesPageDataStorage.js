qx.Class.define("bus.admin.mvp.storage.CitiesPageDataStorage", {
	extend : qx.core.Object,

	construct : function() {
		this.base(arguments);
		var citiesModel = new bus.admin.mvp.model.CitiesModel();
		this.setCitiesModel(citiesModel);
		this.setState("none");
	},

	properties : {
              /** Показывает состояние страницы, в котором она пребывает. Возможные значения:
              none : обычное состояние. 
              move - Была нажата кнопка "Move"
              */
              state : {
              	nullable : true,
              	check : "String"
              },
              citiesModel : {
              	nullable : true
              }
          },


          members : {

          }
      });