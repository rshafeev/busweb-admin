/*
 * #asset(bus/admin/images/*)
 */
 qx.Class.define("bus.admin.mvp.view.cities.CUCityForm", {
 	extend : qx.ui.window.Window,

 	construct : function(presenter, _isChangeDlg, cityModel) {
 		this.base(arguments);
 		this._isChangeDlg = _isChangeDlg;
 		this._cityModel = cityModel;
 		this._presenter = presenter;

 		this.__initWidgets();
 		this.__setOptions();
 	},
 	properties : {
 		changeDialog : {
 			nullable : true
 		}
 	},
 	members : {

 		_isChangeDlg : null,


 		_presenter : null,


 		_cityModel : null,


 		btn_save : null,
 		btn_cancel : null,
 		check_show : null,
 		editLat : null,
 		editLon : null,
 		editScale : null,
 		table_names : null,

 		on_save_click : function() {
			// validation
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
				.getRowDataAsMap(i);

				if (rowData.Name==null||rowData.Name.toString().length <= 0) {
					alert("Please, push names for all languages");
					return;
				}
			}

			if (this._isChangeDlg == true) {
				this.__updateCity();
			} else {
				this.__insertCity();
			}
		},

		on_cancel_click : function() {
			this.close();
		},

		__updateCity : function() {
			this.debug("__updateCity check:");
			
			var dataStorage = this._presenter.getDataStorage();
			// model
			var newCityModel = this._cityModel.clone();
			newCityModel.setLocation(this.editLat.getValue(), this.editLon.getValue());
			newCityModel.setShow(this.check_show.getValue());
			newCityModel.setScale(this.editScale.getValue());
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
				.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
				.getModelsContainer();
				var lang = dataStorage.getLangsModel().getLangByName(rowData.Language);
				newCityModel.setName(lang.getId(), rowData.Name);
			}
			
			qx.core.Init.getApplication().setWaitingWindow(true);
			
			var callback = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data.error == true) {
					var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
					this.tr("Error! Can not update city. Please, check input data.");
					alert(msg);
					return;
				}
				this.close();
			}, this);
			console.debug(newCityModel);
			this._presenter.updateCityTrigger(this._cityModel, newCityModel, callback);

		},

		__insertCity : function() {
			qx.core.Init.getApplication().setWaitingWindow(true);
			// create model
			var newCityModel = {
				location : {
					x : this.editLat.getValue(),
					y : this.editLon.getValue()
				},
				scale : this.editScale.getValue(),
				names : [],
				isShow: false
			};
			for (var i = 0; i < this.table_names.getTableModel().getRowCount(); i++) {
				var rowData = this.table_names.getTableModel()
				.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
				.getModelsContainer();
				var lang = modelsContainer.getLangsModel()
				.getLangByName(rowData.Language);
				newCityModel.names.push({
					lang_id : lang.id,
					value : rowData.Name
				});
			}
			var globalPresenter = qx.core.Init.getApplication().getPresenter();
			var event_finish_func = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data == null || data.error == true) {
					this.debug("__insert_city: request error");
					alert(data.server_error);
					return;
				}
				this.close();
			}, this);
			globalPresenter.insertCity(newCityModel, event_finish_func);

		},

		__initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			var positionSettings = new qx.ui.groupbox.GroupBox("Position");
			positionSettings.setLayout(new qx.ui.layout.Canvas());

			var labelLat = new qx.ui.basic.Label("Lat:");
			var labelLon = new qx.ui.basic.Label("Lon:");
			var labelScale = new qx.ui.basic.Label("Scale(2-21):");
			
			this.editLat = new qx.ui.form.TextField(this._cityModel.getLocation().getLat()
				.toString());
			this.editLon = new qx.ui.form.TextField(this._cityModel.getLocation().getLon()
				.toString());

			this.editLat.setWidth(110);
			this.editLon.setWidth(110);

			this.editScale = new qx.ui.form.Spinner();
			this.editScale.set({
				maximum : 21,
				minimum : 2
			});
			this.editScale.setWidth(50);

			this.btn_save = new qx.ui.form.Button("Save",
				"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.addListener("execute", this.on_save_click, this);
			this.btn_save.setWidth(90);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
				"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_cancel.setWidth(90);

			// names table

			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["Language", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);

			// table
			this.table_names = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			this.table_names.setBackgroundColor('gray');

			this.table_names.setStatusBarVisible(false);
			this.table_names.setWidth(300);
			this.table_names.setHeight(130);
			this.table_names.setColumnWidth(0, 100);
			this.table_names.setColumnWidth(1, 180);

			// add to cantainer
			positionSettings.add(labelLat, {
				left : 10,
				top : 10
			});
			positionSettings.add(this.editLat, {
				left : 40,
				top : 10
			});
			positionSettings.add(labelLon, {
				left : 10,
				top : 50
			});
			positionSettings.add(this.editLon, {
				left : 40,
				top : 50
			});

			positionSettings.add(labelScale, {
				left : 160,
				top : 10
			});
			positionSettings.add(this.editScale, {
				left : 240,
				top : 10
			});
			if (this._isChangeDlg == true) {
				this.check_show = new qx.ui.form.CheckBox("Visiable");
				positionSettings.add(this.check_show, {
					left : 160,
					top : 50
				});
				this.check_show.setValue(this._cityModel.getShow());
			}
			this.add(positionSettings, {
				left : 0,
				top : -15
			});
			this.add(this.table_names, {
				left : 10,
				top : 130
			});

			this.add(this.btn_save, {
				left : 50,
				top : 265
			});
			this.add(this.btn_cancel, {
				left : 160,
				top : 265
			});

		},

		__setOptions : function() {
			this.setHeight(350);
			this.setWidth(350);
			this.setModal(true);
			this.setAllowMaximize(false);
			this.setShowMaximize(false);
			this.setShowMinimize(false);
			this.setResizable(false, false, false, false);
			this.center();
			if (this._isChangeDlg == true) {
				this.setCaption("Change city");
			} else {

				this.setCaption("Insert new city");
			}

			/*if (this._cityModel.location != null) {
				this.editLat.setValue(this._cityModel.location.x.toString());
				this.editLon.setValue(this._cityModel.location.y.toString());
			}*/
			this.editScale.setValue(this._cityModel.getScale());

			// fill table
			console.info("CUCityForm _cityModel: ", this._cityModel);
			var langs = this._presenter.getDataStorage().getLangsModel().getLangs();
			var rowsData = [];
			for (var i = 0; i < langs.length; i++) {
				var cityName = "";
				if (this._isChangeDlg == true) {
					this.debug("lang: ", langs[i].getId());
					cityName = this._cityModel.getName(langs[i].getId());
				}
				rowsData.push([langs[i].getName(), cityName]);
			}
			this.table_names.getTableModel().setData(rowsData);

		}
	}

});