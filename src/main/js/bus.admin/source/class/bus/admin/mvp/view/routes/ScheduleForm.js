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
 * Диалоговое окно для редактироания расписания маршрута.
 */
 qx.Class.define("bus.admin.mvp.view.routes.ScheduleForm", {
 	extend : qx.ui.window.Window,

	/**
	 * @param  presenter   {bus.admin.mvp.presenter.RoutesPresenter}  Presenter 
	 * @param  routeWay {bus.admin.mvp.model.route.RouteWayModel}   Модель пути
	 */
	 construct : function(presenter, routeWay) {
	 	this.base(arguments);
	 	this.__presenter = presenter;
	 	this._routeWay = routeWay;
	 	var schedule = routeWay.getSchedule();
	 	if(schedule == undefined){
	 		var schedule = new bus.admin.mvp.model.route.ScheduleModel();
	 		schedule.setId(-1);
	 		schedule.setRouteWayID(routeWay.getId());
	 	}
	 	this.__currSchedule = schedule.clone();
	 	this.__daysGroupsDictionary = {};
	 	this.__initWidgets();
	 	this.__setOptions();
	 },
	 destruct : function() {
	 	this.__dispose();
	 },
	 members : {
		/**
 		 * Presenter представления
 		 * @type {bus.admin.mvp.presenter.RoutesPresenter}
 		 */
 		 __presenter : null,

		/**
		 * Модель расписания
		 * @type {bus.admin.mvp.model.route.ScheduleModel}
		 */
		 __currSchedule : null,

		/**
		 * Выбранная группа дней
		 * @type {Integer}
		 */
		 __selectedGroupID : null,

 		/**
 		 * Кнопка добавления поля в расписании.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnAddRow : null,

 		/**
 		 * Кнопка удаления поля в расписании.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnDeleteRow : null,

 		/**
 		 * Кнопка сохранения расписания текущего пути с дальнейшим закрытием диалогового окна.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnSave : null,

 		/**
 		 * Кнопка отмены изменений и закрытия диалогового окна.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnCancel : null,

 		/**
 		 * Кнопка сохранения данного расписания для обоих путей.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnSaveBoth : null,

  		/**
 		 * Кнопка добавления группы дней.
 	     * @type {qx.ui.form.Button}
 	     */		
 	     __btnAddGroup : null,

 	     /**
 	      * Массив радиокнопок выбора группы дней.
 	      * @type {qx.ui.form.RadioGroup}
 	      */
 	      __btnsSelectGroup : null,

 	     /** Словарь виджетов "группы дней"
 	      * key - ID группы, Integer
 	      * value - Список дней, qx.ui.form.List
 	      * @type {Map}
 	      */
 	      __daysGroupsDictionary : null,

 	      /**
 	       * Контайнер групп дней
 	       * @type {qx.ui.groupbox.GroupBox}
 	       */
 	       __daysGroupsWidgetContainer : null,

 	      /**
 	       * Таблица для редактирования расписания (врем первого последнего выезда/ частота выезда)
 	       * @type { qx.ui.table.Table}
 	       */
 	       __timeTable : null,


		/**
		 * Создает дочерние виджеты
		 */
		 __initWidgets : function() {
		 	this.setLayout(new qx.ui.layout.Canvas());
		 	this.__daysGroupsWidgetContainer = new qx.ui.groupbox.GroupBox(this.tr("Groups of days"));
		 	this.__daysGroupsWidgetContainer.setLayout(new qx.ui.layout.Canvas());
		 	this.__daysGroupsWidgetContainer.setWidth(740);
		 	this.add(this.__daysGroupsWidgetContainer, {
		 		left : 0,
		 		top : -10
		 	});

		 	this.__btnsSelectGroup = new qx.ui.form.RadioGroup();

		 	var manageBox = new qx.ui.groupbox.GroupBox("Manage");
		 	manageBox.setLayout(new qx.ui.layout.Canvas());
		 	manageBox.setWidth(220);
		 	this.add(manageBox, {
		 		left : 0,
		 		top : 160
		 	});

		 	this.__btnAddGroup = new qx.ui.form.Button("Add new days group",
		 		"bus/admin/images/btn/go-bottom.png");
		 	this.__btnAddGroup.addListener("click", this.__clickBtnAddGroup,
		 		this);
		 	manageBox.add(this.__btnAddGroup, {
		 		left : 0,
		 		top : 0
		 	});

		 	this.__createTimeTable();

		 	this.__btnSave = new qx.ui.form.Button("Save",
		 		"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnSave.addListener("execute", this.__onClickSave, this);
		 	this.__btnSave.setWidth(90);

		 	this.__btnSaveBoth = new qx.ui.form.Button("Save (both)",
		 		"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnSaveBoth.addListener("execute", this.__onBtnSaveBoth,
		 		this);
		 	this.__btnSaveBoth.setWidth(120);

		 	this.__btnCancel = new qx.ui.form.Button("Cancel",
		 		"bus/admin/images/btn/dialog-cancel.png");
		 	this.__btnCancel.addListener("execute", this.__onClickBtnCancel, this);
		 	this.__btnCancel.setWidth(90);

		 	this.add(this.__btnSave, {
		 		left : 550,
		 		top : 390
		 	});
		 	this.add(this.__btnSaveBoth, {
		 		left : 400,
		 		top : 390
		 	});
		 	this.add(this.__btnCancel, {
		 		left : 660,
		 		top : 390
		 	});

		 	this.__btnAddRow = new qx.ui.form.Button("", "bus/admin/images/btn/list-add.png");
		 	this.__btnAddRow.setWidth(35);
		 	this.__btnAddRow.addListener("click", this.__onClickBtnAddRow, this);
		 	this.add(this.__btnAddRow, {
		 		left : 700,
		 		top : 180
		 	});

		 	this.__btnDeleteRow = new qx.ui.form.Button("",	"bus/admin/images/btn/list-remove.png");
		 	this.__btnDeleteRow.setWidth(35);
		 	this.__btnDeleteRow.addListener("click", this.__onClickBtnDeleteRow, this);
		 	this.add(this.__btnDeleteRow, {
		 		left : 700,
		 		top : 220
		 	});

		 },

		/**
		 * Создает таблицу расписания
		 */
		 __createTimeTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns([this.tr("Time A"), this.tr("Time B"), this.tr("Frequance (minutes)")]);
			tableModel.setColumnEditable(0, true);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);
			tableModel.setColumnSortable(0, false);
			tableModel.setColumnSortable(1, false);
			tableModel.setColumnSortable(2, false);

			// table
			var routesTable = new qx.ui.table.Table(tableModel).set({
				decorator : null
			});
			routesTable.setBackgroundColor('gray');
			routesTable.setStatusBarVisible(false);
			routesTable.setHeight(180);
			routesTable.setWidth(440);
			routesTable.addListener("dataEdited", this.__onChangeTimetable,	this);
			this.__timeTable = routesTable;
			this.add(this.__timeTable, {
				left : 250,
				top : 180
			});

		},

		/**
		 * Создает комбо-список дней.
		 * @param  groupModel {bus.admin.mvp.model.route.ScheduleGroupModel} Расписание группы дней
		 */
		 __createDaysGroup : function(groupModel) {
		 	this.debug("execute __createDaysGroup()");
		 	var combosCount = Object.keys(this.__daysGroupsDictionary).length;
		 	var button = new qx.ui.form.ToggleButton("Group " + (combosCount + 1).toString());
		 	button.setHeight(25);
		 	var source = new qx.ui.form.List;
		 	source.setDraggable(true);
		 	source.setDroppable(true);
		 	source.setSelectionMode("multi");
		 	source.setHeight(100);
		 	source.setWidth(100);
		 	var daysIds = groupModel.getAllDaysIds();

		 	if (daysIds != undefined) {
		 		for (var i = 0; i < daysIds.length; i++) {
		 			var dayName = qx.core.Init.getApplication().getDataStorage().getDayName(daysIds[i]);
		 			var item = new qx.ui.form.ListItem(dayName);
		 			item.setUserData("id", daysIds[i]);
		 			source.add(item);
		 		}
		 	}
		 	this.debug("create source.");
		 	source.addListener("dragstart", this.__onDragstartComboDaysGroup);
		 	source.addListener("droprequest",this.__onDroprequestComboDaysGroup);
		 	source.addListener("drop", this.__onDropComboDaysGroup);
		 	source.addListener("dragover", this.__onDragoverComboDaysGroup);
		 	source.addListener("click", function(e) {
		 		this.__selectDaysGroup(groupModel.getId());
		 	}, this);
		 	button.addListener("click", function(e) {
		 		this.__selectDaysGroup(groupModel.getId());
		 	}, this);
		 	source.setUserData("btn_select", button);
		 	this.__daysGroupsDictionary[groupModel.getId()] = source;
		 	var left = (combosCount) * (source.getWidth() + 5);
		 	this.__daysGroupsWidgetContainer.add(button, { left : left,	top : 0	 });
		 	this.__daysGroupsWidgetContainer.add(source, { left : left,	top : 30 });
		 	this.__btnsSelectGroup.add(button);
		 },

		 /**
		  * Устанавливает опции виджету.
		  * @return {[type]} [description]
		  */
		  __setOptions : function() {
		  	this.debug("execute __setOptions()");
		  	this.setModal(true);
		  	this.setHeight(460);
		  	this.setWidth(790);
		  	this.center();
		  	if(this.__currSchedule.getGroups() == undefined || this.__currSchedule.getGroups().length == 0){
		  		bus.admin.widget.MsgDlg.info(this.tr("The schedule was not initialized before. Please, init it."), this.tr("Info"));
		  		this.__btnCancel.setEnabled(false);
		  		var freq  = 10*60;
		  		var timeA = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds("06:00");
		  		var timeB = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds("23:00");
		  		this.__currSchedule.fromSimple(timeA, timeB, freq);
		  	}	
		  	var groups = this.__currSchedule.getGroups();
		  	this.debug("groups count: ", groups.length);
		  	for (var i = 0; i < groups.length; i++) {
		  		this.__createDaysGroup(groups[i]);
		  	}
		  	this.__selectDaysGroup(this.__currSchedule.getGroups()[0].getId());
		  },

 		/**
 		 * Обработчик нажатия на кнопку добавления новой группы дней.
 		 * @param e {qx.event.type.Event} Объект события.
 		 */		
 		 __clickBtnAddGroup : function(e) {
 		 	var groupsCount = this.__currSchedule.getGroups().length;
 		 	if (groupsCount < 7) {
 		 		var group = new bus.admin.mvp.model.route.ScheduleGroupModel();
 		 		group.setDays([]);
 		 		group.setTimetable([{
 		 			freq  : 10*60,
 		 			timeA : bus.admin.mvp.model.TimeIntervalModel.convertToSeconds("06:00"),
 		 			timeB : bus.admin.mvp.model.TimeIntervalModel.convertToSeconds("23:00")
 		 		}]);
 		 		var newGroup = this.__currSchedule.addGroup(group);
 		 		this.__createDaysGroup(newGroup);
 		 	}
 		 },

 		 /**
 		  * Обработчик начала перемещения дней из одной группы в другую 
 		  * @param e {qx.event.type.Event} Объект события.
 		  */
 		  __onDragstartComboDaysGroup : function(e) {
			// Register supported types
			e.addType("value");
			e.addType("items");

			// Register supported actions
			e.addAction("copy");
			e.addAction("move");
		},

		/**
		 * Обработчик окончания перемещения дней из одной грцппы в другую
		 * @param e {qx.event.type.Event} Объект события.
		 */
		 __onDroprequestComboDaysGroup : function(e) {
		 	var action = e.getCurrentAction();
		 	var type = e.getCurrentType();
		 	var result;
		 	switch (type) {
		 		case "items" :
		 		result = this.getSelection();
		 		if (action == "copy") {
		 			var copy = [];
		 			for (var i = 0, l = result.length; i < l; i++) {
		 				copy[i] = result[i].clone();
		 			}
		 			result = copy;
		 		}
		 		break;
		 		case "value" :
		 		result = this.getSelection()[0].getLabel();
		 		break;
		 	}

			// Remove selected items on move
			if (action == "move") {
				var selection = this.getSelection();
				for (var i = 0, l = selection.length; i < l; i++) {
					this.remove(selection[i]);
				}
			}

			// Add data to manager
			e.addData(type, result);
		},

		/**
		 * Обработчик события "gragover" списка дней
		 * @param e {qx.event.type.Event} Объект события.
		 */
		 __onDragoverComboDaysGroup : function(e) {
		 	if (!e.supportsType("items")) {
		 		e.preventDefault();
		 	}
		 },

		/**
		 * Обработчик удаления элементов из группы
		 * @param e {qx.event.type.Event} Объект события.
		 */
		 __onDropComboDaysGroup : function(e) {
			// Move items from source to target
			var items = e.getData("items");
			for (var i = 0, l = items.length; i < l; i++) {
				this.add(items[i]);
			}

		},

		/**
		 * Заполняет таблицу расписания из модели
		 * @param  timetableModel {Object[]} Модель расписания
		 */
		 __fillTimetableFromModel : function(timetableModel) {
		 	this.debug("execute __fillTimetableFromModel()");
		 	console.debug(timetableModel);
		 	if (timetableModel == undefined)
		 		return;
		 	var rowsData = [];
		 	for (var i = 0; i < timetableModel.length; i++) {
		 		var timeA = bus.admin.mvp.model.TimeIntervalModel.convertSecsToHHMM(timetableModel[i].timeA);
		 		var timeB = bus.admin.mvp.model.TimeIntervalModel.convertSecsToHHMM(timetableModel[i].timeB);
		 		var freq = timetableModel[i].freq / 60;
		 		rowsData.push([timeA, timeB, freq]);
		 		if (i == timetableModel.length - 1) {
		 			rowsData.push([timeB, "", ""]);
		 		}
		 	}
		 	rowsData.push(["", "", ""]);
		 	this.__timeTable.getTableModel().setData(rowsData);
		 },

		/**
		 * Выбирает группу дней и заполняет для нее таблицу расписания
		 * @param  groupID {Integer}      ID группы
		 * @param  {Boolean} isReloadTimetable Обновить таблицу расписания?
		 */
		 __selectDaysGroup : function(groupID, isReloadTimetable){
		 	this.debug("execute __selectDaysGroup()");
		 	if(groupID != this.__selectedGroupID && this.__selectedGroupID != undefined){
		 		var timetableModel = this.__makeModelFromTimetable();
		 		if(timetableModel == null){
		 			this.__selectDaysGroup(this.__selectedGroupID, false);
		 			return;
		 		}
		 		this.__currSchedule.getGroupByID(this.__selectedGroupID).setTimetable(timetableModel);
		 	}
		 	if(groupID != this.__selectedGroupID){
		 		var btnSelectGroup = this.__daysGroupsDictionary[groupID].getUserData("btn_select");
		 		this.__btnsSelectGroup.setSelection([btnSelectGroup]);
		 		if(isReloadTimetable == undefined || isReloadTimetable == true){
		 			this.__fillTimetableFromModel(this.__currSchedule.getGroupByID(groupID).getTimetable());
		 			this.__timeTable.resetCellFocus();
		 			this.__timeTable.resetSelection();				
		 		}
		 		this.__selectedGroupID = groupID;
		 	}
		 },

		/**
		 * Формирует модель расписания из данных таблицы 
		 * @return {Object[]} Модель расписания
		 */
		 __makeModelFromTimetable : function(){
		 	var rowsData = this.__timeTable.getTableModel().getData();
		 	var timetableModel = [];

		 	for (var i = 0; i < rowsData.length; i++) {
		 		if (rowsData[i][0].toString().length == 0 || rowsData[i][1].toString().length == 0)
		 			continue;
		 		if ((bus.admin.mvp.model.TimeIntervalModel.validate(rowsData[i][0]) == false)	
		 			|| (bus.admin.mvp.model.TimeIntervalModel.validate(rowsData[i][1]) == false)) 
		 		{
		 			bus.admin.widget.MsgDlg.warn(this.tr("Input time was wrong."));
		 			return null;
		 		}
		 		if (rowsData[i][2].toString().length == 0) {
		 			bus.admin.widget.MsgDlg.warn(this.tr("Please, fill frequancy"));
		 			return null;
		 		}
		 		timetableModel.push({
		 			timeA : bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(rowsData[i][0]),
		 			timeB : bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(rowsData[i][1]),
		 			freq : 60 * rowsData[i][2]
		 		});
		 	}
		 	return timetableModel;
		 },

		/**
		 * Добавляет пустую строку в таблицу
		 */
		 __addEmptyRowToTimetable : function(){
		 	var rowsData = this.__timeTable.getTableModel().getData();
		 	rowsData.push(["", "", ""]);
		 	this.__timeTable.getTableModel().setData(rowsData);
		 },

		/**
		 * Удаляет строку из таблицы
		 * @param  rowIndex {Integer} Номер строки
		 */
		 __removeRowToTimetable : function(rowIndex){
		 	if (rowIndex < 0)
		 		return;
		 	var rowsData = this.__timeTable.getTableModel().getData();
		 	rowsData.splice(rowIndex, 1);
		 	this.__timeTable.getTableModel().setData(rowsData);
		 },

		/**
		 * Обработчик изменения данных в ячейки в таблице расписания
		 * @param  e {qx.event.type.Data} Данные события.
		 */
		 __onChangeTimetable : function(e) {
		 	var count = this.__timeTable.getTableModel().getRowCount();

		 	var data = e.getData();
		 	if (data.col == 2 || data.value == "")
		 		return;

			// validation
			var value = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(data.value);
			if (bus.admin.mvp.model.TimeIntervalModel.validate(data.value) == false) {
				this.__timeTable.getTableModel().setValue(data.col, data.row, data.oldValue);
				return;
			}

			// add last row
			if (count - 1 == data.row) {
				this.__addEmptyRowToTimetable();
				count++;
			}

			if (data.col == 0) {
				var downVal = -1;
				var rightVal = -1;
				var rightValS = this.__timeTable.getTableModel().getValue(1, data.row);
				rightVal = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(rightValS);
				if (data.row > 0) {
					var downValS = this.__timeTable.getTableModel().getValue(0, data.row - 1);
					downVal = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(downValS);
				}
				// convertTimeToSeconds
				if ((downVal == 0 || value > downVal) && (rightVal == 0 || value < rightVal)) {
					if (data.row > 0) {
						this.__timeTable.getTableModel().setValue(1, data.row - 1, data.value);
					}
				} else {
					this.__timeTable.getTableModel().setValue(data.col, data.row, data.oldValue);
					return;
				}
			}

			// copy value in the left/down cell
			if (data.col == 1) {
				var upValS = this.__timeTable.getTableModel().getValue(1, data.row + 1);
				var leftValS = this.__timeTable.getTableModel().getValue(0, data.row);
				var upVal = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(upValS);
				var leftVal = bus.admin.mvp.model.TimeIntervalModel.convertToSeconds(leftValS);
				if ((upVal == 0 || value < upVal) && (leftVal == 0 || value > leftVal)) {
					this.__timeTable.getTableModel().setValue(0, data.row + 1,	data.value);
				} else {
					this.__timeTable.getTableModel().setValue(data.col,	data.row, data.oldValue);
					return;
				}
			}

		},

		/**
		 * обработчик нажатия кнопки добавления пустой строки в таблицу расписания
		 */
		 __onClickBtnAddRow : function() {
		 	this.__addEmptyRowToTimetable();
		 },

		/**
		 * Обработчик нажатия кнопки удаления выбранной строки в таблице расписания
		 */
		 __onClickBtnDeleteRow : function() {
		 	var rowIndex = this.__timeTable.getSelectionModel().getAnchorSelectionIndex();
		 	if (rowIndex < 0)
		 		return;
		 	this.__removeRowToTimetable(rowIndex);
		 },

		 __refreshDaysInModel : function(){
		 	var lists = this.__daysGroupsDictionary;
		 	for(var groupID in this.__daysGroupsDictionary){
		 		var list = this.__daysGroupsDictionary[groupID];
		 		var children = list.getChildren();
		 		var days = [];
		 		for (var i = 0; i < children.length; i++) {
		 			var dayID = children[i].getUserData("id");
		 			if (dayID != undefined){
		 				days.push(dayID);
		 			}
		 		}
		 		this.__currSchedule.getGroupByID(groupID).setDays(days);
		 	}
		 },

		 __saveSchedule : function(isBoth){
		 	this.__refreshDaysInModel();
			// Сохраним расписание для выбранной группы
			var timetableModel = this.__makeModelFromTimetable();
			if(timetableModel == null){
				this.__selectDaysGroup(this.__selectedGroupID, false);
				return;
			}
			this.__currSchedule.getGroupByID(this.__selectedGroupID).setTimetable(timetableModel);

			qx.core.Init.getApplication().setWaitingWindow(true);
			var callback = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication().setWaitingWindow(false);
				if (data == null || data.error == true) {
					bus.admin.widget.MsgDlg.error(this.tr("Error"), this.tr("The timetable was not saved"));
					return;
				}
				this.close();
			}, this);
			this.__presenter.updateScheduleTrigger(this.__currSchedule, isBoth, callback, this);
		},

		/**
		 * Обработчик нажатия кнопки сохранения расписания
		 */
		 __onClickSave : function() {
		 	this.__saveSchedule(false);
		 },

		/**
		 * Обработчик нажатия кнопки сохранения отредактированного расписания для двух направлений
		 */
		 __onBtnSaveBoth : function() {
		 	this.__saveSchedule(true);
		 },

		/**
		 * Обработчик нажатия кнопки  закрытия диалогового окна без сохранения изменений
		 */
		 __onClickBtnCancel : function() {
		 	this.close();
		 }

		}

	});