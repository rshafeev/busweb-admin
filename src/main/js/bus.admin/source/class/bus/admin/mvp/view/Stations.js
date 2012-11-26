/*******************************************************************************
 * 
 * qooxdoo - the new era of web development
 * 
 * http://qooxdoo.org
 * 
 * Copyright: 2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
 * 
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 * 
 * Authors: Tristan Koch (tristankoch)
 * 
 ******************************************************************************/

/*
 * #asset(qx/icon/${qx.icontheme}/32/status/dialog-information.png)
 */

/**
 * Demonstrates qx.ui.basic(...): Label, Image, Atom
 */

qx.Class.define("bus.admin.mvp.view.Stations", {
	extend : bus.admin.mvp.view.AbstractPage,

	construct : function() {
		this.base(arguments);
		this.setPresenter(new bus.admin.mvp.presenter.StationsPresenter());
		this.setStationsModel(new bus.admin.mvp.model.StationsModel());
		this.addListener("appear", this.on_appear, this);
		this.__initWidgets();
	},
	properties : {
		stationsLeftPanel : {
			nullable : true
		},
		stationsMap : {
			nullable : true
		},
		stationsModel : {
			nullable : true
		}
	},
	members : {
		_is_initialized : false,

		initialize : function() {
			this.loadData();

		},
		__initWidgets : function() {
			this.setLayout(new qx.ui.layout.Dock());

			// Create widgets
			var stationsMap = new bus.admin.mvp.view.stations.StationsMap(this);
			var leftPanel = new bus.admin.mvp.view.stations.StationsLeftPanel(this);
			this.setStationsMap(stationsMap);
			this.setStationsLeftPanel(leftPanel);

			// Create split
			var splitpane = new qx.ui.splitpane.Pane("horizontal");
			splitpane.add(this.getStationsLeftPanel(), 0);
			splitpane.add(this.getStationsMap(), 1)
			this.add(splitpane, {
						edge : "center"
					});

		},

		on_appear : function(e) {
			var visible = this.isVisible();
			this.debug("visible: " + visible.toString());
			// Если страница скрыта, отключим обработчики событий
			if (!visible) {
				this.__unInitChilds();
			}

			// Если страница уже была инициализирована и видима, то загрузим
			// данные в виджеты
			if (visible == true && this._is_initialized == true) {
				this.loadData();
			}
			this._is_initialized = true;

		},

		__initChilds : function() {
			var map = this.getStationsMap();
			var leftPanel = this.getStationsLeftPanel();
			map.initialize();
			leftPanel.initialize();

		},

		__unInitChilds : function() {
			var map = this.getStationsMap();
			var leftPanel = this.getStationsLeftPanel();

			leftPanel.unInitialize();

		},

		/**
		 * Показать/Скрыть индикатор ожидания (Если страница не видима, то
		 * индикатор не выводится)
		 * 
		 * @param {Показать/Скрыть}
		 *            isShow
		 */
		_showWaitWindow : function(isShow) {
			var visible = this.isVisible();
			if (visible) {
				qx.core.Init.getApplication().setWaitingWindow(isShow);
			}
		},

		/**
		 * Обновляет модель Stations и загружает ее данные в виджеты
		 */
		_refreshStations : function(nextFunc) {
			// Объявим функцию, которая будет вызвана после загрузки данных
			// с сервера
			var loadStations_finish_func = qx.lang.Function.bind(
					function(data) {
						if (nextFunc != null)
							nextFunc(data);
					}, this);
			var city_id = this.getStationsLeftPanel().getSelectableCityID();
			this.getPresenter().loadStations(city_id, loadStations_finish_func);

		},

		_refreshCities : function(nextFunc) {
			var loadCities_finish_func = qx.lang.Function.bind(function(data) {
						if (nextFunc != null)
							nextFunc(data);
					}, this);
			qx.core.Init.getApplication().getPresenter()
					.refreshCities(loadCities_finish_func);
		},
		refreshStations : function() {
			// Отключим обработчики виджетов
			this.__unInitChilds();

			// Заблокируем окно и выведем индикатор ожидания
			this._showWaitWindow(true);

			// Функция вызывается в конце выполнения операции загрузки моделей
			// данных
			var finishFunc = qx.lang.Function.bind(function(data) {
						this.__initChilds();
						this._showWaitWindow(false);
						if (data == null
								|| (data != null && data.error == true)) {
							alert(this
									.tr("Error! Can not load stations from server. "
											+ "Please, refresh page"));
							return;
						}
					}, this);
			this._refreshStations(finishFunc);
		},

		loadData : function() {
			// Отключим обработчики виджетов
			this.__unInitChilds();

			// Заблокируем окно и выведем индикатор ожидания
			this._showWaitWindow(true);

			// Функция вызывается в конце выполнения операции загрузки моделей
			// данных
			var finishFunc = qx.lang.Function.bind(function(data) {
						this.__initChilds();
						this._showWaitWindow(false);
						if (data == null
								|| (data != null && data.error == true)) {
							alert(this
									.tr("Error! Can not load stations from server. "
											+ "Please, refresh page"));
							return;
						}

						if (this._is_initialized == false) {
							this.fireEvent("init_finished");
						}
					}, this);

			// Функция вызывается после загрузки списка городов
			var refreshStationsFunc = qx.lang.Function.bind(function(data) {
						if (data == null
								|| (data != null && data.error == true)) {
							this._showWaitWindow(false);
							alert(this.tr("Error! Can not load cities from "
									+ "server. Please, refresh page"));
							return;
						}
						this._refreshStations(finishFunc);
					}, this);

			// Запускаем обновление списка городов
			this._refreshCities(refreshStationsFunc);
		}

	}
});