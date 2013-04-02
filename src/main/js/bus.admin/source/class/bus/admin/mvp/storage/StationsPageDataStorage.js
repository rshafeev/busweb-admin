/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/
 
/**
 * Хранилище данных страницы {@link bus.admin.view.Stations Stations}
 */
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
    this.setMapCenter(null);
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

              /**
               * Вызывается при изменении свойства bus.admin.mvp.storage.CitiesPageDataStorage#currNamesLangID.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
              _applyCurrNamesLangID : function(value, old, name){
                qx.module.Storage.setLocalItem("stations.currNamesLangID", value);
              },

              /**
               * Вызывается при изменении свойства bus.admin.mvp.storage.CitiesPageDataStorage#selectedCityID.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
              _applySelectedCityID : function(value, old, name){
                qx.module.Storage.setLocalItem("stations.selectedCityID", value);
              },

              /**
               * Возвращает выбранный пользоателем город.
               * @return {bus.admin.mvp.model.CyModel} Модель города.
               */
              getSelectedCity : function(){
                var cityID = this.getSelectedCityID();
                if(cityID <=0)
                  return null;
                return this.getCitiesModel().getCityByID(cityID);
              }

            }
          });