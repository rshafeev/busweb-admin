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

/*
 * #asset(bus/admin/images/*)
 */

/**
 * Диалоговое окно для создания/ редактироания города.
 */
 qx.Class.define("bus.admin.mvp.view.cities.CUCityForm", {
 	extend : qx.ui.window.Window,

 	/**
 	 * 
 	 * @param  presenter   {bus.admin.mvp.presenter.CitiesPresenter}  Presenter   
 	 * @param  isChangeDlg {Boolean}  Тип окна. True - диалоговое окно для редактирования ранее созданного города. False - диалоговое окнго создания нового города.
 	 * @param  cityModel   {bus.admin.mvp.model.CityModel}     Модель города.
 	 */
 	 construct : function(presenter, isChangeDlg, cityModel) {
 	 	this.base(arguments);
 	 	this.__isChangeDlg = isChangeDlg;
 	 	this.__cityModel = cityModel;
 	 	this.__presenter = presenter;

 	 	this.__initWidgets();
 	 	this.__setOptions();
 	 },

 	 members : {

 		/**
 		 * Тип окна. True - диалоговое окно для редактирования ранее созданного города.
 		 * False - диалоговое окнго создания нового города.
 		 * @type {Boolean}
 		 */
 		 __isChangeDlg : null,


 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.CitiesPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 * Модель города.
 		 * @type {bus.admin.mvp.model.CityModel}
 		 */
 		 __cityModel : null,

 		/**
 		 * Кнопка сохранения изменений с дальнейшим закрытием окна.
 		 * @type {qx.ui.form.Button}
 		 */
 		 __btnSave : null,

 		/**
 		 * Кнопка закрытия окна без внесения изменений в модель города.
 		 * @type {qx.ui.form.Button}
 		 */
 		 __btnCancel : null,

 		/**
 		 * Checkbox. Если равен True, тогда город будет доступен для пользователей сервиса CityWays. False - не доступен. <br>
 		 * Замечание. Т.к. в новом городе нет по умолчанию маршрутов следования, то город не должен быть доступен пользователям. 
 		 * Поэтому когда диалоговое окно открыто для добавления нового города(т.е. {@link bus.admin.mvp.view.cities.CUCityForm#__isChangeDlg} = False),
 		 * данный Checkbox невидим.
 		 * @type {qx.ui.form.CheckBox}
 		 */
 		 __checkShow : null,

 		/**
 		 * Поле для ввода широты местоположения города. 
 		 * @type {qx.ui.form.TextField}
 		 */
 		 __editLat : null,

 		/**
 		 * Поле для ввода долготы местоположения города. 
 		 * @type {qx.ui.form.TextField}
 		 */
 		 __editLon : null,

 		/**
 		 * Поле для ввода масштаба карты, который будет установлен при выборе данного города. Диапазон целых значений поля: [2, 21]
 		 * @type {qx.ui.form.TextField}
 		 */
 		 __editScale : null,

 		/**
 		 * Таблица для редактирования назания города для разных языков.
 		 * @type {qx.ui.table.Table}
 		 */
 		 __tableNames : null,

 		/**
 		 * Обработчик события нажатия на кнопку btnSave
 		 */
 		 __onClickBtnSave : function() {
			// validation
			for (var i = 0; i < this.__tableNames.getTableModel().getRowCount(); i++) {
				var rowData = this.__tableNames.getTableModel()
				.getRowDataAsMap(i);

				if (rowData.Name==null||rowData.Name.toString().length <= 0) {
					bus.admin.widget.MsgDlg.info(this.tr("Please, push names for all languages"));
					return;
				}
			}

			if (this.__isChangeDlg == true) {
				this.__updateCity();
			} else {
				this.__insertCity();
			}
		},

		/**
		 * Обработчик события нажатия на кнопку btnCancel
		 */
		 __onClickBtnCancel : function() {
		 	this.close();
		 },

		/**
		 * Функция формирует новую модель города с учетом введенных в форму данных и вызывает у презентера триггер updateCityTrigger .
		 */
		 __updateCity : function() {
		 	this.debug("__updateCity check:");
		 	var dataStorage = this.__presenter.getDataStorage();
			// model
			var newCityModel = this.__cityModel.clone();
			newCityModel.setLocation(this.__editLat.getValue(), this.__editLon.getValue());
			newCityModel.setShow(this.__checkShow.getValue());
			newCityModel.setScale(this.__editScale.getValue());
			for (var i = 0; i < this.__tableNames.getTableModel().getRowCount(); i++) {
				var rowData = this.__tableNames.getTableModel()
				.getRowDataAsMap(i);
				var lang = dataStorage.getLangsModel().getLangByName(rowData.Language);
				newCityModel.setName(lang.getId(), rowData.Name);
			}
			
			qx.core.Init.getApplication().setWaitingWindow(true);
			
			var callback = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data.error == true) {
					var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
					this.tr("Error! Can not update city. Please, check input data.");
					bus.admin.widget.MsgDlg.info(msg);
					return;
				}
				this.close();
			}, this);
			console.debug(newCityModel);
			this.__presenter.updateCityTrigger(this.__cityModel, newCityModel, callback, this);

		},

		/**
		 *  Функция формирует новую модель города с учетом введенных в форму данных и вызывает у презентера триггер insertCityTrigger .
		 */
		 __insertCity : function() {
		 	var dataStorage = this.__presenter.getDataStorage();

			// create model
			var newCityModel = this.__cityModel.clone();
			newCityModel.setLocation(this.__editLat.getValue(), this.__editLon.getValue());
			newCityModel.setScale(this.__editScale.getValue());
			for (var i = 0; i < this.__tableNames.getTableModel().getRowCount(); i++) {
				var rowData = this.__tableNames.getTableModel()
				.getRowDataAsMap(i);
				var lang = dataStorage.getLangsModel().getLangByName(rowData.Language);
				newCityModel.setName(lang.getId(), rowData.Name);
			}

			qx.core.Init.getApplication().setWaitingWindow(true);
			var callback = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data.error == true) {
					var msg = data.errorInfo != undefined ? this.tr("Error") + data.errorInfo : 
					this.tr("Error! Can not insert new city. Please, check input data.");
					bus.admin.widget.MsgDlg.info(msg);
					return;
				}
				this.close();
			}, this);
			this.__presenter.insertCityTrigger(newCityModel, callback, this);

		},

		/**
		 * Функция создает все дочерние виджеты и размещает их на форме
		 */
		 __initWidgets : function() {
		 	this.setLayout(new qx.ui.layout.Canvas());

		 	var positionSettings = new qx.ui.groupbox.GroupBox("Position");
		 	positionSettings.setLayout(new qx.ui.layout.Canvas());

		 	var labelLat = new qx.ui.basic.Label("Lat:");
		 	var labelLon = new qx.ui.basic.Label("Lon:");
		 	var labelScale = new qx.ui.basic.Label("Scale(2-21):");

		 	this.__editLat = new qx.ui.form.TextField();
		 	this.__editLon = new qx.ui.form.TextField();

		 	this.__editLat.setWidth(110);
		 	this.__editLon.setWidth(110);

		 	this.__editScale = new qx.ui.form.Spinner();
		 	this.__editScale.set({
		 		maximum : 21,
		 		minimum : 2
		 	});


		 	this.__editScale.setWidth(50);

		 	this.__btnSave = new qx.ui.form.Button("Save",
		 		"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnSave.addListener("execute", this.__onClickBtnSave, this);
		 	this.__btnSave.setWidth(90);

		 	this.__btnCancel = new qx.ui.form.Button("Cancel",
		 		"bus/admin/images/btn/dialog-cancel.png");
		 	this.__btnCancel.addListener("execute", this.__onClickBtnCancel, this);
		 	this.__btnCancel.setWidth(90);

			// names table

			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["Language", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);

			// table
			this.__tableNames = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			this.__tableNames.setBackgroundColor('gray');

			this.__tableNames.setStatusBarVisible(false);
			this.__tableNames.setWidth(300);
			this.__tableNames.setHeight(130);
			this.__tableNames.setColumnWidth(0, 100);
			this.__tableNames.setColumnWidth(1, 180);

			// add to cantainer
			positionSettings.add(labelLat, {
				left : 10,
				top : 10
			});
			positionSettings.add(this.__editLat, {
				left : 40,
				top : 10
			});
			positionSettings.add(labelLon, {
				left : 10,
				top : 50
			});
			positionSettings.add(this.__editLon, {
				left : 40,
				top : 50
			});

			positionSettings.add(labelScale, {
				left : 160,
				top : 10
			});
			positionSettings.add(this.__editScale, {
				left : 240,
				top : 10
			});
			if (this.__isChangeDlg == true) {
				this.__checkShow = new qx.ui.form.CheckBox("Visiable");
				positionSettings.add(this.__checkShow, {
					left : 160,
					top : 50
				});
				
			}
			this.add(positionSettings, {
				left : 0,
				top : -15
			});
			this.add(this.__tableNames, {
				left : 10,
				top : 130
			});

			this.add(this.__btnSave, {
				left : 50,
				top : 265
			});
			this.add(this.__btnCancel, {
				left : 160,
				top : 265
			});

		},

		/**
		 * Задает настройки формы и ее дочерним виджетам. Тажке заполняет виджеты данными.
		 */
		 __setOptions : function() {
		 	this.setHeight(350);
		 	this.setWidth(350);
		 	this.setModal(true);
		 	this.setAllowMaximize(false);
		 	this.setShowMaximize(false);
		 	this.setShowMinimize(false);
		 	this.setResizable(false, false, false, false);
		 	this.center();
		 	if (this.__isChangeDlg == true) {
		 		this.setCaption("Change city");
		 		this.__checkShow.setValue(this.__cityModel.getShow());
		 	} else {

		 		this.setCaption("Insert new city");
		 	}
		 	if(this.__cityModel.getLocation() != undefined){
		 		this.__editLat.setValue(this.__cityModel.getLocation().getLat().toString());
		 		this.__editLon.setValue(this.__cityModel.getLocation().getLon().toString());
		 	}
		 	if(this.__cityModel.getScale() != undefined)
		 	this.__editScale.setValue(this.__cityModel.getScale());

			// fill table
			var langs = this.__presenter.getDataStorage().getLangsModel().getLangs();
			var rowsData = [];
			for (var i = 0; i < langs.length; i++) {
				var cityName = "";
				if (this.__isChangeDlg == true) {
					this.debug("lang: ", langs[i].getId());
					cityName = this.__cityModel.getName(langs[i].getId());
				}
				rowsData.push([langs[i].getName(), cityName]);
			}
			this.__tableNames.getTableModel().setData(rowsData);

		}
	}

});