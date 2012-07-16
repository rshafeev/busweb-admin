/**
 * Wraps an OpenLayers Map in an qooxdoo Widget.
 *
 * @author Rui Lopes (ruilopes.com)
 */
qx.Class.define("bus.admin.view.OpenLayersMap",
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
    __map : null,

    getMap : function()
    {
      return this.__map;
    },

    __createMap : function()
    {
      if (this.__map)
          return;

      // TODO instead of setting the id, we could just pass the DOM node
      //      (el.getDomElement) into the OpenLayers.Map constructor.

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
    setCenter : function(lat,lon,scale){
		if(this.__map){
				this.__map.setCenter(new OpenLayers.LonLat(lon,lat).transform(
						new OpenLayers.Projection("EPSG:4326"),
								this.__map.getProjectionObject()), scale);
		}
	},
    __onResize : function(e)
    {
      // TODO unfortunately, this is called when this widget is resized...
      //      not when the Element returned by getContentElement is resized...
      //      so figure out how to known when the DOM node is actually
      //      resized and call updateMapSize in there. maybe the Element class
      //      raises events?
      if (this.__map)
        this.__map.updateSize();
      this.debug("__onResize");
    }
  }
});
