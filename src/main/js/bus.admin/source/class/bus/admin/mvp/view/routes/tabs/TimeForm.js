qx.Class.define("bus.admin.mvp.view.routes.tabs.TimeForm", {
	extend : qx.ui.window.Window,

	construct : function(routeModel) {
		this.base(arguments);
		this._timeTableModel = routeModel.timetable.groups;
		this._day_groups_Array = [];
		this.initWidgets();
		this.setOptions();
	},
	destruct : function() {
		this.dispose();
	},
	members : {
		btn_add_row : null,
		btn_del_row : null,
		btn_save : null,
		btn_cancel : null,
		_btn_add_group : null,
		_timeTableModel : null,
		_day_btn_group : null,
		_days_box : null,
		_day_groups_Array : null,
		_selected_index : null,
		_timeTable : null,
		initWidgets : function() {
			this.setLayout(new qx.ui.layout.Canvas());

			this._days_box = new qx.ui.groupbox.GroupBox("Groups of days");
			this._days_box.setLayout(new qx.ui.layout.Canvas());
			this.add(this._days_box, {
						left : 0,
						top : -10
					});

			this._day_btn_group = new qx.ui.form.RadioGroup();
			var days1 = [];
			var days2 = [];
			days1.push(this.tr("c_Monday"));
			days1.push(this.tr("c_Tuesday"));
			days1.push(this.tr("c_Wednesday"));
			days1.push(this.tr("c_Thursday"));
			days1.push(this.tr("c_Friday"));
			days2.push(this.tr("c_Saturday"));
			days2.push(this.tr("c_Sunday"));
			this.create_combo_day(days1);
			this.create_combo_day(days2);

			var manage_box = new qx.ui.groupbox.GroupBox("Manage");
			manage_box.setLayout(new qx.ui.layout.Canvas());
			this.add(manage_box, {
						left : 0,
						top : 155
					});
			this._btn_add_group = new qx.ui.form.Button("Add new days group",
					"bus/admin/images/btn/go-bottom.png");
			manage_box.add(this._btn_add_group, {
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

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.addListener("execute", this.on_cancel_click, this);
			this.btn_cancel.setWidth(90);

			this.add(this.btn_save, {
						left : 550,
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
		load_data_to_timeTalbe : function(timeModel) {
			if (timeModel == null)
				return;
			var rowData = [];
			for (var i = 0; i < timeModel.length; i++) {
				rowData.push([timeModel[i].timeA, timeModel[i].timeB,
						timeModel[i].freq]);
			}
			rowData.push([timeModel[timeModel.length - 1].timeB, "", ""]);
			rowData.push(["", "", ""]);
			this._timeTable.getTableModel().setData(rowData);
		},
		create_combo_day : function(days) {
			var group_index = this._day_groups_Array.length;
			var button = new qx.ui.form.ToggleButton("Group "
					+ (group_index + 1).toString());
			button.setHeight(25);

			var source = new qx.ui.form.List;
			source.setDraggable(true);
			source.setDroppable(true);
			source.setSelectionMode("multi");
			source.setHeight(100);
			source.setWidth(100);

			if (days) {
				for (var i = 0; i < days.length; i++) {
					source.add(new qx.ui.form.ListItem(days[i]));
				}
			}
			source.addListener("dragstart", this.combo_day_groups_dragstart);
			source
					.addListener("droprequest",
							this.combo_day_groups_droprequest);
			source.addListener("drop", this.combo_day_groups_drop);
			source.addListener("dragover", this.combo_day_groups_dragover);

			var T = this;
			button.addListener("click", function(e) {
						T.on_select_group(e, group_index);
					});
			source.addListener("click", function(e) {
						T.on_select_group(e, group_index);
					});

			var day_group = {
				combo : source,
				btn_grp : button,
				btn_del : null
			};

			this._day_groups_Array.push(day_group);

			// this._timeTableModel

			var left = (this._day_groups_Array.length - 1)
					* (source.getWidth() + 5);
			this._days_box.add(button, {
						left : left,
						top : 0
					});
			this._days_box.add(source, {
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
		on_click_btn_add_group : function(e) {
			if (this._day_groups_Array.length < 7) {
				this.create_combo_day();

				var model = {
					days : null,
					times : [{
								timeA : "8.30",
								timeB : "23.00",
								freq : "10"
							}]
				};
				this._timeTableModel.push(model);

			}
		},
		on_select_group : function(e, group_index) {
			// save timeModel from _timeTable

			var rowData = this._timeTable.getTableModel().getData();
			var times = [];
			for (var i = 0; i < rowData.length; i++) {
				var timeA = rowData[i][0];
				var timeB = rowData[i][1];
				var freq = rowData[i][2];

				if (timeA == "" || timeB == "")
					continue;
				if (freq == "") {
					this._day_btn_group
							.setSelection([this._day_groups_Array[this._selected_index].btn_grp]);
					alert("Please, fill frequancy");
					return;
				}
				times.push({
							timeA : timeA,
							timeB : timeB,
							freq : freq
						});

			}
			this._timeTableModel[this._selected_index].times = times;
			// change group
			this._selected_index = group_index;
			this._day_btn_group
					.setSelection([this._day_groups_Array[group_index].btn_grp]);
			this
					.load_data_to_timeTalbe(this._timeTableModel[group_index].times);
		},
		__createTimeTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["Time 1", "Time 2", "Frequance (minutes)"]);
			tableModel.setColumnEditable(0, true);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);

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
			var value = parseFloat(data.value);
			var x = parseInt(value);
			var y = value - parseInt(value);
			var reg = new RegExp("^[0-9\.]*$");

			if (value < 0 || x > 24 || y > 0.6 || (x == 24 && y > 0)
					|| !reg.test(value.toString())) {
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
				var down_val = "";
				var right_val = this._timeTable.getTableModel().getValue(1,
						data.row);
				if (data.row > 0) {
					down_val = this._timeTable.getTableModel().getValue(0,
							data.row - 1);
				}

				if ((down_val == "" || value > parseFloat(down_val))
						&& (right_val == "" || value < parseFloat(right_val))) {
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
				var up_val = this._timeTable.getTableModel().getValue(1,
						data.row + 1);
				var left_val = this._timeTable.getTableModel().getValue(0,
						data.row);
				this.debug("up_val:" + up_val);
				this.debug("left_val:" + left_val);
				this.debug("val:" + value);
				if ((up_val == "" || value < parseFloat(up_val))
						&& (left_val == "" || value > parseFloat(left_val))) {
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
			this._btn_add_group.addListener("click",
					this.on_click_btn_add_group, this);
			this.btn_add_row.addListener("click", this.on_click_btn_add_row,
					this);
			this.btn_del_row.addListener("click", this.on_click_btn_del_row,
					this);
			this._timeTable.addListener("dataEdited", this.on_change_timeTable,
					this);
			this._timeTableModel = [];
			var model1 = {
				days : [],
				times : [{
							timeA : "8.30",
							timeB : "23.00",
							freq : "10"
						}]
			};
			var model2 = {
				days : [],
				times : [{
							timeA : "8.30",
							timeB : "23.00",
							freq : "10"
						}]
			};
			this._timeTableModel.push(model1);
			this._timeTableModel.push(model2);

			this.load_data_to_timeTalbe(model1.times);

			this._selected_index = 0;
		},
		on_save_click : function() {
			// validation
			/*
			 * for (var i = 0; i <
			 * this.table_names.getTableModel().getRowCount(); i++) { var
			 * rowData = this.table_names.getTableModel() .getRowDataAsMap(i);
			 * 
			 * if (rowData.Name.toString().length <= 0) { alert("Please, push
			 * names for all languages"); return; } } if
			 * (this.__getTransports().length == 0) { alert("Please, select
			 * transport types(one or more)."); return; } if
			 * (this.getChangeDialog()) { this.__updateStation(); } else {
			 * this.__insertStation(); }
			 */
		},

		on_cancel_click : function() {
			this.close();
		}

	}
});