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
    this.setCitiesModel(citiesModel);
   
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
                make : добавление нового маршрута или изменение существующего.
                */
                state : {
                 init : "none",
                 check : "String",
                 apply : "_applyState"
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
               * Выбранный маршрут.
               * @type {bus.admin.mvp.model.RouteModel}
               */
               selectedRoute : {
                nullable : true,
                check : "bus.admin.mvp.model.RouteModel"
                
              },

              /**
               * Выбранный маршрут (копия). При редактировании текущего маршрута в данное свойство выполняется сохранение  его копии.
               * @type {bus.admin.mvp.model.RouteModel}
               */
               backupSelectedRoute : {
                nullable : true,
                check : "bus.admin.mvp.model.RouteModel"
              },

              /**
               * Центр карты.
               * @type {Object}
               */
               mapCenter : {
                nullable : true
              },

              /**
               * Выбранный тип маршрутов
               * @type {String}
               */
              selectedRouteTypeID: {
                check : "String",
                init : "bus",
                apply : "_applySelectedRouteTypeID" 
              },

              /**
               * Выбранное направление пути. (True: прямой путь, False: обратный путь)
               * @type {Object}
               */
              direction :{
                check : "Boolean",
                init : true
              },

              /**
               * Набор станций, которые были добавлены пользователем при конструировании маршрута. (Данные станции не занесены в БД). 
               * Их ID являются уникальными, но с отрицательным знаком (-1, -2, ...).
               * Занесение данных станций в БД происходит с сохранением в БД нового/измененного маршрута, причем только тех станций,
               * которые принадлежат данному маршруту.После успешного сохранения маршрута и переключения состояния страницы на "none",
               * данный массив очищается.
               * @type {bus.admin.mvp.model.StaionModelEx[]}
               */
               preparedStations : {
                 nullable : true
               }


             },


             members : {

               /**
               * Возвращает набор языков
               * @return {bus.admin.mvp.model.LanguagesModel}
               */
               getLangsModel : function(){
                return qx.core.Init.getApplication().getDataStorage().getSupportedLocales();
              },

              /**
               * Массив типов маршрутов. Каждый элемент имеет поле id и name. 
               * @return {Object[]}
               */
               getRouteTypes : function(){
                return qx.core.Init.getApplication().getDataStorage().getRouteTypes();
              },

              /**
               * Возвращает "prepared" станции, которые не включены в выбранный путь
               * @return {bus.admin.mvp.model.StationModelEx[]} Массив "prepared" станций
               */
               getFreePreparedStations : function(){
                 var arr = [];
                 var stations = this.getPreparedStations();
                 var way = this.getSelectedWay();
                 for(var i = 0; i < stations.length; i++){
                  if(way.isStationExists(stations[i].getId()) == false){
                    arr.push(stations[i]);
                  }
                }
                return arr;
              },

              /**
               * Добавляет в хранилище "prepared" станцию.
               * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции
               * @return {bus.admin.mvp.model.StationModelEx} Добавленная станция с назначенным ID
               */
               addPreparedStation : function(stationModel){
                var stations = this.getPreparedStations();
                if(stations == undefined)
                 stations = [];
               stationModel.setId(this.__getNextPreparedStationID());
               stations.push(stationModel);
               this.setPreparedStations(stations);
               return stationModel;
             },

              /**
               * Обновляет в хранилище "prepared" станцию.
               * @param  stationModel {bus.admin.mvp.model.StationModelEx}  Модель станции
               */
               updatePreparedStation : function(stationModel){
                var stations = this.getPreparedStations();
                if(stations == undefined)
                  return;
                for(var i=0;i < stations.length; i++){
                  if(stations[i].getId() == stationModel.getId()){
                    stations[i] = stationModel;
                    break;
                  }
                }
              },

              /**
               * Возвращает ID следующей станции 
               * @param  stationModel {bus.admin.mvp.model.StationModelEx} Модель станции
               * @return {Integer}  ID станции
               */
               __getNextPreparedStationID : function(stationModel){
                var stations = this.getPreparedStations();
                if(stations == undefined)
                  return -1;
                return (-stations.length - 1);
              },

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
               * Вызывается при изменении свойства bus.admin.mvp.storage.RoutesPageDataStorage#state.
               * @param  value {Object}  Новое значение свойства
               * @param  old {Object}    Предыдущее значение свойства
               * @param  name {String}   Название свойства
               */
               _applyState: function(value, old, name){
                if(value == "none")
                  this.setPreparedStations(null);
                if(value == "make")
                  this.setPreparedStations([]);
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
              },

              /**
               * Возвращает путь (прямой или обратный) для текущего направления (свойство direction).
               * @return {bus.admin.mvp.model.route.RouteWayModel} Модель пути.
               */
               getSelectedWay : function(){
                var direction = this.getDirection();
                var route = this.getSelectedRoute();
                if(route != undefined){
                  return route.getWayByDirection(direction);
                }
                return null;
              }

            }
          });