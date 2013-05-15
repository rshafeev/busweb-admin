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
 * Тестирование класса {@link bus.admin.mvp.model.route.RouteWayModel}
 */
 qx.Class.define("bus.admin.test.mvp.model.route.RouteWayModelTest",
 {
  extend : qx.dev.unit.TestCase,
  construct: function()
  {
    this.base(arguments);
  },

  members :
  {

    /*
    ---------------------------------------------------------------------------
      TESTS
    ---------------------------------------------------------------------------
    */

    /**
     * Проверим правильность формирования модели путем добавления станций в конец пути
     */
     testInsertStation1 : function()
     {
       this.assertEquals(1,1, "Relations count is failed");

       var st1 = new bus.admin.mvp.model.StationModelEx();
       st1.setId(-20);
       st1.setLocation(10, 20);

       var st2 = new bus.admin.mvp.model.StationModelEx();
       st2.setLocation(10, 20);

       this.assertEquals(-20, st1.getId(), "Relations count is failed");

       var routeWay = new bus.admin.mvp.model.route.RouteWayModel();
       routeWay.setId(5);
       this.assertEquals(5, routeWay.getId(), "Relations count is failed");

      // Добавим первую станцию
      var result = routeWay.insertStation(st1, 0);

      // tests
      var relations = routeWay.getRelations();
      this.assertEquals(1, routeWay.getRelations().length, "Relations count is failed");
      this.assertEquals(st1.getLocation().getLat(), relations[0].getCurrStation().getLocation().getLat(), "Lat of station is failed");
      this.assertEquals(st1.getLocation().getLon(), relations[0].getCurrStation().getLocation().getLon(), "Lon of station is failed");
      this.assertEquals(st1.getId(), relations[0].getCurrStation().getId(), "Station id is failed");
      
      this.assertEquals(1, result.length, "Return result is failed");
      this.assertEquals("insert", result[0].operation, "Return result is failed");


      // Доавим вторую станцию после первой
      result = routeWay.insertStation(st2, 1);
      relations = routeWay.getRelations();
      this.assertEquals(2, routeWay.getRelations().length, "Relations count is failed");
      this.assertEquals(st2.getLocation().getLat(), relations[1].getCurrStation().getLocation().getLat(), "Lat of station is failed");
      this.assertEquals(st2.getLocation().getLon(), relations[1].getCurrStation().getLocation().getLon(), "Lon of station is failed");
      this.assertEquals(st2.getId(), relations[1].getCurrStation().getId(), "Station id is failed");
      this.assertEquals(0,relations[0].getIndex(), "Relation index is failed");
      this.assertEquals(1,relations[1].getIndex(), "Relation index is failed");


    },

    /**
     * Проверим правильность формирования модели путем добавления станций в начало пути
     */
     testInsertStation2 : function()
     {
       var st1 = new bus.admin.mvp.model.StationModelEx();
       st1.setId(-1);
       st1.setLocation(10, 20);

       var st2 = new bus.admin.mvp.model.StationModelEx();
       st2.setId(-2);
       st2.setLocation(20, 40);

       var st3 = new bus.admin.mvp.model.StationModelEx();
       st3.setId(-4);
       st3.setLocation(30, 50);


       var routeWay = new bus.admin.mvp.model.route.RouteWayModel();

       routeWay.insertStation(st3, 0);
       routeWay.insertStation(st2, 0);
       routeWay.insertStation(st1, 0);

      // tests
      var relations = routeWay.getRelations();
      this.assertEquals(3, routeWay.getRelations().length, "Relations count is failed");
      this.assertEquals(st1.getId(), relations[0].getCurrStation().getId(), "Station id is failed");
      this.assertEquals(st2.getId(), relations[1].getCurrStation().getId(), "Station id is failed");
      this.assertEquals(st3.getId(), relations[2].getCurrStation().getId(), "Station id is failed");
      this.assertNull(relations[0].getGeom(), "Geom for first relation is not null");
      this.assertNotNull(relations[1].getGeom(), "Geom for relation is  null");
      this.assertNotNull(relations[2].getGeom(), "Geom for relation is  null");
    },

    /**
     * Проверим правильность формирования модели путем добавления станций в середину пути
     */
     testInsertStation3 : function()
     {
       var st1 = new bus.admin.mvp.model.StationModelEx();
       st1.setId(-1);
       st1.setLocation(10, 20);

       var st2 = new bus.admin.mvp.model.StationModelEx();
       st2.setId(-2);
       st2.setLocation(20, 40);

       var st3 = new bus.admin.mvp.model.StationModelEx();
       st3.setId(-4);
       st3.setLocation(30, 50);


       var routeWay = new bus.admin.mvp.model.route.RouteWayModel();

       routeWay.insertStation(st1, 0);
       routeWay.insertStation(st2, 1);
       var result = routeWay.insertStation(st3, 1);

      // tests
      var relations = routeWay.getRelations();
      this.assertEquals(3, routeWay.getRelations().length, "Relations count is failed");
      this.assertEquals(st3.getId(), relations[1].getCurrStation().getId(), "Station id is failed");
      this.assertNull(relations[0].getGeom(), "Geom for first relation is not null");
      this.assertNotNull(relations[1].getGeom(), "Geom for relation is  null");
      this.assertNotNull(relations[2].getGeom(), "Geom for relation is  null");
      this.assertEquals(2, result.length, "Result count is failed");
    }

  }
});
