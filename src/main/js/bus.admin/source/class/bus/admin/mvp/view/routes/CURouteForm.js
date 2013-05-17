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
 #asset(bus/admin/images/*)
 */

/**
 * Диалоговое окно для создания/ редактироания маршрута.
 */
 qx.Class.define("bus.admin.mvp.view.routes.CURouteForm", {
 	extend : qx.ui.window.Window,

 	/**
 	 * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter   
 	 * @param  isChangeDlg {Boolean}  Тип окна. True - диалоговое окно для редактирования ранее созданного маршрута. False - диалоговое окнго создания нового маршрута.
 	 * @param  routeModel  {bus.admin.mvp.model.RouteModel}     Модель маршрута.
 	 */
 	 construct : function(presenter, isChangeDlg, routeModel) {
 	 	this.base(arguments);
 	 	this.__routeModel = routeModel.clone();
 	 	this.__routeModel.setDirectWay(null);
 	 	this.__routeModel.setReverseWay(null);
 	 	this.__isChangeDlg = isChangeDlg;
 	 	this.__presenter = presenter;
 	 	this.__initWidgets();
 	 	this.__setOptions();

 	 },

 	 members : {

 		/**
 		 * Тип окна. True - диалоговое окно для редактирования ранее созданной остановки.
 		 * False - диалоговое окно создания новой остановки.
 		 * @type {Boolean}
 		 */
 		 __isChangeDlg : false,

 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 * Модель станции.
 		 * @type {bus.admin.mvp.model.RouteModel}
 		 */
 		 __routeModel : null,

 		 /**
 		  * Использовать транслит.
 		  * @type {qx.ui.form.CheckBox}
 		  */
 		  __ckeckTranslit : null,


 		  __editNumber : null,

 		  __btnSave : null,
 		  __btnCancel : null,
 		  __checkSameWays : null,

 		  editCost : null,
 		  editTimeA : null,
 		  editTimeB : null,
 		  editFrequency : null,
 		  __tableNumbers : null,


 		  /**
 		   * Создает таблицу для редактирования номера маршрута.
 		   * @return {qx.ui.table.Table} Виджет-таблица
 		   */
 		   __createTableNumbers : function(){
			// names table

			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Language", "Number"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, true);
			tableModel.setColumnSortable(0, false);
			tableModel.setColumnSortable(1, false);
			tableModel.setColumnSortable(2, false);

			// table
			var table = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			table.setBackgroundColor('gray');
			table.setColumnVisibilityButtonVisible(false);
			table.setStatusBarVisible(false);
			table.setWidth(250);
			table.setHeight(100);
			table.setColumnWidth(0, 0);
			table.setColumnWidth(1, 90);
			table.setColumnWidth(2, 140);
			table.getTableColumnModel().setColumnVisible(0,false);
			return table;
		},

		/**
 		 * Обработчик изменения значения флажка трансирования номера маршрута.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */
 		 __onCkeckTranslit : function(e){
 		 	if(this.__ckeckTranslit.getValue() == true){
 		 		this.__editNumber.setEnabled(true);
 		 		this.__tableNumbers.setEnabled(false);
 		 	}else
 		 	{
 		 		this.__editNumber.setEnabled(false);
 		 		this.__tableNumbers.setEnabled(true);
 		 	}
 		 },


 		 __onChangedEditNumber : function(e){
 		 	var numb = this.__editNumber.getValue();

 		 	var rowsData = this.__tableNumbers.getTableModel().getData();

 		 	for (var i = 0; i < rowsData.length; i++) {
 		 		var langID = rowsData[i][0];
 		 		var number = bus.admin.helpers.LanguageHelper.translitToLang(numb, langID);
 		 		this.__tableNumbers.getTableModel().setValue(2, i, number);
 		 	}


 		 },

 		/**
 		 * Создает дочерние виджеты
 		 */
 		 __initWidgets : function() {
 		 	this.setLayout(new qx.ui.layout.Canvas());

 		 	var mainSettings = new qx.ui.groupbox.GroupBox(this.tr("Main info"));
 		 	mainSettings.setLayout(new qx.ui.layout.Canvas());


 		 	this.__ckeckTranslit = new qx.ui.form.CheckBox(this.tr("Translit"));
 		 	this.__ckeckTranslit.addListener("changeValue", this.__onCkeckTranslit, this);
 		 	mainSettings.add(this.__ckeckTranslit, { left : 5, top : 0 });

 		 	this.__editNumber = new qx.ui.form.TextField("");
 		 	this.__editNumber.setWidth(110);
 		 	this.__editNumber.addListener("keyup", this.__onChangedEditNumber, this);
 		 	mainSettings.add(this.__editNumber, { left : 80, top : 0 });

 		 	this.__tableNumbers = this.__createTableNumbers();
 		 	mainSettings.add(this.__tableNumbers, {	left : 10,	top : 40});


 		 	var labelCost = new qx.ui.basic.Label(this.tr("Cost:"));
 		 	this.editCost = new qx.ui.form.TextField("2.50");
 		 	this.editCost.setWidth(80);
 		 	mainSettings.add(labelCost, { left : 10,	top : 150 });
 		 	mainSettings.add(this.editCost, { left : 70, top : 150 });

 		 	this.__btnSave = new qx.ui.form.Button(this.tr("Save"),
 		 		"bus/admin/images/btn/dialog-apply.png");
 		 	this.__btnSave.addListener("execute", this.__onClickSave, this);
 		 	this.__btnSave.setWidth(90);

 		 	this.__btnCancel = new qx.ui.form.Button(this.tr("Cancel"),
 		 		"bus/admin/images/btn/dialog-cancel.png");
 		 	this.__btnCancel.addListener("execute", this.__onClickCancel, this);
 		 	this.__btnCancel.setWidth(90);



 		 	if (this.__isChangeDlg == false) {
 		 		var timeSettings = new qx.ui.groupbox.GroupBox("Timetable");
 		 		timeSettings.setLayout(new qx.ui.layout.Canvas());
 		 		var labelTimeA = new qx.ui.basic.Label("Time(start):");
 		 		this.editTimeA = new qx.ui.form.TextField("06:00");
 		 		this.editTimeA.setWidth(80);

 		 		var labelTimeB = new qx.ui.basic.Label("Time(finish):");
 		 		this.editTimeB = new qx.ui.form.TextField("22:00");
 		 		this.editTimeB.setWidth(80);

 		 		var labelTimeB = new qx.ui.basic.Label("Time(finish):");
 		 		this.editTimeB = new qx.ui.form.TextField("22:00");
 		 		this.editTimeB.setWidth(80);

 		 		var labelFreq = new qx.ui.basic.Label("Frequency(min):");
 		 		this.editFrequency = new qx.ui.form.TextField("15");
 		 		this.editFrequency.setWidth(80);

				// bus.admin.helpers.ObjectHelper.validateTime
				timeSettings.add(labelTimeA, {
					left : 10,
					top : 10
				});
				timeSettings.add(this.editTimeA, {
					left : 110,
					top : 10
				});
				timeSettings.add(labelTimeB, {
					left : 10,
					top : 50
				});
				timeSettings.add(this.editTimeB, {
					left : 110,
					top : 50
				});

				timeSettings.add(labelFreq, {
					left : 10,
					top : 90
				});
				timeSettings.add(this.editFrequency, {
					left : 110,
					top : 90
				});
				this.__checkSameWays = new qx.ui.form.CheckBox("Same ways");
				this.__checkSameWays.setValue(false);

				
				this.add(timeSettings, {
					left : 280,
					top : -10
				});
				
				this.add(this.__checkSameWays, {
					left : 300,
					top : 170
				});

			}
			// add to cantainer


			this.add(mainSettings, {
				left : 0,
				top : -10
			});


			this.add(this.__btnSave, {
				left : 110,
				top : 230
			});
			this.add(this.__btnCancel, {
				left : 220,
				top : 230
			});

		},

		/**
		 * Установка опций формы и дочерних виджетов
		 */
		 __setOptions : function() {
		 	this.setHeight(330);
		 	if (this.__isChangeDlg == true) {
		 		this.setWidth(350);
		 		this.setCaption("Change route");
		 		this.editCost.setValue(this.__routeModel.getCost().toString());
		 	} else {
		 		this.setWidth(550);
		 		this.setCaption("Insert new route");
		 	}

		 	this.setModal(true);
		 	this.setAllowMaximize(false);
		 	this.setShowMaximize(false);
		 	this.setShowMinimize(false);
		 	this.setResizable(false, false, false, false);
		 	this.center();

		 	this.__ckeckTranslit.setValue(true);
		 	

			// fill table
			var langs  = qx.core.Init.getApplication().getDataStorage().getSupportedLocales();
			var rowsData = [];
			for (var i = 0; i < langs.length; i++) {
				var langID = langs[i].getId();
				var number = this.__routeModel.getNumber(langID);
				rowsData.push([langID, langs[i].getName(), number]);
			}
			this.__tableNumbers.getTableModel().setData(rowsData);

		},

		/**
		 * Обработчик события нажатия на кнопку сохранения маршрута с дальнейшим закрытием диалогового окна.
		 */
		 __onClickSave : function() {
		 	var cost = cost = parseFloat(this.editCost.getValue());
		 	if (isNaN(cost)) {
		 		bus.admin.widget.MsgDlg.info(this.tr("The cost must be a number"));
		 		return;
		 	}
		 	this.__routeModel.setCost(cost);
		 	var rowsData = this.__tableNumbers.getTableModel().getData();
		 	for (var i = 0; i < rowsData.length; i++) {
		 		var langID = rowsData[i][0];
		 		var numb = rowsData[i][2];
		 		if (numb == null|| numb.toString().length <= 0) {
		 			bus.admin.widget.MsgDlg.info(this.tr("Error"), this.tr("Please, push number for all languages"));
		 			return;
		 		}
		 		this.__routeModel.setNumber(langID, numb);
		 	}

		 	if(this.__isChangeDlg == true){
		 		this.__saveIntoEditRouteMode();
		 		return;
		 	}
		 	this.__saveIntoNewRouteMode();
		 },


		/**
		 * Обработчик события нажатия на кнопку закрытия диалогового окна.
		 */
		 __onClickCancel : function() {
		 	this.close();
		 },


		 /**
		  * Оповещает presenter о необходимости обновить маршрут.
		  */
		  __saveIntoEditRouteMode : function(){
		  	var self = this;
		  	qx.core.Init.getApplication().setWaitingWindow(true);
		  	var callback = function(args){
		  		qx.core.Init.getApplication().setWaitingWindow(false);
		  		if(args.error == true){
		  			bus.admin.widget.MsgDlg.error(this.tr("Error"), this.tr("Can not update route. Please, check input data and try again."));
		  			return;
		  		}
		  		self.close();
		  	}
		  	this.__presenter.updateRouteTrigger(this.__routeModel, callback);
		  },

		 /**
		  * Сохраняет введенные пользователем данные в модель и оповещает presenter о создании нового маршрута
		  */
		  __saveIntoNewRouteMode : function(){
		  	var schedule = null;

		  	// Валидация номера маршрута
		  	var routesList = this.__presenter.getDataStorage().getRoutesListModel();
		  	var numbers  = this.__routeModel.getNumbers();
		  	for(var i=0;i < numbers.length; i++){
		  		var numb = numbers[i].value;
		  		if (routesList.isNumberExists(numb) == true){
		  			bus.admin.widget.MsgDlg.info(this.tr("Error"), this.tr("The route with this number has already exist!"));
		  			return;
		  		}
		  	}
		  	var timeAvalue = this.editTimeA.getValue();
		  	var timeBvalue = this.editTimeB.getValue();
		  	var freqValue = this.editFrequency.getValue();
		  	var schedule = this.__makeScheduleModel(timeAvalue, timeBvalue,	freqValue);
		  	if (schedule == null) {
		  		bus.admin.widget.MsgDlg.info(this.tr("Error"), this.tr("Please, set valid time and frequency"));
		  		return;
		  	}

		  	var sameWays = this.__checkSameWays.getValue();
		  	var directWay = new bus.admin.mvp.model.route.RouteWayModel();
		  	var reverseWay = null;
		  	directWay.setSchedule(schedule);
		  	if(sameWays == false){
		  		reverseWay = new bus.admin.mvp.model.route.RouteWayModel();
		  		reverseWay.setSchedule(schedule.clone());
		  	}
		  	this.__routeModel.setDirectWay(directWay);
		  	this.__routeModel.setReverseWay(reverseWay);

		  	var self = this;
		  	var callback = function(args){
		  		if(args.error == true){
		  			bus.admin.widget.MsgDlg.error(this.tr("Error"), this.tr("Can not insert route. Please, check input data and try again."));
		  			return;
		  		}
		  		self.close();
		  	}
		  	this.__presenter.startingMakeRouteTrigger(this.__routeModel, callback);
		  },


		  /**
		   * Создает модель расписания
		   * @param  timeValueA {String}  Время начала работы по текущему маршруту. Формат чч:мм
		   * @param  timeValueB {String}  Время окончания работы по текущему маршруту. Формат чч:мм
		   * @param  frequency  {String}  Интервал движения транспортных средств. Формат мм
		   * @return {bus.admin.mvp.model.route.ScheduleModel|null} Расписание маршрута
		   */
		  __makeScheduleModel : function(timeValueA, timeValueB, frequency) {
		  	// Валидация данных
		  	if (bus.admin.mvp.model.TimeIntervalModel.validate(timeValueA) == false
		  		|| bus.admin.mvp.model.TimeIntervalModel.validate(timeValueB) == false
		  		|| frequency.toString() != parseInt(frequency).toString()) {
		  		return null;
		  }
		  var secsA = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(timeValueA);
		  var secsB = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(timeValueB);
		  var frequencySecs = 60 * frequency;
		  if (frequencySecs < 0 || secsB < 0 || secsB < secsA) {
		  	return null;
		  }
		  var schedule = new bus.admin.mvp.model.route.ScheduleModel();
		  schedule.fromSimple(secsA, secsB, frequencySecs);
		  return schedule;
		},


		//==============================================================================================================
		//
		//


		__updateRoute : function(number, cost) {
			// model
			var route = bus.admin.helpers.ObjectHelper.clone(this.__routeModel);
			route.number = number;
			route.cost = cost;
			route.name = [];
			if (this.check_names.getValue() == true) {

				for (var i = 0; i < this.__tableNumbers.getTableModel()
					.getRowCount(); i++) {
					var rowData = this.__tableNumbers.getTableModel()
				.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
				.getModelsContainer();
				var lang = modelsContainer.getLangsModel()
				.getLangByName(rowData.Language);
				route.name.push({
					lang_id : lang.id,
					value : rowData.Name
				});
			}
		}
			// execute presenter event
			var updateData = {
				route : route,
				opts : {
					isUpdateSchedule : false,
					isUpdateMainInfo : true,
					isUpdateRouteRelations : false
				}
			};

			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data == null || data.error == true) {
					alert(this.tr("Error! Can not changed this route."));
					return;
				}
				this.close();
			}, this);
			this._routesPresenter.updateRoute(updateData, event_finish_func);

		},

		__insertRoute : function(number, cost, schedule, sameDirections) {

			// create model
			this.__routeModel.number = number;
			this.__routeModel.cost = cost;
			this.__routeModel.name = [];
			if (sameDirections == false) {
				this.__routeModel.directRouteWay = {
					schedule : schedule
				};

				this.__routeModel.reverseRouteWay = {
					schedule : bus.admin.helpers.ObjectHelper.clone(schedule)
				};
			} else {
				this.__routeModel.directRouteWay = {
					schedule : schedule
				};
				this.__routeModel.reverseRouteWay = null;
			}
			if (this.check_names.getValue() == true) {

				for (var i = 0; i < this.__tableNumbers.getTableModel()
					.getRowCount(); i++) {
					var rowData = this.__tableNumbers.getTableModel()
				.getRowDataAsMap(i);
				var modelsContainer = qx.core.Init.getApplication()
				.getModelsContainer();
				var lang = modelsContainer.getLangsModel()
				.getLangByName(rowData.Language);
				this.__routeModel.name.push({
					lang_id : lang.id,
					value : rowData.Name
				});
			}
		}
		var event_finish_func = qx.lang.Function.bind(function(data) {
			this.close();
		}, this);
		this._routesPresenter.startCreateNewRoute(this.__routeModel, "new",
			event_finish_func);
	},

	on_check_names : function(e) {
		var checked = this.check_names.getValue();
		if (checked == true) {
			this.__tableNumbers.setEnabled(true);
		} else {
			this.__tableNumbers.setEnabled(false);
		}

	}



}

});