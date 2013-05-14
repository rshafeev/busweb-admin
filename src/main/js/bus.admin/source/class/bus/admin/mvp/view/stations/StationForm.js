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
 * Диалоговое окно для создания/ редактироания станции.
 */
 qx.Class.define("bus.admin.mvp.view.stations.StationForm", {
 	extend : qx.ui.window.Window,

 	/**
 	 * @param  stationModel   {bus.admin.mvp.model.StationModelEx}     Модель станции.
 	 * @param  langsModel {bus.admin.mvp.model.LanguagesModel} Список языков.
 	 * @param  cityModel {bus.admin.mvp.model.CityModel} Город, к которому относится редактируемая/создаваемая станция
 	 * @param  isChangeDlg {Boolean}  Тип окна. True - диалоговое окно для редактирования ранее созданной станции. False - диалоговое окнго создания новой станции.
 	 */
 	 construct : function(stationModel, langsModel, cityModel, isChangeDlg) {
 	 	this.base(arguments);
 	 	this._stationModel = stationModel;
 	 	this._langsModel = langsModel;
 	 	this._cityModel = cityModel;
 	 	this._isChangeDlg = isChangeDlg;
 	 	this.__initWidgets();
 	 	this.__setOptions();
 	 },

 	 events : {

	   /**
 		  * Событие наступает после нажатии на кнопку "Save" или "Cancel". 
 		  * <br><br>Свойства возвращаемого объекта: <br> 		 
 		  * <pre>
 		  * <ul>
 		  * <li> station         Модель станции,  {@link bus.admin.mvp.model.StationModel StationModel}. </li>
 		  * <li> cancel          Пользователь нажал на кнопку Cancel, Boolean. </li>
 		  * <ul> 
 		  * </pre>
 		  */
 		  "prepared_model"     : "qx.event.type.Data"
 		},

 	/**
 	 * Методы класса
 	 */
 	 members : {
 	 	/**
 	 	 * Город, к которому относится редактируемая/создаваемая станция
 	 	 * @type {bus.admin.mvp.model.CityModel}
 	 	 */
 	 	_cityModel : null,

 		/**
 		 * Список языков.
 		 * @type {bus.admin.mvp.model.LanguagesModel}
 		 */
 		 _langsModel : null,

 		/**
 		 * Тип окна. True - диалоговое окно для редактирования ранее созданной остановки.
 		 * False - диалоговое окно создания новой остановки.
 		 * @type {Boolean}
 		 */
 		 _isChangeDlg : false,


 		/**
 		 * Модель станции.
 		 * @type {bus.admin.mvp.model.StationModelEx}
 		 */
 		 _stationModel : null,

 		/**
 		 * Кнопка сохранения изменений с дальнейшим закрытием окна.
 		 * @type {qx.ui.form.Button}
 		 */
 		 _btnSave : null,

 		/**
 		 * Кнопка закрытия окна без внесения изменений в модель остановки.
 		 * @type {qx.ui.form.Button}
 		 */
 		 _btnCancel : null,

 		/**
 		 * Поле для ввода широты местоположения остановки. 
 		 * @type {qx.ui.form.TextField}
 		 */
 		 _editLat : null,

 		/**
 		 * Поле для ввода долготы местоположения остановки. 
 		 * @type {qx.ui.form.TextField}
 		 */		
 		 _editLon : null,

 		/**
 		 * Таблица для редактирования назания станции для разных языков.
 		 * @type {qx.ui.table.Table}
 		 */
 		 _tableNames : null,

 		/**
 		 * Обработчик события нажатия на кнопку btnSave
 		 */
 		 __onClickBtnSave : function() {
			// validation
			for (var i = 0; i < this._tableNames.getTableModel().getRowCount(); i++) {
				var rowData = this._tableNames.getTableModel()
				.getRowDataAsMap(i);

				if (rowData.Name == null || rowData.Name.toString().length <= 0) {
					bus.admin.widget.MsgDlg.info(this.tr("Please, push names for all languages"));
					return;
				}
			}
			var newStationModel = this._stationModel.clone();
			newStationModel.setLocation(this.__editLat.getValue(), this._editLon.getValue());

			for (var i = 0; i < this._tableNames.getTableModel().getRowCount(); i++) {
				var rowData = this._tableNames.getTableModel().getRowDataAsMap(i);
				var lang = this._langsModel.getLangByName(rowData.Language);
				newStationModel.setName(lang.getId(), rowData.Name);
			}
			var args = {
				station : newStationModel,
				cancel : false
			};
			this.fireDataEvent("prepared_model", args);

		},

		/**
		 * Обработчик события нажатия на кнопку btnCancel
		 */
		 __onClickBtnCancel : function() {
		 	var args = {
		 		station : null,
		 		cancel : true
		 	};
		 	this.fireDataEvent("prepared_model", args);
		 },

		/**
		 * Функция создает все дочерние виджеты и размещает их на форме
		 */		
		 __initWidgets : function() {
		 	var cityName = this._cityModel.getName(bus.admin.AppProperties.getLocale());

		 	this.setLayout(new qx.ui.layout.Canvas());

		 	var positionSettings = new qx.ui.groupbox.GroupBox(this.tr("Location:"));
		 	positionSettings.setLayout(new qx.ui.layout.Canvas());

		 	var labelCity = new qx.ui.basic.Label(this.tr("City:"));
		 	var labelCityName = new qx.ui.basic.Label(cityName);
		 	var labelLat = new qx.ui.basic.Label(this.tr("Lat:"));
		 	var labelLon = new qx.ui.basic.Label(this.tr("Lon:"));

		 	this.__editLat = new qx.ui.form.TextField();
		 	this.__editLat.setWidth(110);
		 	this._editLon = new qx.ui.form.TextField();
		 	this._editLon.setWidth(110);

		 	this._btnSave = new qx.ui.form.Button(this.tr("Save"), "bus/admin/images/btn/dialog-apply.png");
		 	this._btnSave.addListener("execute", this.__onClickBtnSave, this);
		 	this._btnSave.setWidth(90);

		 	this._btnCancel = new qx.ui.form.Button(this.tr("Cancel"), "bus/admin/images/btn/dialog-cancel.png");
		 	this._btnCancel.addListener("execute", this.__onClickBtnCancel, this);
		 	this._btnCancel.setWidth(90);

			// names table

			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["Language", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);

			// table
			this._tableNames = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			this._tableNames.setBackgroundColor('gray');

			this._tableNames.setStatusBarVisible(false);
			this._tableNames.setWidth(300);
			this._tableNames.setHeight(120);
			this._tableNames.setColumnWidth(0, 100);
			this._tableNames.setColumnWidth(1, 180);

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
			positionSettings.add(this._editLon, {
				left : 40,
				top : 50
			});

			this.add(labelCity, {
				left : 10,
				top : 120
			});
			this.add(labelCityName, {
				left : 40,
				top : 120
			});
			this.add(positionSettings, {
				left : 0,
				top : -15
			});
			this.add(this._tableNames, {
				left : 10,
				top : 140
			});

			this.add(this._btnSave, {
				left : 50,
				top : 265
			});
			this.add(this._btnCancel, {
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
		 	var station = this._stationModel;
		 	if (this._isChangeDlg) {
		 		this.setCaption(this.tr("Change station"));
		 	} else {

		 		this.setCaption(this.tr("Insert new station"));
		 	}

		 	this.__editLat.setValue(station.getLocation().getLat().toString());
		 	this._editLon.setValue(station.getLocation().getLon().toString());

			// fill table
			var langs = this._langsModel.getLangs();
			var rowsData = [];
			for (var i = 0; i < langs.length; i++) {
				var stationName = "";
				if (this._isChangeDlg == true) {
					this.debug("lang: ", langs[i].getId());
					stationName = station.getName(langs[i].getId());
				}
				rowsData.push([langs[i].getName(), stationName]);
			}
			this._tableNames.getTableModel().setData(rowsData);

		}
	}

});