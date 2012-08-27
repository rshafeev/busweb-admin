qx.Class.define("bus.admin.mvp.view.routes.tabs.RoutesTabPage", {
	extend : qx.ui.tabview.Page,
	construct : function(routesLeftPanel) {
		this.base(arguments, "Routes", "icon/16/apps/utilities-notes.png");
		this.__routesLeftPanel = routesLeftPanel;
		this.setLayout(new qx.ui.layout.Canvas());
		this.initWidgets();

	},

	members : {
		__routesLeftPanel : null,
		__filterField : null,
		__routesTable : null,
		__mainContainer : null,
		__scrollContainer : null,
		__selectRouteModel : null,

		__routeTabView : null,
		__stationsTabPage : null,
		__localeTabPage : null,

		__stationsTable : null,
		__diRadioGroup : null,
		btn_edit : null,
		btn_change : null,
		btn_delete : null,
		btn_save : null,
		btn_cancel : null,
		btn_delete_station : null,
		btn_timeTable : null,

		on_btn_edit : function(e) {

		},

		on_btn_change : function(e) {
		},

		on_btn_delete : function(e) {

		},

		on_btn_timeTable : function(e) {

			var form = new bus.admin.mvp.view.routes.tabs.TimeForm(this.__selectRouteModel);
			form.open();
		},


		initWidgets : function() {
			this.__mainContainer = new qx.ui.container.Composite();
			this.__mainContainer.setMinHeight(430);
			this.__mainContainer.setMinWidth(430);
			this.__mainContainer.setLayout(new qx.ui.layout.Canvas());
			this.__scrollContainer = new qx.ui.container.Scroll().set({
						width : 300,
						height : 200
					});
			// buttons

			this.btn_timeTable = new qx.ui.form.Button("Time table...",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_timeTable.setWidth(105);
			this.btn_edit = new qx.ui.form.Button("Edit...",
					"bus/admin/images/btn/go-bottom.png");
			this.btn_edit.setWidth(105);
			this.btn_change = new qx.ui.form.Button("Change",
					"bus/admin/images/btn/utilities-text-editor.png");
			this.btn_change.setWidth(105);

			this.btn_delete = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(105);

			this.btn_save = new qx.ui.form.Button("Save",
					"bus/admin/images/btn/dialog-apply.png");
			this.btn_save.setWidth(105);

			this.btn_cancel = new qx.ui.form.Button("Cancel",
					"bus/admin/images/btn/dialog-cancel.png");
			this.btn_cancel.setWidth(105);

			// add widgets
			var filterLabel = new qx.ui.basic.Label("Filter:");
			this.__filterField = new qx.ui.form.TextField();
			this.__filterField.addListener("input", this.on_change_filterField,
					this);

			this.__routesTable = this.__createRoutesTable();

			this.__mainContainer.add(filterLabel, {
						left : 10,
						top : 10
					});

			this.__mainContainer.add(this.__filterField, {
						left : 50,
						top : 10
					});

			this.__mainContainer.add(this.__routesTable, {
						left : 10,
						top : 50
					});
			this.btn_edit.addListener("execute", this.on_btn_edit, this);
			this.btn_change.addListener("execute", this.on_btn_change, this);
			this.btn_delete.addListener("execute", this.on_btn_delete, this);
			this.btn_timeTable.addListener("execute", this.on_btn_timeTable,
					this);

			this.__mainContainer.add(this.btn_edit);
			this.__mainContainer.add(this.btn_change);
			this.__mainContainer.add(this.btn_delete);
			this.__mainContainer.add(this.btn_timeTable);

			this.__routeTabView = this.__createRouteTabView();
			this.__mainContainer.add(this.__routeTabView, {
						left : 10,
						top : 215
					});
			this.__scrollContainer.add(this.__mainContainer);
			this.add(this.__scrollContainer, {
						left : 0,
						top : 0,
						width : "100%",
						height : "100%"
					});

			this.loadRotesTable();
			this.__mainContainer.addListener("resize",
					this.on_resize_mainContainer, this);
		},
		on_change_filterField : function(e) {
			var fieldValue = this.__filterField.getValue();
			var model = this.__routesTable.getTableModel();

			if (fieldValue.length > 0) {
				this.debug("on_change_filterField(): " + fieldValue);
				model.resetHiddenRows();
				model.addNotRegex(fieldValue, "Number", true);
				model.applyFilters();
			} else {
				model.resetHiddenRows();
			}

		},
		refreshWidgets : function() {
			var transportType = this.__routesLeftPanel.getTransportType();
			var child = new qx.type.Array().append(this.__routeTabView
					.getChildren()).filter(function(page) {
						return this.__localeTabPage == page;
					}, this);
			this.debug(child.length);
			if (child != null && child.length > 0
					&& transportType.toString() != "c_metro") {
				this.__routeTabView.remove(this.__localeTabPage);
			} else if (child.length == 0
					&& transportType.toString() == "c_metro") {
				this.__routeTabView.add(this.__localeTabPage);
			}
		},
		__createRouteTabView : function() {
			var tabView = new qx.ui.tabview.TabView();

			// create stationsTabPage
			this.__stationsTabPage = new qx.ui.tabview.Page("Stations");
			this.__stationsTabPage.setLayout(new qx.ui.layout.Canvas());
			this.__stationsTabPage.setWidth(250);
			this.__stationsTabPage.setHeight(200);

			this.__diRadioGroup = new qx.ui.form.RadioButtonGroup();
			var radioDirect = new qx.ui.form.RadioButton("Direct");
			var radioReverse = new qx.ui.form.RadioButton("Reverse");
			this.__stationsTable = this.__createStationsTable();
			radioDirect.addListener("execute", this.on_radio_direct, this);
			radioReverse.addListener("execute", this.on_radio_reverse, this);

			radioDirect.execute();
			this.__diRadioGroup.setLayout(new qx.ui.layout.VBox(5));
			this.__diRadioGroup.add(radioDirect);
			this.__diRadioGroup.add(radioReverse);

			this.btn_delete_station = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete_station.setWidth(90);
			this.__stationsTabPage.add(this.__diRadioGroup);
			this.__stationsTabPage.add(this.__stationsTable, {
						left : 5,
						top : 5
					});

			this.__stationsTabPage.add(this.btn_delete_station);

			// create localeTabPage
			this.__localeTabPage = new qx.ui.tabview.Page("Localization");
			this.__localeTabPage.setWidth(250);
			this.__localeTabPage.setHeight(200);

			// add pages to tabView
			var transportType = this.__routesLeftPanel.getTransportType();
			tabView.add(this.__stationsTabPage);

			if (transportType.toString() == "c_metro") {
				tabView.add(this.__localeTabPage);
			}
			tabView.addListener("resize", this.on_resize_tabView, this);

			return tabView;
		},
		__createStationsTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			// table
			var stationsTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			stationsTable.setBackgroundColor('white');
			stationsTable.setStatusBarVisible(false);
			stationsTable.setHeight(90);

			return stationsTable;
		},
		__createRoutesTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Filtered();
			tableModel.setColumns(["ID", "Number", "Cost"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);

			// table
			var routesTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			routesTable.setBackgroundColor('white');
			routesTable.setStatusBarVisible(false);
			routesTable.addListener("cellDblclick",
					this.on_routesTable_Dblclick, this);
			routesTable.setHeight(150);

			return routesTable;

		},
		loadRotesTable : function() {
			var rowData = [];
			for (var i = 0; i < 300; i++) {
				rowData.push([i, "test_" + i.toString(), "1.3"]);
			}
			this.__routesTable.getTableModel().setData(rowData);

			this.debug("loadRotesTable()");
		},
		loadStationsTable : function() {
			var rowData = [];
			for (var i = 0; i < 10; i++) {
				rowData.push([i, "test"]);
			}

			this.__stationsTable.getTableModel().setData(rowData);

		},
		on_radio_direct : function(e) {
			this.loadStationsTable();
		},
		on_radio_reverse : function(e) {
			this.loadStationsTable();
		},

		on_routesTable_Dblclick : function(e) {
			this.loadStationsTable();
		},
		on_resize_tabView : function(e) {
			if (this.__stationsTable != null) {
				this.__stationsTable
						.setWidth(this.__routeTabView.getBounds().width
								- this.__stationsTable.getBounds().left - 130);
				this.__stationsTable
						.setHeight(this.__routeTabView.getBounds().height
								- this.__stationsTable.getBounds().top - 40);
			}
			if (this.__diRadioGroup != null) {
				this.__diRadioGroup.setUserBounds(this.__routeTabView
								.getBounds().width
								- 120, 5,
						this.__diRadioGroup.getBounds().width,
						this.__diRadioGroup.getBounds().height);
			}
			this.btn_delete_station.setUserBounds(this.__routeTabView
							.getBounds().width
							- 120, 80,
					this.btn_delete_station.getBounds().width,
					this.btn_delete_station.getBounds().height);

		},
		on_resize_mainContainer : function(e) {
			this.debug("on_resize_tabView()");
			this.debug(this.__mainContainer.getBounds().width);
			if (this.__routesTable != null) {
				this.__routesTable
						.setWidth(this.__mainContainer.getBounds().width
								- this.__routesTable.getBounds().left - 115);
				this.btn_timeTable.setUserBounds(this.__mainContainer
								.getBounds().width
								- 110, 50,
						this.btn_timeTable.getBounds().width,
						this.btn_timeTable.getBounds().height);
				this.btn_edit.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 85,
						this.btn_edit.getBounds().width, this.btn_edit
								.getBounds().height);
				this.btn_change.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 120,
						this.btn_change.getBounds().width, this.btn_change
								.getBounds().height);
				this.btn_delete.setUserBounds(
						this.__mainContainer.getBounds().width - 110, 155,
						this.btn_delete.getBounds().width, this.btn_delete
								.getBounds().height);

			}
			if (this.__routeTabView != null) {
				this.__routeTabView
						.setWidth(this.__mainContainer.getBounds().width
								- this.__routeTabView.getBounds().left - 10);
				this.__routeTabView
						.setHeight(this.__mainContainer.getBounds().height
								- this.__routeTabView.getBounds().top - 10);
			}
		}

	}

});