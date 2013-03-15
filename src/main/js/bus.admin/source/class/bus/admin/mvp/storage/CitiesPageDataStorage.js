qx.Class.define("bus.admin.mvp.storage.CitiesPageDataStorage", {
	extend : qx.core.Object,

	construct : function() {
		this.base(arguments);
    // create models
    var citiesModel = new bus.admin.mvp.model.CitiesModel();
    var langsModel = new bus.admin.mvp.model.LanguagesModel();
    langsModel.fromDataModel(bus.admin.AppProperties.LANGUAGES);
    this.setCitiesModel(citiesModel);
    this.setLangsModel(langsModel);
    this.setState("none");
    
    // get data from locale storage
    var currNamesLangID = qx.module.Storage.getLocalItem("cities.currNamesLangID");
    var selectedCityID = qx.module.Storage.getLocalItem("cities.selectedCityID");
    
    if(selectedCityID != undefined)
      this.setSelectedCityID(selectedCityID);

    if(currNamesLangID != undefined){
      this.setCurrNamesLangID(currNamesLangID);
    }
    else{
      var locale = bus.admin.AppProperties.getLocale();
      for(var i=0;i < langsModel.getLangs().length; i++){
        var langID = langsModel.getLangs()[i].getId();
        if(langID.toString() != locale.toString()){
          this.setCurrNamesLangID(langID);
          break;
        }
      }
    }
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
              },

              langsModel : {
                nullable : true
              },

              /**
               * ID языка, в котором отображаются названия городов в таблице _tableCityNames
               * @type {String}
               */
               currNamesLangID : {
                check : "String",
                apply : "_applyCurrNamesLangID" 
              },

              /**
               * ID города, который был выбран пользователей в таблице _tableCities
               */
               selectedCityID : {
                check : "Integer",
                init : -1,
                apply : "_applySelectedCityID" 
              }
            },


            members : {

              _applyCurrNamesLangID : function(value, old, name){
                qx.module.Storage.setLocalItem("cities.currNamesLangID", value);
              },

              _applySelectedCityID : function(value, old, name){
                qx.module.Storage.setLocalItem("cities.selectedCityID", value);
              }

            }
          });