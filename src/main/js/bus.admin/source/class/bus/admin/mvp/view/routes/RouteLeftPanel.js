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

		this.initWidgets();

		var globPresenter = qx.core.Init.getApplication().getPresenter();
		globPresenter.addListener("refresh_cities", this.on_refresh_cities,
				this);
		var localPresenter = this._routesPage.getPresenter();
		localPresenter.addListener("startCreateNewRoute",
				this.on_startCreateNewRoute, this);
		localPresenter.addListener("finishCreateNewRoute",
				this.on_finishCreateNewRoute, this);

	},
	properties : {
		routeType : {
			nullable : true
		}
	},
	members : {
		_routesPage : null,
		_routesTabPage : null,
		_settingsTabPage : null,
		_newTabPage : null,
		combo_cities : null,
		combo_route_types : null,
		tabView : null,
		btn_refresh : null,

		/**
		 * Отключение всех обработчиков событий
		 */
		unInitialize : function() {

			this.removeListener("resize", this.on_resize_panel, this);
			this.combo_cities.removeListener("changeSelection",
					this.on_change_CitiesComboBox, this);
			this.combo_route_types.removeListener("changeSelection",
					this.on_change_RouteTypesComboBox, this);
			this._routesTabPage.unInitialize();
		},

		/**
		 * инициализация виджета: добавление всех обработчиков событий данного
		 * виджета и его child`ов
		 */
		initialize : function() {

			this.addListener("resize", this.on_resize_panel, this);
			this.combo_cities.addListener("changeSelection",
					this.on_change_CitiesComboBox, this);
			this.combo_route_types.addListener("changeSelection",
					this.on_change_RouteTypesComboBox, this);
			this._routesTabPage.initialize();
			this.debug("RouteLeftPanel was initialized");

		},

		/**
		 * Обработчик вызывается при начале добавления нового маршрута
		 * 
		 * @param {хранит
		 *            модель "Route"(еще не полностью заполненную)} e
		 */
		on_startCreateNewRoute : function(e) {
			this.combo_cities.setEnabled(false);
			this.combo_route_types.setEnabled(false);
			this._newTabPage.setEnabled(false);
			this._settingsTabPage.setEnabled(false);
		},

		/**
		 * Обработчик вызывается при окончании процесса создания нового
		 * маршрута: он был отредактирован пользователем, отправлен на сервер и
		 * сохранен в БД.
		 * 
		 * @param {}
		 *            e
		 */
		on_finishCreateNewRoute : function(e) {
			var data = e.getData();
			if (data == null || (data.error == true && data.isOK == true)) {
				return;
			}

			this.combo_cities.setEnabled(true);
			this.combo_route_types.setEnabled(true);
			this._newTabPage.setEnabled(true);
			this._settingsTabPage.setEnabled(true);
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
			var cityID = this.getSelectableCityID();
			if (cityID) {
				var city = qx.core.Init.getApplication().getModelsContainer()
						.getCitiesModel().getCityByID(cityID);
				var routeMap = this._routesPage.getRouteMap().getGoogleMap();
				routeMap
						.setCenter(city.location.x, city.location.y, city.scale);
				this._routesPage.refreshRoutes(cityID);
			}
			this.combo_cities.close();
		},
		on_change_RouteTypesComboBox : function(e) {
			this.debug("on_change_RouteTypesComboBox");
			var selections = this.combo_route_types.getSelection();
			if (selections == null || selections == []
					|| selections.length <= 0) {
				this.combo_route_types.close();
				return null;
			}

			var selectItem = selections[0];
			this.debug("on_change_RouteTypesComboBox1");
			var cityID = this.getSelectableCityID();
			if (cityID && selectItem && selectItem.getUserData("id") != null) {
				this.debug("on_change_RouteTypesComboBox2");
				this.debug(selectItem.getUserData("id"));
				this.setRouteType(selectItem.getUserData("id"));
				this._routesPage.refreshRoutes(cityID);
			}
			this.combo_route_types.close();
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
			this.combo_route_types = this._createComboRouteTypes();
			var combo_route_selections = this.combo_route_types.getSelection();
			if (combo_route_selections != null
					&& combo_route_selections.length > 0) {
				var selection = combo_route_selections[0];
				var route_type_id = selection.getUserData("id");
				this.setRouteType(route_type_id);
			}
			// this.setRouteType("c_route_bus");
			this.add(this.combo_route_types, {
						left : 220,
						top : 10
					});
			// tabView
			this.tabView = this._createTabView();
			this.add(this.tabView, {
						left : 10,
						top : 40
					});

			this.btn_refresh = new qx.ui.form.Button("",
					"bus/admin/images/btn/view-refresh.png");
			this.btn_refresh.setWidth(35);

		},
		loadCitiesToComboBox : function(cities) {
			this.debug("on_loadCitiesToComboBox()");
			var defaultItem = null;
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			this.combo_cities.removeAll();
			for (var i = 0; i < cities.length; i++) {
				var name = bus.admin.mvp.model.helpers.CitiesModelHelper
						.getCityNameByLang(cities[i], lang_id);
				var item = new qx.ui.form.ListItem(name);
				item.setUserData("id", cities[i].id);
				if (defaultItem == null) {
					defaultItem = item;
				}

				this.combo_cities.add(item);
			}
			if (defaultItem != null) {
				this.combo_cities.setSelection([defaultItem]);
			}

		},
		getSelectableCityID : function() {
			var cityComboItem = bus.admin.helpers.WidgetHelper
					.getSelectionItemFromSelectBox(this.combo_cities);
			if (cityComboItem == null)
				return null;
			return cityComboItem.getUserData("id");
		},

		_createTabView : function() {
			var tabView = new qx.ui.tabview.TabView();
			this._routesTabPage = new bus.admin.mvp.view.routes.tabs.RoutesTabPage(
					this, this._routesPage);
			this._newTabPage = new bus.admin.mvp.view.routes.tabs.NewTabPage(this);
			this._settingsTabPage = new bus.admin.mvp.view.routes.tabs.SettingsTabPage(this);
			tabView.add(this._routesTabPage);
			// tabView.add(this._newTabPage);
			// tabView.add(this._settingsTabPage);
			return tabView;
		},

		_createComboRouteTypes : function() {
			var combo = new qx.ui.form.SelectBox();
			combo.setHeight(25);
			combo.setWidth(170);

			var route_types = [{
						id : "c_route_bus",
						text : this.tr("Bus")
					}, {
						id : "c_route_tram",
						text : this.tr("Tram")
					}, {
						id : "c_route_trolley",
						text : this.tr("Trolleybus")
					}, {
						id : "c_route_metro",
						text : this.tr("Metro")
					}, {
						id : "c_route_metro_transition",
						text : this.tr("Metro`s transition")
					}];
			var defaultItem = null;
			for (var i = 0; i < route_types.length; i++) {
				var id = route_types[i].id;
				var text = route_types[i].text;
				var item = new qx.ui.form.ListItem(text);
				item.setUserData("id", id);
				combo.add(item);
				if (defaultItem == null) {
					defaultItem = item;
				}
			}
			if (defaultItem != null) {
				combo.setSelection([defaultItem]);
			}

			return combo;
		}

	}
});