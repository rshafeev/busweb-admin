qx.Class.define("bus.admin.mvp.view.routes.tabs.TimeForm", {
	extend : qx.ui.window.Window,

	construct : function(directRouteModel, save_func) {
		this.base(arguments);

		this.save_func = save_func;
		this._currSchedule = bus.admin.helpers.ObjectHelper
				.clone(directRouteModel.schedule);
		this.debug("TimeForm construct()");
		console.log(this._currSchedule);
		this._dayGroupWidgets = [];
		this.initWidgets();
		this.setOptions();
	},
	destruct : function() {
		this.dispose();
	},
	members : {
		save_func : null,
		_currSchedule : null,
		_presenter : null,
		btn_add_row : null,
		btn_del_row : null,
		btn_save : null,
		btn_cancel : null,
		btn_saveBoth : null,
		btnAddGroup : null,
		_timeTableModel : null,
		_day_btn_group : null,
		_daysBoxWidget : null,
		_dayGroupWidgets : null,
		_selected_index : null,
		_timeTable : null,

		makeScheduleObj : function() {
			/*
			 * 
			 * var newScheduleGroup = { id : null, schedule_id : null, days :
			 * [], timetables : [{ id : null, schedule_group_id : null,
			 * frequency : defaultFreq, time_A : defaultTime_A, time_B :
			 * defaultTime_B }] };
			 * this._currSchedule.scheduleGroups.push(newScheduleGroup);
			 */
			var schedule = bus.admin.helpers.ObjectHelper
					.clone(this._currSchedule);
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

		getDaysFromGroupModel : function(groupModel) {
			var days = groupModel.days;

			var strDays = [];
			if (days.length == 0)
				return strDays;
			if (days[0].day_id == "c_all") {
				strDays.push("c_Sunday");
				strDays.push("c_Monday");
				strDays.push("c_Tuesday");
				strDays.push("c_Wednesday");
				strDays.push("c_Thursday");
				strDays.push("c_Friday");
				strDays.push("c_Saturday");
				return strDays;
			}
			for (var i = 0; i < days.length; i++) {
				strDays.push(days[i].day_id);
			}

			return strDays;
		},

		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			this._daysBoxWidget = new qx.ui.groupbox.GroupBox("Groups of days");
			this._daysBoxWidget.setLayout(new qx.ui.layout.Canvas());
			this._daysBoxWidget.setWidth(740);
			this.add(this._daysBoxWidget, {
						left : 0,
						top : -10
					});

			this._day_btn_group = new qx.ui.form.RadioGroup();

			for (var i = 0; i < this._currSchedule.scheduleGroups.length; i++) {
				this.create_combo_day(i);
			}

			var manage_box = new qx.ui.groupbox.GroupBox("Manage");
			manage_box.setLayout(new qx.ui.layout.Canvas());
			manage_box.setWidth(220);
			this.add(manage_box, {
						left : 0,
						top : 160
					});

			this.btnAddGroup = new qx.ui.form.Button("Add new days group",
					"bus/admin/images/btn/go-bottom.png");
			manage_box.add(this.btnAddGroup, {
						left : 0,
						top : 0
					});

			this._timeTable = this.__createTimeTable();
			this.add(this._timeTable, {
						left : 250,
						top : 180
					});

			this.btn_save = new qx.ui.form.Button("Save",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.addListener("execute", this.on_save_click, this);
			this.btn_save.setWidth(90);

			this.btn_saveBoth = new qx.ui.form.Button("Save (both)",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_saveBoth.addListener("execute", this.on_saveBoth_click,
					this);
			this.btn_saveBoth.setWidth(120);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_cancel.setWidth(90);

			this.add(this.btn_save, {
						left : 550,
						top : 390
					});
			this.add(this.btn_saveBoth, {
						left : 400,
						top : 390
					});
			this.add(this.btn_cancel, {
						left : 660,
						top : 390
					});

			this.btn_add_row = new qx.ui.form.Button("",
					"bus/admin/images/btn/list-add.png");
			this.btn_del_row = new qx.ui.form.Button("",
					"bus/admin/images/btn/list-remove.png");
			this.btn_add_row.setWidth(35);
			this.btn_del_row.setWidth(35);
			this.add(this.btn_add_row, {
						left : 700,
						top : 180
					});
			this.add(this.btn_del_row, {
						left : 700,
						top : 220
					});

		},

		create_combo_day : function(group_index) {

			var button = new qx.ui.form.ToggleButton("Group "
					+ (group_index + 1).toString());
			button.setHeight(25);

			var source = new qx.ui.form.List;
			source.setDraggable(true);
			source.setDroppable(true);
			source.setSelectionMode("multi");
			source.setHeight(100);
			source.setWidth(100);
			var currGroup = this._currSchedule.scheduleGroups[group_index];
			var days = this.getDaysFromGroupModel(currGroup);
			if (days) {
				for (var i = 0; i < days.length; i++) {
					var dayID = days[i];
					var dayName = null;
					switch (dayID) {
						case "c_Sunday" :
							dayName = this.tr("c_Sunday");
							break;
						case "c_Monday" :
							dayName = this.tr("c_Monday");
							break;
						case "c_Tuesday" :
							dayName = this.tr("c_Tuesday");
							break;
						case "c_Wednesday" :
							dayName = this.tr("c_Wednesday");
							break;
						case "c_Thursday" :
							dayName = this.tr("c_Thursday");
							break;
						case "c_Friday" :
							dayName = this.tr("c_Friday");
							break;
						case "c_Saturday" :
							dayName = this.tr("c_Saturday");
							break;
						default :
							break;
					}

					var item = new qx.ui.form.ListItem(dayName);
					item.setUserData("id", dayID);
					source.add(item);
				}
			}
			source.addListener("dragstart", this.combo_day_groups_dragstart);
			source
					.addListener("droprequest",
							this.combo_day_groups_droprequest);
			source.addListener("drop", this.combo_day_groups_drop);
			source.addListener("dragover", this.combo_day_groups_dragover);

			button.addListener("click", function(e) {
						this.on_select_group(e, group_index);
					}, this);
			source.addListener("click", function(e) {
						this.on_select_group(e, group_index);
					}, this);

			var dayGroupWidget = {
				combo : source,
				btn_grp : button,
				btn_del : null
			};

			this._dayGroupWidgets.push(dayGroupWidget);

			// this._timeTableModel

			var left = (this._dayGroupWidgets.length - 1)
					* (source.getWidth() + 5);
			this._daysBoxWidget.add(button, {
						left : left,
						top : 0
					});
			this._daysBoxWidget.add(source, {
						left : left,
						top : 30
					});

			this._day_btn_group.add(button);
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
		on_click_btnAddGroup : function(e) {
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
				this.create_combo_day(groupsCount);
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

		__createTimeTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["Time 1", "Time 2", "Frequance (minutes)"]);
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
			/*
			 * routesTable.addListener("cellDblclick",
			 * this.on_routesTable_Dblclick, this);
			 */
			routesTable.setHeight(180);
			routesTable.setWidth(440);
			return routesTable;

		},
		on_click_btn_add_row : function(e) {
			var rowData = this._timeTable.getTableModel().getData();
			rowData.push(["", "", ""]);

			this._timeTable.getTableModel().setData(rowData);
		},

		on_click_btn_del_row : function(e) {
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
				this.on_click_btn_add_row();
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
		setOptions : function() {
			this.setModal(true);
			this.setHeight(460);
			this.setWidth(790);
			this.center();

			this.addListener("resize", this.on_resize_window, this);
			this.btnAddGroup.addListener("click", this.on_click_btnAddGroup,
					this);
			this.btn_add_row.addListener("click", this.on_click_btn_add_row,
					this);
			this.btn_del_row.addListener("click", this.on_click_btn_del_row,
					this);
			this._timeTable.addListener("dataEdited", this.on_change_timeTable,
					this);

			this._selected_index = 0;
			var timetableModel = this._currSchedule.scheduleGroups[this._selected_index].timetables;
			this.loadTimeTableFromModel(timetableModel);
		},

		on_save_click : function() {
			// save timeModel from _timeTable
			var result = this.saveCurrentTimeTableToModel();
			if (result == false)
				return;
			this.save_func(this.makeScheduleObj(), false);
			this.close();
		},
		on_saveBoth_click : function() {
			// save timeModel from _timeTable
			var result = this.saveCurrentTimeTableToModel();
			if (result == false)
				return;
			this.save_func(this.makeScheduleObj(), true);
			this.close();

		},

		on_cancel_click : function() {
			this.close();
		}

	}
});