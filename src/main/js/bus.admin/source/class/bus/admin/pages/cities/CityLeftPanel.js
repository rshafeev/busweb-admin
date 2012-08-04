
/*******************************************************************************
 * 
 * #asset(bus/admin/*)
 * 
 ******************************************************************************/

qx.Class.define("bus.admin.pages.cities.CityLeftPanel", {
	extend : qx.ui.container.Composite,

	construct : function(citiesWidget) {
		this.__citiesWidget = citiesWidget;
		this.base(arguments);
		this.setLayout(new qx.ui.layout.Canvas());
		this.setWidth(360);
		this.setMinWidth(360);
		this.setAppearance("left-panel");
		this.addListener("resize", this.__resize_event);
		this.initWidgets();

	},
	members : {
		__citiesWidget : null,
		citiesTable : null,
		citiesLocalizationTable : null,
		btn_change : null,
		btn_delete : null,
		btn_refresh : null,
		combo_langs : null,
		createRandomRows : function(rowCount) {
			var rowData = [];
			var now = new Date().getTime();
			var dateRange = 400 * 24 * 60 * 60 * 1000; // 400 days
			var nextId = 0;
			for (var row = 0; row < rowCount; row++) {
				var date = new Date(now + Math.random() * dateRange - dateRange
						/ 2);
				rowData.push([nextId++, Math.random() * 10000, date,
						(Math.random() > 0.5), 1]);
			}
			return rowData;
		},

		__resize_event : function() {
			if (this.citiesTable) {
				this.citiesTable.setWidth(this.getBounds().width
						- this.citiesTable.getBounds().left - 10);
				this.citiesTable.setHeight(this.getBounds().height
						- this.citiesTable.getBounds().top - 70);
			}
			if (this.citiesLocalizationTable) {
				this.citiesLocalizationTable.setWidth(this.getBounds().width
						- this.citiesLocalizationTable.getBounds().left - 10);
				this.citiesLocalizationTable.setHeight(this.getBounds().height
						- this.citiesLocalizationTable.getBounds().top - 70);
			}
			this.btn_change.setUserBounds(this.getBounds().width - 200, this
							.getBounds().height
							- 65, this.btn_change.getBounds().width,
					this.btn_change.getBounds().height);
			this.btn_delete.setUserBounds(this.getBounds().width - 100, this
							.getBounds().height
							- 65, this.btn_delete.getBounds().width,
					this.btn_delete.getBounds().height);
			this.btn_refresh.setUserBounds(this.getBounds().width - 300, this
							.getBounds().height
							- 65, this.btn_refresh.getBounds().width,
					this.btn_refresh.getBounds().height);

			this.combo_langs.setUserBounds(this.getBounds().width - 140,
					this.combo_langs.getBounds().top, this.combo_langs
							.getBounds().width,
					this.combo_langs.getBounds().height);
		},
		initWidgets : function() {
			/*
			 * var label = new qx.ui.basic.Label("Cities").set({ alignY :
			 * "middle" }); this.add(label);
			 */

			// radiobuttons
			var radioButtonGroupHBox = new qx.ui.form.RadioButtonGroup();
			radioButtonGroupHBox.setLayout(new qx.ui.layout.HBox(5));
			var infoButton = new qx.ui.form.RadioButton("Information");
			var locButton = new qx.ui.form.RadioButton("Localization");
			infoButton.addListener("execute", function() {
						this.citiesTable.setVisibility('visible');
						this.citiesLocalizationTable.setVisibility('hidden');
						this.combo_langs.setVisibility('hidden');
					}, this);
			locButton.addListener("execute", function() {
						this.citiesTable.setVisibility('hidden');
						this.citiesLocalizationTable.setVisibility('visible');
						this.combo_langs.setVisibility('visible');
					}, this);

			radioButtonGroupHBox.add(infoButton);
			radioButtonGroupHBox.add(locButton);

			this.add(radioButtonGroupHBox, {
						left : 10,
						top : 10
					});
			this.citiesTable = this.createCitiesTable();
			this.citiesLocalizationTable = this.createCitiesLocalizationTable();
			this.add(this.citiesTable, {
						top : 40,
						left : 10
					});
			this.add(this.citiesLocalizationTable, {
						top : 40,
						left : 10
					});

			// buttons

			this.btn_change = new qx.ui.form.Button("Change",
					"bus/admin/images/btn/utilities-text-editor.png");
			this.btn_change.setWidth(90);
			this.btn_delete = new qx.ui.form.Button("Delete",
					"bus/admin/images/btn/edit-delete.png");
			this.btn_delete.setWidth(90);
			this.btn_refresh = new qx.ui.form.Button("Refresh",
					"bus/admin/images/btn/view-refresh.png");
			this.btn_refresh.setWidth(90);
			this.btn_delete.setEnabled(false);
			this.btn_change.setEnabled(false);
			this.add(this.btn_change);
			this.add(this.btn_delete);
			this.add(this.btn_refresh);

			// lang_combo
			var rawData = [];
			rawData.push("English");
			rawData.push("Ukrainian");
			var model = qx.data.marshal.Json.createModel(rawData);

			this.combo_langs = new qx.ui.form.VirtualComboBox();
			this.combo_langs.setModel(model);
			this.combo_langs.setValue(rawData[0]);
			this.combo_langs.setVisibility('hidden');
			this.add(this.combo_langs, {
						left : 220,
						top : 10
					});

			this.addListenerOnce("appear", function() {
						this.__resize_event();
					});
			this.debug("CityLeftPanel was initialized");
		},

		createCitiesLocalizationTable : function() {
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name(ru)", "Name(lang)"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, true);
			tableModel.setColumnEditable(2, true);

			// table
			var citiesLocalizationTable = new qx.ui.table.Table(tableModel)
					.set({
								decorator : null
							});
			citiesLocalizationTable.setBackgroundColor('white');
			citiesLocalizationTable.setStatusBarVisible(false);
			citiesLocalizationTable.setVisibility('hidden');
			return citiesLocalizationTable;
		},

		createCitiesTable : function() {
			// table model
			var tableModel = new qx.ui.table.model.Simple();
			tableModel.setColumns(["ID", "Name(ru)", "Lat", "Lon", "Scale"]);
			tableModel.setColumnEditable(0, false);
			tableModel.setColumnEditable(1, false);
			tableModel.setColumnEditable(2, false);
			tableModel.setColumnEditable(3, false);
			tableModel.setColumnEditable(4, false);

			// table
			var citiesTable = new qx.ui.table.Table(tableModel).set({
						decorator : null
					});
			citiesTable.setBackgroundColor('white');
			citiesTable.setStatusBarVisible(false);
			return citiesTable;

		}
	}
});