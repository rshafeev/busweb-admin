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
    var data1 = "{\"cities\":[{\"id\":55,\"key\":\"\",\"location\":{\"lat\":46.846674042342435,\"lon\":35.37549018859865}," + 
    "\"scale\":13,\"nameKey\":4381,\"show\":false,\"names\":[{\"id\":13420,\"lang\":\"uk\",\"value\":\"Мелитополь\"}," + 
    "{\"id\":13422,\"lang\":\"ru\",\"value\":\"Мелитополь\"},{\"id\":13421,\"lang\":\"en\",\"value\":\"Melitopol\"}]}]}";

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
      var cities = this._citiesData1.cities;
      var cityModel = new bus.admin.mvp.model.CityModel(cities[0]);
      console.debug(cityModel);
      this.assertEquals(cities[0].id,cityModel.getId(), "Id property was failed");
      this.assertEquals(cities[0].location.lat, cityModel.getLocation().getLat(), "Location property was failed");
      this.assertEquals(cities[0].location.lon, cityModel.getLocation().getLon(), "Location property was failed");
    },

    /**
     * Проверим правильность инициализации модели CitiesModel из json объекта
     */
     testCitiesModelInit : function()
     {
      this.debug("execute testCitiesModelInit()");
      var cities = this._citiesData1.cities;
      var citiesModel = new bus.admin.mvp.model.CitiesModel(this._citiesData1);
      console.debug(citiesModel);
      this.assertEquals(citiesModel.getAllCities().length, cities.length, "Cities count is false");
    },

    /**
     * Проверим формирование объекта из модели CityModel
     */
     testCityModelToDataModel : function(){
      this.debug("execute testCityModelToJsonObj()");
      var cities = this._citiesData1.cities;
      var cityModel = new bus.admin.mvp.model.CityModel(cities[0]);
      var jsonObj = cityModel.toDataModel();
      console.debug(jsonObj);
    },

    /**
     * Проверим формирование объекта из модели CitiesModel
     */
     testCitiesModelToDataModel : function(){
      this.debug("execute testCitiesModelToJsonObj()");
      var cities = this._citiesData1.cities;
      var citiesModel = new bus.admin.mvp.model.CitiesModel(this._citiesData1);
      var jsonObj = citiesModel.toDataModel();
      this.assertEquals(cities.length, jsonObj.cities.length, "Cities count is false");
    }

  }
});
