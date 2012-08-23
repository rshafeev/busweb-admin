qx.Class.define("bus.admin.mvp.view.routes.tabs.SettingsTabPage", {
			extend : qx.ui.tabview.Page,
			construct : function(routesLeftPanel) {
				this.base(arguments, "Settings",
						"icon/16/apps/utilities-notes.png");
				this.__routesLeftPanel = routesLeftPanel;
				this.setLayout(new qx.ui.layout.Canvas());
				this.initWidgets();

			},

			members : {
				__routesLeftPanel : null,
				refreshWidgets : function() {

				},
				initWidgets : function() {

					var scrollContainer = new qx.ui.container.Scroll();
					//scrollContainer.setBackgroundColor("blue");
					scrollContainer.add(new qx.ui.basic.Label("Notes..."), {
								left : 0,
								top : 0
							});

					this.add(scrollContainer, {
								left : 0,
								top : 0,
								width : "100%",
								height : "100%"
							});
					this.__scrollContainer = scrollContainer;
				}

			}

		});