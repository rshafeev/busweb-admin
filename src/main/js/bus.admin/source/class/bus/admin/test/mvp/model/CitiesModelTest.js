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
 * Тестирование классов {@link bus.admin.mvp.model.CityModel} и {@link bus.admin.mvp.model.CitiesModel} 
 */
 qx.Class.define("bus.admin.test.mvp.model.CitiesModelTest",
 {
  extend : qx.dev.unit.TestCase,
  construct: function()
  {
    this.base(arguments);
    var data1 = '[]';

    this.debug("Parsing test data...");
    this._citiesData1 = qx.lang.Json.parse(data1);
  },

  members :
  {

    _citiesData1 : null,

    /*
    ---------------------------------------------------------------------------
      TESTS
    ---------------------------------------------------------------------------
    */

    /**
     * Проверим правильность инициализации модели CityModel из json объекта
     */
     testCityModelInit : function()
     {
      this.debug("execute testCityModelInit()");
      var cityModel = new bus.admin.mvp.model.CityModel(this._citiesData1[0]);
      console.debug(cityModel);
      this.assertEquals(cityModel.getId(), this._citiesData1[0].id, "Id property was failed");
      this.assertEquals(cityModel.getLocation().getLat(), this._citiesData1[0].location.lat, "Location property was failed");
      this.assertEquals(cityModel.getLocation().getLon(), this._citiesData1[0].location.lon, "Location property was failed");
    },

    /**
     * Проверим правильность инициализации модели CitiesModel из json объекта
     */
     testCitiesModelInit : function()
     {
      this.debug("execute testCitiesModelInit()");
      var citiesModel = new bus.admin.mvp.model.CitiesModel(this._citiesData1);
      console.debug(citiesModel);
      this.assertEquals(citiesModel.getAllCities().length, this._citiesData1.length, "Cities count is false");
    },

    /**
     * Проверим формирование объекта из модели CityModel
     */
    testCityModelToDataModel : function(){
      this.debug("execute testCityModelToJsonObj()");
      var cityModel = new bus.admin.mvp.model.CityModel(this._citiesData1[0]);
      var jsonObj = cityModel.toDataModel();
      console.debug(jsonObj);
    },

    /**
     * Проверим формирование объекта из модели CitiesModel
     */
    testCitiesModelToDataModel : function(){
      this.debug("execute testCitiesModelToJsonObj()");
      var citiesModel = new bus.admin.mvp.model.CitiesModel(this._citiesData1);
      var jsonObj = citiesModel.toDataModel();
      this.assertEquals(jsonObj.length, this._citiesData1.length, "Cities count is false");
    }

  }
});
