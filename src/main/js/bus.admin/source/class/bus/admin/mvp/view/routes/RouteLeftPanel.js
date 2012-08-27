/*
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-terminal.png)
 * #asset(qx/icon/${qx.icontheme}/32/apps/utilities-terminal.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-notes.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-calculator.png)
 * #asset(qx/icon/${qx.icontheme}/16/apps/utilities-help.png)
 * 
 * 
 * 
 */

qx.Class.define("bus.admin.mvp.view.routes.RouteLeftPanel", {
	extend : qx.ui.container.Composite,
	include : [],
	events : {
		"load_finish" : "qx.event.type.Event"
	},
	construct : function(routesPage) {

		this._routesPage = routesPage;
		this.base(arguments);
		this.setLayout(new qx.ui.layout.Canvas());
		this.setWidth(510);
		this.setMinWidth(300);
		this.setAppearance("left-panel");
		this.setTransportType("c_bus");

		this.addListener("resize", this.on_resize_panel, this);
		this.initWidgets();

		var presenter = qx.core.Init.getApplication().getPresenter();
		presenter.addListener("update_city", this.on_update_city, this);
		presenter.addListener("insert_city", this.on_insert_city, this);
		presenter.addListener("delete_city", this.on_delete_city, this);
		presenter.addListener("refresh_cities", this.on_refresh_cities, this);

	},
	properties : {
		transportType : {
			nullable : true
		}
	},
	members : {
		_routesPage : null,
		_routesTabPage : null,
		_settingsTabPage : null,
		_newTabPage : null,
		combo_cities : null,
		radioButtonGroup : null,
		tabView : null,
		btn_refresh : null,

		initialize : function() {

		},
		on_resize_panel : function(e) {
			if (this.tabView) {
				this.tabView.setWidth(this.getBounds().width
						- this.tabView.getBounds().left - 10);
				this.tabView.setHeight(this.getBounds().height
						- this.tabView.getBounds().top - 10);
			}
		},
		on_change_CitiesComboBox : function(e) {
			var map = this._routesPage.getRouteMap();

			var cityName = bus.admin.helpers.WidgetHelper
					.getValueFromSelectBox(this.combo_cities);
			var langName = bus.admin.AppProperties.DEFAULT_LANGUAGE;
			var city = this._routesPage.getModelsContainer().getCitiesModel()
					.getCityByName(cityName, langName);

			if (city) {
				map.getGoogleMap().setCenter(city.location.lat,
						city.location.lon, city.scale);
			}

		},
		on_update_city : function(e) {

		},
		on_insert_city : function(e) {

		},
		on_delete_city : function(e) {

		},
		on_refresh_cities : function(e) {
			var data = e.getData();
			if (data == null || data.error == true) {
				this.debug("on_refresh_cities() : event data has errors");
				return;
			}
			this.loadCitiesToComboBox(data.models.cities);
		},

		initWidgets : function() {
			var labelCity = new qx.ui.basic.Label("City:");
			this.combo_cities = new qx.ui.form.SelectBox();
			this.combo_cities.setHeight(25);
			this.combo_cities.setWidth(170);
			this.combo_cities.addListener("changeSelection",
					this.on_change_CitiesComboBox, this);

			this.add(labelCity, {
						left : 10,
						top : 10
					});

			this.add(this.combo_cities, {
						left : 40,
						top : 10
					});

			this.addListenerOnce("appear", function() {
						this.on_resize_panel();
					});
			// radio group
			this.radioButtonGroup = this.__createRadioGroup();
			this.add(this.radioButtonGroup, {
						left : 10,
						top : 40
					});
			// tabView
			this.tabView = this.__createTabView();
			this.add(this.tabView, {
						left : 10,
						top : 70
					});

			this.btn_refresh = new qx.ui.form.Button("",
					"bus/admin/images/btn/view-refresh.png");
			this.btn_refresh.setWidth(35);

		},
		loadCitiesToComboBox : function(cities) {
			this.debug("on_loadLanguagesToComboBox()");
			var defaultItem = null;

			this.combo_cities.removeAll();
			for (var i = 0; i < cities.length; i++) {
				var name = bus.admin.mvp.model.helpers.CitiesModelHelper
						.getCityNameByLang(cities[i],
								bus.admin.AppProperties.DEFAULT_LANGUAGE);
				if (defaultItem != null) {
					this.combo_cities.add(new qx.ui.form.ListItem(name));
				} else {
					defaultItem = new qx.ui.form.ListItem(name);
					this.combo_cities.add(defaultItem);
				}
			}
			if (defaultItem != null) {
				this.combo_cities.setSelection([defaultItem]);
			}

		},
		__createTabView : function() {
			var tabView = new qx.ui.tabview.TabView();
			this._routesTabPage = new bus.admin.mvp.view.routes.tabs.RoutesTabPage(this);
			this._newTabPage = new bus.admin.mvp.view.routes.tabs.NewTabPage(this);
			this._settingsTabPage = new bus.admin.mvp.view.routes.tabs.SettingsTabPage(this);
			tabView.add(this._routesTabPage);
			tabView.add(this._newTabPage);
			tabView.add(this._settingsTabPage);
			return tabView;
		},
		__createRadioGroup : function() {
			var radioButtonGroup = new qx.ui.form.RadioButtonGroup();
			radioButtonGroup.setLayout(new qx.ui.layout.HBox(5));
			var radioBus = new qx.ui.form.RadioButton("Bus");
			var radioTrolley = new qx.ui.form.RadioButton("Trolley");
			var radioTram = new qx.ui.form.RadioButton("Tram");
			var radioMetro = new qx.ui.form.RadioButton("Metro");

			radioBus.addListener("execute", this.on_btn_bus_click, this);
			radioTrolley
					.addListener("execute", this.on_btn_trolley_click, this);
			radioTram.addListener("execute", this.on_btn_tram_click, this);
			radioMetro.addListener("execute", this.on_btn_metro_click, this);

			radioButtonGroup.add(radioBus);
			radioButtonGroup.add(radioTrolley);
			radioButtonGroup.add(radioTram);
			radioButtonGroup.add(radioMetro);
			return radioButtonGroup;
		},

		on_btn_bus_click : function(e) {
			this.setTransportType("c_bus");
			this._routesTabPage.refreshWidgets();
			this._newTabPage.refreshWidgets();
		},
		on_btn_trolley_click : function(e) {
			this.setTransportType("c_trolley");
			this._routesTabPage.refreshWidgets();
			this._newTabPage.refreshWidgets();
		},
		on_btn_tram_click : function(e) {
			this.setTransportType("c_tram");
			this._routesTabPage.refreshWidgets();
			this._newTabPage.refreshWidgets();
		},
		on_btn_metro_click : function(e) {
			this.setTransportType("c_metro");
			this._routesTabPage.refreshWidgets();
			this._newTabPage.refreshWidgets();
		}
	}
});