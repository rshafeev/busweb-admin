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

 qx.Class.define("bus.admin.test.mvp.model.CitiesModelTest",
 {
  extend : qx.dev.unit.TestCase,
  construct: function()
  {
    this.base(arguments);
    var data1 = '[{"id":1,"location":{"x":49.99856553512043,"y":36.234832763671875,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":0},'+
    '"scale":12,"nameKey":3,"isShow":true,' + 
    '"names":[{"id":12187,"key_id":3,"lang_id":"c_en","value":"Kharkov"},' +
    '{"id":12188,"key_id":3,"lang_id":"c_ru","value":"Харьков"}]},' +
    '{"id":2,"location":{"x":50.45726988211955,"y":30.52459716796875,"z":0.0,"m":0.0,"dimension":2,"haveMeasure":false,"type":1,"srid":0},' +
    '"scale":12,"nameKey":5,"isShow":true,"names":' +
    '[{"id":12189,"key_id":5,"lang_id":"c_ru","value":"Киев"},' +
    '{"id":12190,"key_id":5,"lang_id":"c_en","value":"Kyiv"}]}]';

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
      this.assertEquals(cityModel.getLocation().getLat(), this._citiesData1[0].location.x, "Location property was failed");
      this.assertEquals(cityModel.getLocation().getLon(), this._citiesData1[0].location.y, "Location property was failed");
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
