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


qx.Class.define("bus.admin.page.header.BookmarksGroup", {
	extend : qx.ui.form.RadioButtonGroup,
	include : [qx.ui.core.MContentPadding],

	construct : function() {
		this.base(arguments, new qx.ui.layout.HBox(1));
		this.__initWidgets();
		var presenter  = qx.core.Init.getApplication().getPresenter();
		presenter.addListener("select_page", this.__onSelectPage, this);

	},

	members : {
		__initWidgets : function() {
			this.debug("execute __initWidgets()");
			var cities = new bus.admin.page.header.BookmarkButton(this.tr("Cities"), "Cities");
			cities.set({
				appearance : "modeButton"
			});
			this.add(cities);

			var stations = new bus.admin.page.header.BookmarkButton(this.tr("Stations"), "Stations");
			stations.set({
				appearance : "modeButton"
			});
			this.add(stations);

			var routes = new bus.admin.page.header.BookmarkButton(this.tr("Routes"), "Routes");
			routes.set({
				appearance : "modeButton"
			});
			this.add(routes);

		},

		__onSelectPage : function(e){
			var selectedPageKey = e.getData().pageKey;
			var childs  =  this.getChildren();
			for(var i=0; i < childs.length; i++){
				var btnPageKey = childs[i].getUserData("pageKey");
				if(btnPageKey == selectedPageKey){
					this.setSelection([childs[i]]);	
					return;
				}
			}
		}

	}
});