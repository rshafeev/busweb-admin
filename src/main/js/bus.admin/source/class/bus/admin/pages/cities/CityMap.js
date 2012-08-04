

qx.Class.define("bus.admin.pages.cities.CityMap", {
			extend : qx.ui.container.Composite,

			construct : function(citiesWidget) {
				this.base(arguments);
				this.__citiesWidget = citiesWidget;
				this.setLayout(new qx.ui.layout.Dock());
				this.initWidgets();
			},
			members : {
				__citiesWidget : null,
				__mapWidget : null,
				getContextMenu : function() {
					var menu = new qx.ui.menu.Menu;

					var cutButton = new qx.ui.menu.Button("Cut",
							"icon/16/actions/edit-cut.png", this._cutCommand);
					var copyButton = new qx.ui.menu.Button("Copy",
							"icon/16/actions/edit-copy.png", this._copyCommand);
					var pasteButton = new qx.ui.menu.Button("Paste",
							"icon/16/actions/edit-paste.png",
							this._pasteCommand);

					menu.add(cutButton);
					menu.add(copyButton);
					menu.add(pasteButton);

					return menu;
				},
				initWidgets : function() {
					// create Map Widget
					this.__mapWidget = new bus.admin.view.GoogleMap();
					this.__mapWidget.init(50, 36, 12);


					var list = new qx.ui.form.List;
					list.setContextMenu(this.getContextMenu());
					this.add(list);
					this.add(this.__mapWidget, {
								edge : "center"
							});
				}
			}
		});