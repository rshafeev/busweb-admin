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
		this.__currSchedule = routeWay.getSchedule().clone();
		this._dayGroupWidgets = [];
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
 


 	     _day_btn_group : null,
 	     _daysBoxWidget : null,
 	     _dayGroupWidgets : null,
 	     _timeTable : null,


		/**
		 * Создает дочерние виджеты
		 */
		 __initWidgets : function() {
		 	this.setLayout(new qx.ui.layout.Canvas());
		 	this._daysBoxWidget = new qx.ui.groupbox.GroupBox("Groups of days");
		 	this._daysBoxWidget.setLayout(new qx.ui.layout.Canvas());
		 	this._daysBoxWidget.setWidth(740);
		 	this.add(this._daysBoxWidget, {
		 		left : 0,
		 		top : -10
		 	});

		 	this._day_btn_group = new qx.ui.form.RadioGroup();

		 	var groups = this.__currSchedule.getGroups();
		 	this.debug("groups count: ", groups.length);
		 	for (var i = 0; i < groups.length; i++) {
		 		this.__createComboDays(groups[i]);
		 	}


		 	var manage_box = new qx.ui.groupbox.GroupBox("Manage");
		 	manage_box.setLayout(new qx.ui.layout.Canvas());
		 	manage_box.setWidth(220);
		 	this.add(manage_box, {
		 		left : 0,
		 		top : 160
		 	});

		 	this.__btnAddGroup = new qx.ui.form.Button("Add new days group",
		 		"bus/admin/images/btn/go-bottom.png");
		 	manage_box.add(this.__btnAddGroup, {
		 		left : 0,
		 		top : 0
		 	});

		 	this.__createTimeTable();

		 	this.__btnSave = new qx.ui.form.Button("Save",
		 		"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnSave.addListener("execute", this.on_save_click, this);
		 	this.__btnSave.setWidth(90);

		 	this.__btnSaveBoth = new qx.ui.form.Button("Save (both)",
		 		"bus/admin/images/btn/dialog-apply.png");
		 	this.__btnSaveBoth.addListener("execute", this.on_saveBoth_click,
		 		this);
		 	this.__btnSaveBoth.setWidth(120);

		 	this.__btnCancel = new qx.ui.form.Button("Cancel",
		 		"bus/admin/images/btn/dialog-cancel.png");
		 	this.__btnCancel.addListener("execute", this.on_cancel_click, this);
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

		 	this.__btnAddRow = new qx.ui.form.Button("",
		 		"bus/admin/images/btn/list-add.png");
		 	this.__btnDeleteRow = new qx.ui.form.Button("",
		 		"bus/admin/images/btn/list-remove.png");
		 	this.__btnAddRow.setWidth(35);
		 	this.__btnDeleteRow.setWidth(35);
		 	this.add(this.__btnAddRow, {
		 		left : 700,
		 		top : 180
		 	});
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
			this._timeTable = routesTable;
			this.add(this._timeTable, {
				left : 250,
				top : 180
			});

		},

		/**
		 * Создает комбо-список дней.
		 * @param  {[type]} groupIndex [description]
		 * @return {[type]}            [description]
		 */
		 __createComboDays : function(groupModel) {
		 	var combosCount = this._dayGroupWidgets.length;
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
		 	source.addListener("dragstart", this.combo_day_groups_dragstart);
		 	source.addListener("droprequest",this.combo_day_groups_droprequest);
		 	source.addListener("drop", this.combo_day_groups_drop);
		 	source.addListener("dragover", this.combo_day_groups_dragover);

		 	button.addListener("click", function(e) {
		 		this.on_select_group(e, groupModel.getId());
		 	}, this);
		 	source.addListener("click", function(e) {
		 		this.on_select_group(e, groupModel.getId());
		 	}, this);

		 	var dayGroupWidget = {
		 		combo : source,
		 		btn_grp : button,
		 		btn_del : null
		 	};

		 	this._dayGroupWidgets.push(dayGroupWidget);

		 	var left = (this._dayGroupWidgets.length - 1) * (source.getWidth() + 5);
		 	this._daysBoxWidget.add(button, { left : left,	top : 0	 });
		 	this._daysBoxWidget.add(source, { left : left,	top : 30 });
		 	this._day_btn_group.add(button);
		 },

		 __setOptions : function() {
		 	this.setModal(true);
		 	this.setHeight(460);
		 	this.setWidth(790);
		 	this.center();

		 	this.addListener("resize", this.on_resize_window, this);
		 	this.__btnAddGroup.addListener("click", this.on_click___btnAddGroup,
		 		this);
		 	this.__btnAddRow.addListener("click", this.on_click___btnAddRow,
		 		this);
		 	this.__btnDeleteRow.addListener("click", this.on_click___btnDeleteRow,
		 		this);
		 	this._timeTable.addListener("dataEdited", this.on_change_timeTable,
		 		this);
			/* this._selected_index = 0;
			var timetableModel = this._currSchedule.scheduleGroups[this._selected_index].timetables;
			this.loadTimeTableFromModel(timetableModel);*/
		},

		makeScheduleObj : function() {

			var schedule = bus.admin.helpers.ObjectHelper.clone(this._currSchedule);
			schedule.scheduleGroups = [];
			// fill days
			for (var i = 0; i < this._dayGroupWidgets.length; i++) {
				var comboDays = this._dayGroupWidgets[i].combo;
				var items = comboDays.getChildren();
				var days = [];
				for (var j = 0; j < items.length; j++) {
					var dayID = items[j].getUserData("id");
					var day = {
						id : null,
						schedule_group_id : null,
						day_id : dayID
					};
					days.push(day);
				}
				if (days.length > 0) {
					this._currSchedule.scheduleGroups[i].days = days;
					var group = bus.admin.helpers.ObjectHelper
					.clone(this._currSchedule.scheduleGroups[i]);
					schedule.scheduleGroups.push(group);
				}
			}

			if (schedule.scheduleGroups.length == 1) {
				schedule.scheduleGroups[0].days = [{
					id : null,
					schedule_group_id : null,
					day_id : "c_all"
				}];
			}

			return schedule;
		},


		combo_day_groups_dragstart : function(e) {
			// dragstart is cancelable, you can put any runtime checks
			// here to dynamically disallow the drag feature on a widget
			// if (!check.isValue()) {
			// e.preventDefault();
			// }

			// Register supported types
			e.addType("value");
			e.addType("items");

			// Register supported actions
			e.addAction("copy");
			e.addAction("move");
		},
		combo_day_groups_droprequest : function(e) {
			this.debug("Related of droprequest: " + e.getRelatedTarget());

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
		combo_day_groups_dragover : function(e) {
			if (!e.supportsType("items")) {
				e.preventDefault();
			}
		},

		combo_day_groups_drop : function(e) {
			this.debug("Related of drop: " + e.getRelatedTarget());

			// Move items from source to target
			var items = e.getData("items");
			for (var i = 0, l = items.length; i < l; i++) {
				this.add(items[i]);
			}

		},

		on_resize_window : function(e) {
			this.debug(this.getBounds().width);
			this.debug(this.getBounds().height);

			/*
			 * this._btn_add_group.setUserBounds(this.getBounds().width - 120,
			 * 10, this._btn_add_group.getBounds().width,
			 * this._btn_add_group.getBounds().height);
*/

},
on_click___btnAddGroup : function(e) {
	var groupsCount = this._currSchedule.scheduleGroups.length;
	if (groupsCount < 7) {
		var defaultTime_A = bus.admin.helpers.ObjectHelper
		.convertTimeToSeconds("06:00");
		var defaultTime_B = bus.admin.helpers.ObjectHelper
		.convertTimeToSeconds("23:00");
		var defaultFreq = 10 * 60;
		var newScheduleGroup = {
			id : null,
			schedule_id : null,
			days : [],
			timetables : [{
				id : null,
				schedule_group_id : null,
				frequency : defaultFreq,
				time_A : defaultTime_A,
				time_B : defaultTime_B
			}]
		};
		this._currSchedule.scheduleGroups.push(newScheduleGroup);
		this.__createComboDays(groupsCount);
	}
},

loadTimeTableFromModel : function(timeModel) {
	if (timeModel == null)
		return;
	var rowData = [];
	for (var i = 0; i < timeModel.length; i++) {

		var time_A = bus.admin.helpers.ObjectHelper
		.convertSecsToHM(timeModel[i].time_A);
		var time_B = bus.admin.helpers.ObjectHelper
		.convertSecsToHM(timeModel[i].time_B);
		var freq = timeModel[i].frequency / 60;
		rowData.push([time_A, time_B, freq]);

		if (i == timeModel.length - 1) {
			rowData.push([time_B, "", ""]);
		}
	}

	rowData.push(["", "", ""]);
	this._timeTable.getTableModel().setData(rowData);
},

saveCurrentTimeTableToModel : function() {
	var rowData = this._timeTable.getTableModel().getData();
	var timetables = [];

	for (var i = 0; i < rowData.length; i++) {
		if (rowData[i][0].toString().length == 0
			|| rowData[i][1].toString().length == 0)
			continue;
		if (bus.admin.helpers.ObjectHelper.validateTime(rowData[i][0]) == false
			|| bus.admin.helpers.ObjectHelper
			.validateTime(rowData[i][1]) == false) {
			alert("Time form was wrange");
		return false;
		var s = "";
		s.length
	}
	if (rowData[i][2].length == 0) {
		this._day_btn_group
		.setSelection([this._dayGroupWidgets[this._selected_index].btn_grp]);
		alert("Please, fill frequancy");
		return false;
	}
	var secsTime_A = bus.admin.helpers.ObjectHelper
	.convertTimeToSeconds(rowData[i][0]);
	var secsTime_B = bus.admin.helpers.ObjectHelper
	.convertTimeToSeconds(rowData[i][1]);
	var frequency = 60 * rowData[i][2];

	timetables.push({
		time_A : secsTime_A,
		time_B : secsTime_B,
		frequency : frequency
	});

}
this._currSchedule.scheduleGroups[this._selected_index].timetables = timetables;
return true;
},

on_select_group : function(e, group_index) {
			// save timeModel from _timeTable
			var result = this.saveCurrentTimeTableToModel();
			if (result == false)
				return;
			// change group
			this._selected_index = group_index;
			this._day_btn_group
			.setSelection([this._dayGroupWidgets[group_index].btn_grp]);
			this
			.loadTimeTableFromModel(this._currSchedule.scheduleGroups[group_index].timetables);
			this._timeTable.resetCellFocus();
			this._timeTable.resetSelection();
		},


		on_click___btnAddRow : function(e) {
			var rowData = this._timeTable.getTableModel().getData();
			rowData.push(["", "", ""]);

			this._timeTable.getTableModel().setData(rowData);
		},

		on_click___btnDeleteRow : function(e) {
			var row = this._timeTable.getSelectionModel()
			.getAnchorSelectionIndex();
			if (row < 0)
				return;
			var rowData = this._timeTable.getTableModel().getData();
			rowData.splice(row, 1);
			this._timeTable.getTableModel().setData(rowData);
		},

		on_change_timeTable : function(e) {
			var count = this._timeTable.getTableModel().getRowCount();

			var data = e.getData();
			if (data.col == 2 || data.value == "")
				return;

			// validation
			var value = bus.admin.helpers.ObjectHelper
			.convertTimeToSeconds(data.value);
			if (bus.admin.helpers.ObjectHelper.validateTime(data.value) == false) {
				this._timeTable.getTableModel().setValue(data.col, data.row,
					data.oldValue);
				return;
			}

			// add last row
			if (count - 1 == data.row) {
				this.on_click___btnAddRow();
				count++;
			}

			if (data.col == 0) {
				var down_val = -1;
				var right_val = -1;

				right_val = bus.admin.helpers.ObjectHelper
				.convertTimeToSeconds(this._timeTable.getTableModel()
					.getValue(1, data.row));
				if (data.row > 0) {
					down_val = bus.admin.helpers.ObjectHelper
					.convertTimeToSeconds(this._timeTable
						.getTableModel().getValue(0, data.row - 1));
				}
				// convertTimeToSeconds
				if ((down_val == 0 || value > down_val)
					&& (right_val == 0 || value < right_val)) {
					if (data.row > 0) {
						this._timeTable.getTableModel().setValue(1,
							data.row - 1, data.value);
					}
				} else {
					this._timeTable.getTableModel().setValue(data.col,
						data.row, data.oldValue);
					return;
				}
			}

			// copy value in the left/down cell
			if (data.col == 1) {
				var up_val = bus.admin.helpers.ObjectHelper
				.convertTimeToSeconds(this._timeTable.getTableModel()
					.getValue(1, data.row + 1));
				var left_val = bus.admin.helpers.ObjectHelper
				.convertTimeToSeconds(this._timeTable.getTableModel()
					.getValue(0, data.row));
				this.debug("up_val:" + up_val);
				this.debug("left_val:" + left_val);
				this.debug("val:" + value);
				if ((up_val == 0 || value < up_val)
					&& (left_val == 0 || value > left_val)) {
					this.debug("here!");
				this._timeTable.getTableModel().setValue(0, data.row + 1,
					data.value);
			} else {
				this._timeTable.getTableModel().setValue(data.col,
					data.row, data.oldValue);
				return;
			}
		}

	},

	save_func : function(schedule, isBoth) {
		var route = this._routesPage.getCurrRouteModel();
		this.debug(schedule);
		if (isBoth == true) {
			route.directRouteWay.schedule = schedule;
			if (route.reverseRouteWay != null) {
				route.reverseRouteWay.schedule = bus.admin.helpers.ObjectHelper
				.clone(schedule);
			}
		} else {
			this._routeWay.schedule = schedule;
		}
		if (this._routesPage.getStatus() == "show") {
			var updateData = {
				route : this._routesPage.getCurrRouteModel(),
				opts : {
					isUpdateSchedule : true,
					isUpdateMainInfo : false,
					isUpdateRouteRelations : false
				}
			};
			qx.core.Init.getApplication().setWaitingWindow(true);
			var event_finish_func = qx.lang.Function.bind(function(data) {
				qx.core.Init.getApplication()
				.setWaitingWindow(false);
				if (data == null || data.error == true) {
					alert("Error! The timetable was not saved");
					return;
				}
				this.close();
			}, this);

			this._routesPage.getPresenter().updateRoute(updateData,
				event_finish_func);
		}
	},
	on_save_click : function() {
			// save timeModel from _timeTable
			var result = this.saveCurrentTimeTableToModel();
			if (result == false)
				return;

			this.save_func(this.makeScheduleObj(), false);
		},
		on_saveBoth_click : function() {
			// save timeModel from _timeTable
			var result = this.saveCurrentTimeTableToModel();
			if (result == false)
				return;
			this.save_func(this.makeScheduleObj(), true);

		},

		on_cancel_click : function() {
			this.close();
		}

	}
});