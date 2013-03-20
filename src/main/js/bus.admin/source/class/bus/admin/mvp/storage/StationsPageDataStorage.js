qx.Class.define("bus.admin.mvp.storage.StationsPageDataStorage", {
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

    var mapCenter = {
      centerLat : 0.0,
      centerLon : 0.0,
      scale     : 0
    };
    this.setMapCenter(mapCenter);
    // get data from locale storage
    var currNamesLangID = qx.module.Storage.getLocalItem("stations.currNamesLangID");
    var selectedCityID = qx.module.Storage.getLocalItem("stations.selectedCityID");
    console.debug(selectedCityID);

    if(selectedCityID != undefined)
      this.setSelectedCityID(selectedCityID);

    if(currNamesLangID != undefined){
      this.setCurrNamesLangID(currNamesLangID);
    }
    else{
      this.setCurrNamesLangID( bus.admin.AppProperties.getLocale());
      var locale = bus.admin.AppProperties.getLocale();
    }
  },

  properties : {
              /** Показывает состояние страницы, в котором она пребывает. Возможные значения:
                none : обычное состояние. 
              */
              state : {
              	nullable : true,
              	check : "String"
              },

              /**
               * Хранит набор городов
               * @type {bus.admin.mvp.model.CitiesModel}
               */
              citiesModel : {
              	nullable : true,
                check : "bus.admin.mvp.model.CitiesModel"
              },

              /**
               * Хранит набор языков
               * @type {bus.admin.mvp.model.LanguagesModel}
               */
              langsModel : {
                nullable : true,
                check : "bus.admin.mvp.model.LanguagesModel"
              },

              /**
               * ID языка, в котором отображаются названия станций в таблице 
               * @type {String}
               */
               currNamesLangID : {
                check : "String",
                apply : "_applyCurrNamesLangID" 
              },

              /**
               * ID города, который был выбран пользователем из выпадющего списка
               */
               selectedCityID : {
                check : "Integer",
                init : -1,
                apply : "_applySelectedCityID" 
              },

              /**
               * Центр карты.
               * @type {Object}
               */
              mapCenter : {
                nullable : true
              },


              /**
               * Список станций для выбранного города и языка
               * @type {bus.admin.mvp.model.StationsListModel}
               */
              stationsListModel : {
                nullable : true,
                check : "bus.admin.mvp.model.StationsListModel"
              },

              /**
               * Выбранная станция
               * @type {bus.admin.mvp.model.StationModel}
               */
              selectedStationModel : {
                nullable : true,
                check : "bus.admin.mvp.model.StationModel"
              }

            },


            members : {

              _applyCurrNamesLangID : function(value, old, name){
                qx.module.Storage.setLocalItem("stations.currNamesLangID", value);
              },

              _applySelectedCityID : function(value, old, name){
                qx.module.Storage.setLocalItem("stations.selectedCityID", value);
              },


              getSelectedCity : function(){
                var cityID = this.getSelectedCityID();
                if(cityID <=0)
                  return null;
                return this.getCitiesModel().getCityByID(cityID);
              }

            }
          });