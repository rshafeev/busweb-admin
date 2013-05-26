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
 * @ignore(FileReader)
 */


/**
 * Окно для импортироавния маршрутов с файла.
 */
 qx.Class.define("bus.admin.mvp.view.routes.ImportRouteForm", {
 	extend : qx.ui.window.Window,

	/**
	 * @param  presenter {bus.admin.mvp.presenter.RoutesPresenter}  Презентер страницы Routes
	 * @param  routeType {String}  Тип маршрута
	 * @param  cityModel {bus.admin.mvp.model.CityModel}  Город.
	 */
	 construct : function(presenter, routeType, cityModel) {
	 	this.base(arguments);
	 	this.__presenter = presenter;
	 	this.__cityModel = cityModel;
	 	this.__routeType = routeType;
	 	this.__initWidgets();
	 	this.__setOptions();

	 },

	 /**
	  * Деструктор
	  */
	 destruct : function() {
	 	this.debug("destruct()");
		this.__presenter = null;
		this.__cityModel = null;
		this.__routeType = null;
		this.dispose();
	},

	members : {
 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

		/**
		 * Тип импортированных маршрутов
		 * @type {String}
		 */
		 __routeType : null,

		/**
		 * Город, в который пользователь сможет импортировать маршруты
		 * @type {bus.admin.mvp.model.CityModel}
		 */
		 __cityModel : null,

 		/**
 		 * Кнопка для импортирования маршрута из json объекта.
 		 * @type {qx.ui.form.Button}
 		 */
 		 __btnInsert : null,

 		/**
 		 * Кнопка закрытия диалогового окна
 		 * @type {qx.ui.form.Button}
 		 */
 		 __btnCancel : null,

 		/**
 		 * Кнопка удаления json объекта из БД
 		 * @type {qx.ui.form.Button}
 		 */
 		 __btnDelete : null,

 		 /**
 		  * Поле для фильтрации 
 		  * @type {qx.ui.form.TextField}
 		  */
 		  __filterField : null,

 		 /**
 		  * Таблицы ранее импортированных маршрутов, хранящихся в БД
 		  * @type {qx.ui.table.Table}
 		  */
 		  __tableJsonRoutes : null,


 		  /**
 		   * Диалоговое окно загрузки файла json маршрута из файла
 		   * @type {bus.admin.widget.UploadDialog}
 		   */
 		  __uploadDlg : null,

		/**
		 * Создает дочерние виджеты и размещает их в диалоге
		 */
		 __initWidgets : function() {
		 	this.setLayout(new qx.ui.layout.Canvas());
		 	var langID = qx.core.Init.getApplication().getDataStorage().getLocale();
		 	var routeTypeName = qx.core.Init.getApplication().getDataStorage().getRouteTypeNameByID(this.__routeType);
		 	var cityNameLabel = new qx.ui.basic.Label(this.tr("City:"));
		 	var cityLabel = new qx.ui.basic.Label(this.__cityModel.getName(langID));
		 	var routeTypeLabel = new qx.ui.basic.Label(this.tr("Transport type:"));
		 	var typeLabel = new qx.ui.basic.Label(routeTypeName);

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

		 	var filterLabel = new qx.ui.basic.Label(this.tr("Filter:"));
		 	this.__filterField = new qx.ui.form.TextField();
			this.__filterField.addListener("changeValue", this.__onChangeFilterField, this);
		 	this.add(filterLabel, { left : 10, top : 150 });
		 	this.add(this.__filterField, { left : 70, top : 150 });

		 	this.__btnInsert = new qx.ui.form.Button(this.tr("Insert"),	"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnInsert.setWidth(90);
		 	this.add(this.__btnInsert, {
		 		left : 70,
		 		top : 365
		 	});

		 	this.__btnCancel = new qx.ui.form.Button(this.tr("Cancel"), "bus/admin/images/btn/dialog-cancel.png");
		 	this.__btnCancel.setWidth(90);
		 	this.add(this.__btnCancel, {
		 		left : 180,
		 		top : 365
		 	});

		 	this.__btnDelete = new qx.ui.form.Button(this.tr("Delete"), "bus/admin/images/btn/edit-delete.png");
		 	this.__btnDelete.setWidth(90);
		 	this.add(this.__btnDelete, {
		 		left : 270,
		 		top : 200
		 	});

		 	var tableModel = new qx.ui.table.model.Filtered();
		 	tableModel.setColumns(["ID", "Number"]);
		 	tableModel.setColumnEditable(0, false);
		 	tableModel.setColumnEditable(1, false);
		 	this.__tableJsonRoutes = new qx.ui.table.Table(tableModel).set({
		 		decorator : null
		 	});
		 	this.__tableJsonRoutes.setBackgroundColor('gray');
		 	this.__tableJsonRoutes.setStatusBarVisible(false);
		 	this.__tableJsonRoutes.setWidth(260);
		 	this.__tableJsonRoutes.setHeight(160);
		 	this.__tableJsonRoutes.setColumnWidth(0, 80);
		 	this.__tableJsonRoutes.setColumnWidth(1, 140);
		 	this.add(this.__tableJsonRoutes, {
		 		left : 10,
		 		top : 200
		 	});



		 	var mainSettings = new qx.ui.groupbox.GroupBox(this.tr("Import from file:"));
		 	mainSettings.setLayout(new qx.ui.layout.Canvas());
		 	mainSettings.setWidth(300);
		 	mainSettings.setHeight(120);

		 	this.__uploadDlg = new bus.admin.widget.UploadDialog();
		 	this.__uploadDlg.setWidth(300);
		 	var buttonSend = new qx.ui.form.Button("Send");
		 	buttonSend.addListener("execute", this.__onClickBtnSend, this);
		 	mainSettings.add(this.__uploadDlg, {
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



		 },

		/**
		 * Задает основные параметры виджетам
		 */
		 __setOptions : function() {
		 	this.setHeight(460);
		 	this.setWidth(410);
		 	this.setCaption(this.tr("Import Dialog"));
		 	this.setModal(true);
		 	this.setAllowMaximize(false);
		 	this.setShowMaximize(false);
		 	this.setShowMinimize(false);
		 	this.setResizable(false, false, false, false);
		 	this.center();
			
		},

		/**
		 * Обработчик ввода строки в поле фильтрации маршрутов по номеру
		 */
		 __onChangeFilterField : function() {
		 	var fieldValue = this.__filterField.getValue();
		 	var model = this.__tableJsonRoutes.getTableModel();
		 	if (fieldValue.length > 0) {
		 		model.resetHiddenRows();
		 		model.addNotRegex(fieldValue, "Number", true);
		 		model.applyFilters();
		 	} else {
		 		model.resetHiddenRows();
		 	}
		 },

		 /**
		  * Обработчик срабатывает при появлении окна
		  */
		 __onAppear : function() {
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

		 /**
		  * Обработчик нажатия на кнопку "Send"
		  */
		 __onClickBtnSend : function() {
		 	var files = this.__uploadDlg.getFiles();
		 	if (files == null || files == undefined)
		 		return;
		 	if (files.length == 0)
		 		return;
		 	var reader = new FileReader();

			reader.onloadend = function(evt) {
				if (evt.target.readyState == FileReader.DONE) {
					this.debug(evt.target.result);
				}
			};
			reader.readAsText(files[0]);
		}

}
});
