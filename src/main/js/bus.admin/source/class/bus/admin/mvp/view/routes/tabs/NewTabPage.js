qx.Class.define("bus.admin.mvp.view.routes.tabs.NewTabPage", {
	extend : qx.ui.tabview.Page,
	construct : function(routesLeftPanel) {
		this.base(arguments, "New", "icon/16/apps/utilities-notes.png");
		this.__routesLeftPanel = routesLeftPanel;
		this.setLayout(new qx.ui.layout.Canvas());
		this.initWidgets();
		this.setOptions();
		
		/*this._routeModel = {
			city_id : null,
			transport_type : null,
			cost : null,
			number : null,
			names : null,
			direct_stations : null,

			reverse_stations : null,
			timetable : {
				groups : []
			}
			// groups : {days,times}
		
		};*/
	},
	
	members : {
		__mainContainer : null,
		__scrollContainer : null,

		__routesLeftPanel : null,
		__stepsTabView : null,
		__page1 : null,
		__page2 : null,
		__page3 : null,
		__page4 : null,

		__btn_browser : null,
		__btn_next_page1 : null,
		__btn_next_page2 : null,
		__btn_next_page3 : null,

		__btn_back_page2 : null,
		__btn_back_page3 : null,
		__btn_back_page4 : null,
		__btn_finish_page4 : null,

		__btn_cancel_page1 : null,
		__btn_cancel_page2 : null,
		__btn_cancel_page3 : null,
		__btn_cancel_page4 : null,

		setUndirect : function(undirect) {
			var child = new qx.type.Array().append(this.__stepsTabView
					.getChildren()).filter(function(page) {
						return this.__page3 == page;
					}, this);
			if (child != null && child.length > 0 && undirect == true) {
				this.__page4.setLabel("Step 3");
				this.__stepsTabView.remove(this.__page3);
			} else if (child != null && child.length == 0 && undirect == false) {
				this.__page4.setLabel("Step 4");
				this.__stepsTabView.addAt(this.__page3, 2);
			}
		},
		setOptions : function() {
			this.__btn_next_page1.addListener("click", this.on_btn_next_page1,
					this);
			this.__btn_next_page2.addListener("click", this.on_btn_next_page2,
					this);
			this.__btn_next_page3.addListener("click", this.on_btn_next_page3,
					this);

		},
		initWidgets : function() {
			this.__mainContainer = new qx.ui.container.Composite();
			this.__mainContainer.setMinHeight(300);
			this.__mainContainer.setMinWidth(430);
			this.__mainContainer.setLayout(new qx.ui.layout.Canvas());
			this.__scrollContainer = new qx.ui.container.Scroll().set({
						width : 300,
						height : 200
					});

			this.__stepsTabView = this.__createStepsTabView();

			this.__mainContainer.add(
					new qx.ui.basic.Label("Please, fill all data"), {
						left : 0,
						top : 0
					});
			this.__mainContainer.add(this.__stepsTabView, {
						left : 0,
						top : 30
					});

			this.__scrollContainer.add(this.__mainContainer);
			this.add(this.__scrollContainer, {
						left : 0,
						top : 0,
						width : "100%",
						height : "100%"
					});

			// add listeners

			this.__stepsTabView.addListener("resize",
					this.on_resize_stepsVatView, this);
			this.__mainContainer.addListener("resize", this.on_resize, this);

		},
		on_resize_stepsVatView : function(e) {
			// page 1

			if (this.__btn_next_page1) {
				this.__btn_next_page1.setUserBounds(
						this.__page1.getBounds().width - 260, this.__page1
								.getBounds().height
								- 30, this.__btn_next_page1.getBounds().width,
						this.__btn_next_page1.getBounds().height);
			}
			if (this.__btn_cancel_page1) {
				this.__btn_cancel_page1.setUserBounds(
						this.__page1.getBounds().width - 100, this.__page1
								.getBounds().height
								- 30,
						this.__btn_cancel_page1.getBounds().width,
						this.__btn_cancel_page1.getBounds().height);
			}

			// page 2
			if (this.__btn_next_page2) {
				this.__btn_next_page2.setUserBounds(
						this.__page1.getBounds().width - 260, this.__page1
								.getBounds().height
								- 30, this.__btn_next_page2.getBounds().width,
						this.__btn_next_page2.getBounds().height);
			}
			if (this.__btn_cancel_page2) {
				this.__btn_cancel_page2.setUserBounds(
						this.__page1.getBounds().width - 100, this.__page1
								.getBounds().height
								- 30,
						this.__btn_cancel_page2.getBounds().width,
						this.__btn_cancel_page2.getBounds().height);
			}
			if (this.__btn_back_page2) {
				this.__btn_back_page2.setUserBounds(
						this.__page1.getBounds().width - 360, this.__page1
								.getBounds().height
								- 30, this.__btn_back_page2.getBounds().width,
						this.__btn_back_page2.getBounds().height);
			}

			// page 3
			if (this.__btn_next_page3) {
				this.__btn_next_page3.setUserBounds(
						this.__page3.getBounds().width - 260, this.__page3
								.getBounds().height
								- 30, this.__btn_next_page3.getBounds().width,
						this.__btn_next_page3.getBounds().height);
			}
			if (this.__btn_cancel_page3) {
				this.__btn_cancel_page3.setUserBounds(
						this.__page1.getBounds().width - 100, this.__page3
								.getBounds().height
								- 30,
						this.__btn_cancel_page3.getBounds().width,
						this.__btn_cancel_page3.getBounds().height);
			}
			if (this.__btn_back_page3) {
				this.__btn_back_page3.setUserBounds(
						this.__page3.getBounds().width - 360, this.__page3
								.getBounds().height
								- 30, this.__btn_back_page3.getBounds().width,
						this.__btn_back_page3.getBounds().height);
			}
			return;
		},
		on_resize : function(e) {
			if (this.__stepsTabView != null) {
				this.__stepsTabView
						.setWidth(this.__mainContainer.getBounds().width
								- this.__stepsTabView.getBounds().left - 10);
				this.__stepsTabView
						.setHeight(this.__mainContainer.getBounds().height
								- this.__stepsTabView.getBounds().top - 10);
			}
		},
		on_btn_next_page1 : function(e) {
			this.__stepsTabView.setSelection([this.__page2]);
		},
		on_btn_next_page2 : function(e) {
			this.__stepsTabView.setSelection([this.__page3]);
		},
		on_btn_next_page3 : function(e) {
			this.__stepsTabView.setSelection([this.__page4]);
		},
		on_btn_save_page4 : function(e) {

		},

		__createStepsTabView : function() {
			var tabView = new qx.ui.tabview.TabView();

			// create page1
			this.__page1 = new qx.ui.tabview.Page("Step 1");
			this.__page1.setLayout(new qx.ui.layout.Canvas());
			this.__page1.setWidth(250);
			this.__page1.setHeight(200);

			this.__btn_cancel_page1 = new qx.ui.form.Button("Cancel");
			this.__btn_next_page1 = new qx.ui.form.Button("Next");
			this.__btn_cancel_page1.setWidth(90);
			this.__btn_next_page1.setWidth(90);
			this.__page1.add(this.__btn_cancel_page1);
			this.__page1.add(this.__btn_next_page1);

			// create page2
			this.__page2 = new qx.ui.tabview.Page("Step 2");
			this.__page2.setLayout(new qx.ui.layout.Canvas());
			this.__page2.setWidth(250);
			this.__page2.setHeight(200);

			this.__btn_cancel_page2 = new qx.ui.form.Button("Cancel");
			this.__btn_back_page2 = new qx.ui.form.Button("Back");
			this.__btn_next_page2 = new qx.ui.form.Button("Next");

			this.__btn_cancel_page2.setWidth(90);
			this.__btn_back_page2.setWidth(90);
			this.__btn_next_page2.setWidth(90);
			this.__page2.add(this.__btn_cancel_page2);
			this.__page2.add(this.__btn_back_page2);
			this.__page2.add(this.__btn_next_page2);

			// create page3
			this.__page3 = new qx.ui.tabview.Page("Step 3");
			this.__page3.setLayout(new qx.ui.layout.Canvas());
			this.__page3.setWidth(250);
			this.__page3.setHeight(200);

			this.__btn_cancel_page3 = new qx.ui.form.Button("Cancel");
			this.__btn_back_page3 = new qx.ui.form.Button("Back");
			this.__btn_next_page3 = new qx.ui.form.Button("Next");

			this.__btn_cancel_page3.setWidth(90);
			this.__btn_back_page3.setWidth(90);
			this.__btn_next_page3.setWidth(90);
			this.__page3.add(this.__btn_cancel_page3);
			this.__page3.add(this.__btn_back_page3);
			this.__page3.add(this.__btn_next_page3);

			// create page4
			this.__page4 = new qx.ui.tabview.Page("Step 4");
			this.__page4.setLayout(new qx.ui.layout.Canvas());
			this.__page4.setWidth(250);
			this.__page4.setHeight(200);

			tabView.add(this.__page1);
			tabView.add(this.__page2);
			tabView.add(this.__page3);
			tabView.add(this.__page4);

			return tabView;
		}
	}

});