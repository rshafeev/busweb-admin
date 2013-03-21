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
 * @ignore(OpenLayers)
 */

/**
 * Виджет OpenLayers карты
 */
qx.Class.define("bus.admin.widget.OpenLayersMap",
{
  extend : qx.ui.core.Widget,

  construct : function()
  {
    this.base(arguments);

    this.addListenerOnce("appear", this.__createMap, this);
    this.addListener("resize", this.__onResize, this);

  },

  destruct : function()
  {
    this.__map.destroy();
    this.__map = null;
  },
 
  members :
  {
    /**
     * OpenStreet карта
     * @type {OpenLayers.Map}
     */
    __map : null,

    /**
     * Возвращает  OpenStreet карту
     * @return {OpenLayers.Map}  OpenStreet карта
     */
    getMap : function()
    {
      return this.__map;
    },

    /**
     * Функция создает OpenLayers карту
     */
    __createMap : function()
    {
      if (this.__map)
          return;

      var mapDomId = "OpenLayersMap" + this.toHashCode();

      var el = this.getContentElement();
      el.setAttribute("id", mapDomId);
      qx.html.Element.flush(); // XXX this seems rather rude to do... is there a better way?

      var map = new OpenLayers.Map(mapDomId);

      map.addControl(new OpenLayers.Control.LayerSwitcher());

      var gphy = new OpenLayers.Layer.Google(
        "Google Physical",
        {type : google.maps.MapTypeId.TERRAIN}
      );
      var gmap = new OpenLayers.Layer.Google(
        "Google Streets",
        {numZoomLevels : 20}
      );
      //gmap.mapObject.addOverlay(new GStreetviewOverlay()); 

      var ghyb = new OpenLayers.Layer.Google(
        "Google Hybrid",
        {type : google.maps.MapTypeId.HYBRID, numZoomLevels : 20}
      );
      var gsat = new OpenLayers.Layer.Google(
        "Google Satellite",
        {type : google.maps.MapTypeId.SATELLITE, numZoomLevels : 22}
      );
 
      map.addLayers([gphy, gmap, ghyb, gsat]);

      map.setBaseLayer(ghyb);

      // Google.v3 uses EPSG:900913 as projection, so we have to
      // transform our coordinates
      this.__map = map;
      this.setCenter(50,36,13);
      // TODO raise some kind of "map ready" event
    },

    /**
     * Центрирует карту и задает масштаб
     * @param lat {Number}    Широта
     * @param lon {Number}    Долгота
     * @param scale {Integer}  Масштаб
     */
    setCenter : function(lat,lon,scale){
		if(this.__map){
				this.__map.setCenter(new OpenLayers.LonLat(lon,lat).transform(
						new OpenLayers.Projection("EPSG:4326"),
								this.__map.getProjectionObject()), scale);
		}
	},

    /**
     * Обработчик события вызывается при изменении размеров карты.
     */
    __onResize : function()
    {
      if (this.__map){
      	qx.html.Element.flush();
        this.__map.updateSize();
      }
      this.debug("__onResize");
    }
    
    
   
  }
});
