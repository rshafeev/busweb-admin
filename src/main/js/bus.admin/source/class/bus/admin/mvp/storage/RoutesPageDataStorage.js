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
 * Хранилище данных страницы {@link bus.admin.view.Routes Routes}
 */
qx.Class.define("bus.admin.mvp.storage.RoutesPageDataStorage", {
	extend : qx.core.Object,

	construct : function() {
		this.base(arguments);
    // create models
    var citiesModel = new bus.admin.mvp.model.CitiesModel();
    var langsModel = new bus.admin.mvp.model.LanguagesModel();
    langsModel.fromDataModel(bus.admin.AppProperties.LANGUAGES);
    this.setCitiesModel(citiesModel);
    this.setLangsModel(langsModel);
    this.setRouteTypes(bus.admin.AppProperties.RouteTypes);

    // get data from locale storage
    var selectedCityID = qx.module.Storage.getLocalItem("routes.selectedCityID");
    var selectedRouteTypeID = qx.module.Storage.getLocalItem("routes.selectedRouteTypeID");

    if(selectedCityID != undefined)
      this.setSelectedCityID(selectedCityID);

    if(selectedRouteTypeID != undefined)
      this.setSelectedRouteTypeID(selectedRouteTypeID);

  },

  properties : {
              /** Показывает состояние страницы, в котором она пребывает. Возможные значения:
                none : обычное состояние. 
              */
              state : {
              	init : "none",
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
               * Хранит список маршрутов
               * @type {bus.admin.mvp.model.RoutesListModel}
               */
              routesListModel : {
                nullable : true,
                check : "bus.admin.mvp.model.RoutesListModel"
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
               * Массив типов маршрутов. Каждый элемент имеет поле id и name. 
               * @type {Object[]}
               */
              routeTypes : {
                nullable : true
              },

              selectedRouteTypeID: {
                check : "String",
                init : "c_route_bus",
                apply : "_applySelectedRouteTypeID" 
              }


            },


            members : {


              /**
               * Вызывается при изменении свойства bus.admin.mvp.storage.RoutesPageDataStorage#selectedCityID.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
              _applySelectedCityID : function(value, old, name){
                qx.module.Storage.setLocalItem("routes.selectedCityID", value);
              },

              /**
               * Вызывается при изменении свойства bus.admin.mvp.storage.RoutesPageDataStorage#selectedRouteType.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
              _applySelectedRouteTypeID : function(value, old, name){
                qx.module.Storage.setLocalItem("routes.selectedRouteTypeID", value);
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