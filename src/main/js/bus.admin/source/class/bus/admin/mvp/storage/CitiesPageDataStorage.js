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
 * Хранилище данных страницы {@link bus.admin.view.Cities Cities}
 */
qx.Class.define("bus.admin.mvp.storage.CitiesPageDataStorage", {
	extend : qx.core.Object,

	construct : function() {
		this.base(arguments);
    // create models
    var citiesModel = new bus.admin.mvp.model.CitiesModel();
    this.setCitiesModel(citiesModel);
    this.setState("none");
    this.setMapCenter(null);
    // get data from locale storage
    var currNamesLangID = qx.module.Storage.getLocalItem("cities.currNamesLangID");
    var selectedCityID = qx.module.Storage.getLocalItem("cities.selectedCityID");
    
    if(selectedCityID != undefined)
      this.setSelectedCityID(selectedCityID);

    if(currNamesLangID != undefined){
      this.setCurrNamesLangID(currNamesLangID);
    }
    else{
      var locale = qx.core.Init.getApplication().getDataStorage().getLocale();
      var langs = this.getLangsModel().getLangs();
      for(var i=0;i < langs.length; i++){
        var langID = langs[i].getId();
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
              move - Была нажата кнопка "Move" и выполняется пользователем подбор масштаба и 
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
              },

              /**
               * Центр карты.
               * @type {Object}
               */
              mapCenter : {
                  nullable : true
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
                qx.module.Storage.setLocalItem("cities.currNamesLangID", value);
              },

              /**
               * Вызывается при изменении свойства bus.admin.mvp.storage.CitiesPageDataStorage#selectedCityID.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
              _applySelectedCityID : function(value, old, name){
                qx.module.Storage.setLocalItem("cities.selectedCityID", value);
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
              },

              /**
               * Возвращает набор языков
               * @type {bus.admin.mvp.model.LanguagesModel}
               */
              getLangsModel : function(){
                return qx.core.Init.getApplication().getDataStorage().getSupportedLocales();
              }
            }
          });