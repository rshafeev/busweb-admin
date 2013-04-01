/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * Окно для импортироавния маршрутов с файла.
 */
qx.Class.define("bus.admin.mvp.view.routes.ImportRouteForm", {
	extend : qx.ui.window.Window,

	/**
	 * @param  presenter {bus.admin.mvp.presenter.RoutesPresenter}  [description]
	 * @param  routeType {String}  Тип маршрута
	 * @param  cityModel {bus.admin.mvp.model.CityModel}  Город.
	 */
	construct : function(presenter, routeType, cityModel) {
		this.base(arguments);
		this.__presenter = routesPresenter;
		this._cityModel = cityModel;
		this._routeType = routeType;
		this._initWidgets();
		this._setOptions();

		this.__presenter.addListener("loadImportObjects",
				this.on_loadImportObjects, this);
	},
	
	destruct : function() {
		this.debug("destruct()");
		this.__presenter.removeListener("loadImportObjects",
				this.on_loadImportObjects, this);
		this.__presenter = null;
		this._cityModel = null;
		this._routeType = null;
		this.dispose();
	},

	members : {
		__presenter : null,
		_routeType : null,
		_cityModel : null,
		btn_insert : null,
		btn_cancel : null,
		btn_import : null,
		btn_del : null,
		filterField : null,
		table_obj : null,

		on_loadImportObjects : function(e) {
			var data = e.getData();

			if (data == null || (data != null && data.error == true)) {
				this.debug("Error! execute on_loadImportObjects()");
				return;
			}
			this.debug("info! execute on_loadImportObjects()1");
			var objects = data.obj;
			if (objects == null) {
				this.debug("info! execute on_loadImportObjects()2 null");
				return;
			}

			var rowData = [];
			for (var i = 0; i < objects.length; i++) {
				rowData.push([objects[i].id, objects[i].route_number]);
			}
			this.table_obj.getTableModel().setData(rowData);

		},

		_initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());
			var lang_id = "c_" + qx.locale.Manager.getInstance().getLocale();
			var cityName = bus.admin.mvp.model.helpers.CitiesModelHelper
					.getCityNameByLang(this._cityModel, lang_id);

			var cityNameLabel = new qx.ui.basic.Label(this.tr("City:"));
			var cityLabel = new qx.ui.basic.Label(cityName);
			var routeTypeLabel = new qx.ui.basic.Label(this
					.tr("Transport type:"));
			var typeLabel = new qx.ui.basic.Label(this._routeType.text);

			this.add(cityNameLabel, {
						left : 10,
						top : 10
					});
			this.add(cityLabel, {
						left : 60,
						top : 10
					});
			this.add(routeTypeLabel, {
						left : 120,
						top : 10
					});
			this.add(typeLabel, {
						left : 240,
						top : 10
					});

			var filterLabel = new qx.ui.basic.Label("Filter:");
			this.filterField = new qx.ui.form.TextField();
			/*
			 * this.add(filterLabel, { left : 10, top : 50 });
			 * this.add(this.filterField, { left : 70, top : 50 });
			 */

			this.btn_insert = new qx.ui.form.Button("Insert",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_insert.setWidth(90);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_cancel.setWidth(90);

			this.btn_import = new qx.ui.form.Button("Import",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_import.addListener("execute", this.on_cancel_click, this);
			this.btn_import.setWidth(90);

			this.btn_del = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_del.addListener("execute", this.on_cancel_click, this);
			this.btn_del.setWidth(90);
			// obj tables
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["ID", "Number"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			this.table_obj = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			this.table_obj.setBackgroundColor('gray');

			this.table_obj.setStatusBarVisible(false);
			this.table_obj.setWidth(260);
			this.table_obj.setHeight(160);
			this.table_obj.setColumnWidth(0, 80);
			this.table_obj.setColumnWidth(1, 140);

			var mainSettings = new qx.ui.groupbox.GroupBox("Import from file:");
			mainSettings.setLayout(new qx.ui.layout.Canvas());
			mainSettings.setWidth(300);
			mainSettings.setHeight(120);

			var upload = new bus.admin.widget.UploadDialog();
			upload.setWidth(300);
			var buttonSend = new qx.ui.form.Button("Send");
			buttonSend.addListener("execute", function(e) {
						this.on_uploadFile(upload);
					}, this);
			mainSettings.add(upload, {
						left : 0,
						top : 0
					});
			mainSettings.add(buttonSend, {
						left : 0,
						top : 40
					});

			this.add(mainSettings, {
						left : 10,
						top : 30
					});

			this.add(this.btn_del, {
						left : 270,
						top : 150
					});

			this.add(this.table_obj, {
						left : 10,
						top : 150
					});

			this.add(this.btn_insert, {
						left : 70,
						top : 315
					});
			this.add(this.btn_cancel, {
						left : 180,
						top : 315
					});

		},

		_on_appear : function(e) {
			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null
								|| (data != null && data.error == true)) {
							alert("Error! Can not load import objects!");
							this.destroy();
						}
					}, this);
			this.__presenter.loadImportObjects(this._cityModel.id,
					this._routeType.id, event_finish_func);

		},
		on_uploadFile : function(upload) {
			var files = upload.getFiles();
			if (files == null || files == undefined)
				return;
			if (files.length == 0)
				return;
			var reader = new FileReader();

			// Closure to capture the file information.
			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					this.debug(evt.target.result);
				}
			};
			// Read in the image file as a data URL.
			reader.readAsText(files[0]);
		},

		_setOptions : function() {
			this.setHeight(410);
			this.setWidth(390);
			this.setCaption("Import Dialog");
			this.setModal(true);
			this.setAllowMaximize(false);
			this.setShowMaximize(false);
			this.setShowMinimize(false);
			this.setResizable(false, false, false, false);
			this.center();
			this.addListenerOnce("appear", this._on_appear, this);
			this.filterField.addListener("input", this.on_change_filterField,
					this);
			this.btn_insert.addListener("execute", this.on_insert_click, this);
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_import.addListener("execute", this.on_import_click, this);
			this.btn_del.addListener("execute", this.on_delete_click, this);
		},

		on_insert_click : function(e) {
			var row = this.table_obj.getSelectionModel()
					.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this.table_obj.getTableModel().getRowDataAsMap(row);
			var objID = rowData.ID;
			var presenter = this.__presenter;
			var routes = presenter.getRoutePage().getCurrRoutesList();
			if (routes != null) {
				for (var i = 0; i < routes.length; i++) {
					if (routes[i].number != null
							&& routes[i].number.toString().length != 0
							&& routes[i].number.toString() == rowData.Number
									.toString()) {
						alert(this
								.tr("The route with this number has already exist!"));
						return;
					}
				}
			}
			qx.core.Init.getApplication().setWaitingWindow(true);
			var loadImportRouteFunc = qx.lang.Function.bind(function(data) {
						qx.core.Init.getApplication().setWaitingWindow(false);
						if (data == null
								|| (data != null && data.error == true)) {
							alert("Error! Can not load import route!");
							return;
						}
						this.debug(data);
						var startCreateNewRouteFunc = qx.lang.Function.bind(
								function(e) {
									this.destroy();
								}, this);
						presenter.startCreateNewRoute(data.route, "new",
								startCreateNewRouteFunc);
					}, this);

			presenter.loadImportRoute(objID, loadImportRouteFunc);
		},

		on_cancel_click : function(e) {
			this.destroy();
		},

		on_import_click : function(e) {

		},

		on_delete_click : function(e) {

		},
		on_change_filterField : function(e) {
			var fieldValue = this.filterField.getValue();
			var model = this.table_obj.getTableModel();

			if (fieldValue.length > 0) {
				model.resetHiddenRows();
				model.addNotRegex(fieldValue, "Number", true);
				model.applyFilters();
			} else {
				model.resetHiddenRows();
			}
		}

	}
});
