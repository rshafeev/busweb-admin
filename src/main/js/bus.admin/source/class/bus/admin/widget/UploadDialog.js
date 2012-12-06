
/*
 #ignore(google.maps)
 #ignore(google.maps.*)
 */

/**
 * Wraps an OpenLayers Map in an qooxdoo Widget.
 * 
 * @author Rui Lopes (ruilopes.com)
 */
qx.Class.define("bus.admin.widget.UploadDialog", {

			extend : qx.ui.core.Widget,

			members : {
				_createContentElement : function() {
					return new qx.html.Element("input", {
								overflowX : "hidden",
								overflowY : "hidden"
							}, {
								type : "file"
							});
				},

				getFiles : function() {
					return this.getContentElement().getDomElement().files;
				}
			}

		});
