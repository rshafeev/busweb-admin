/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt|license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/**
 * @ignore(GlobalOptions)
 */

/**
 #asset(bus/admin/images/*)
 #asset(bus/admin/css/app.css)
 #asset(bus/admin/css/ContextMenu.css)
 #asset(bus/admin/js/app.js)
 #asset(bus/admin/js/ContextMenu.js)
 */

/**
 * This is the main application class of your custom application "bus.admin"
 */
 qx.Class.define("bus.admin.Application", {
 	extend : qx.application.Standalone,

	/*
	 * ****************************************************************************
	 * MEMBERS
	 * ****************************************************************************
	 */

	 properties : {
	 	presenter : {
	 		nullable : true
	 	},
	 	modelsContainer : {
	 		nullable : true
	 	}

	 },
	 members : {
	 	__header : null,
	 	__tabs : null,
	 	__scroll : null,
	 	__history : null,
	 	__pageContainer : null,
	 	__loadingIndicator : null,
	 	__waitingWindow : null,
	 	__blocker : null,
		/**
		 * This method contains the initial application code and gets called
		 * during startup of the application
		 * 
		 * @lint ignoreDeprecated(alert)
		 */

		 _setGlobalOptions : function(){
		 	var globalOptions = GlobalOptions();
		 	if(globalOptions!= undefined){
		 		bus.admin.AppProperties.ContextPath = globalOptions.contextPath;
		 		bus.admin.AppProperties.LOCALE_LANGUAGE = globalOptions.lang;
		 		console.debug("Global options: ", globalOptions );
		 	}

		 },

		 main : function() {
			// Call super class
			this.base(arguments);
			this.getRoot().setVisibility("hidden");

			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug") == true) {
				// support native logging capabilities, e.g. Firebug for
				// Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to
				// toggle visibility
				qx.log.appender.Console;
				console.debug("qx.debug = ON");

			}
			else
			{
				console.debug = function(){}
				qx.log.Logger.setLevel("error");
			}

			this._setGlobalOptions();

			var localeManager = qx.locale.Manager.getInstance();
			localeManager.setLocale(bus.admin.AppProperties.LOCALE_LANGUAGE);
			/*
			var urlModel = new bus.admin.mvp.model.URLModel();
			urlModel.parseURL();
			var locale = urlModel.getParameter("lang");
			if (locale) {
				localeManager.setLocale(locale);
			} else {
				

			}
			*/
			this.initWidgets();
			this.__initBookmarkSupport();

		},

		getThemes : function() {
			return ([{
				"Indigo" : "qx.theme.Indigo"
			}, {
				"Simple" : "qx.theme.Simple"
			}]);
		},

		// ***************************************************
		// HISTORY SUPPORT
		// ***************************************************

		/**
		 * Back button and bookmark support
		 */
		 __initBookmarkSupport : function() {
		 	this.__history = qx.bom.History.getInstance();
		 	this.__history.addListener("changeState", this.__onHistoryChanged,
		 		this);

			// load current page 
			var pageName = null;
			if (this.__history.getState().match('page-*')) {
				pageName = this.__history.getState().substr(5);

			} else {
				pageName = 'Cities';
			}
			var pageButton = this.__header.getPagesGroup()
			.getPageButtonByURL(pageName);

			if (pageButton != null) {
				// when page was loaded, app must start to load data 
				pageButton.addListener("load_page_finished", function() {
					// show application
					this.debug("listener: load_page_finished()");
					if (qx.core.Init.getApplication().getRoot().isVisible() == false) {
						qx.core.Init.getApplication().getRoot()
						.setVisibility("visible");
					}
				}, this);

				this.__header.getPagesGroup().selectPageByObj(pageButton);
			}

		},

		/**
		 * Handler for changes of the history.
		 * 
		 * @param e
		 *            {qx.event.type.Data} Data event containing the history
		 *            changes.
		 */
		 __onHistoryChanged : function(e) {
		 	this.debug("__onHistoryChanged : execute");
		 	var state = new qx.type.BaseString(e.getData());
		 	if (state.match('page-*')) {
		 		this.__header.getPagesGroup().selectPageByURL(state.substr(5));

		 	} else if (state == '') {
		 		this.__header.getPagesGroup().selectPageByURL('Cities');
		 	}

		 },

		 getPageContainer : function() {
		 	this.debug("call getPageContainer");
		 	return this.__pageContainer;
		 },

		 getLoadingIndicator : function() {
		 	return this.__loadingIndicator;
		 },

		 getHistoryObj : function() {
		 	return this.__history;
		 },

		 setWaitingWindow : function(visiable) {
		 	if (visiable == false) {
		 		this.getRoot().remove(this.__waitingWindow);
				//this.__pageContainer.setEnabled(true);
				//this.__header.setEnabled(true);
				this.__waitingWindow = null;
				this.__blocker.unblock();
			} else if (this.__waitingWindow == null) {
				this.__waitingWindow = new qx.ui.basic.Image("bus/admin/images/loading.gif");
				this.__waitingWindow.setMarginTop(-33);
				this.__waitingWindow.setMarginLeft(-33);
				this.__waitingWindow.setZIndex(150000000);
				this.getRoot().add(this.__waitingWindow, {
					left : "50%",
					top : "50%"
				});
				if (this.__blocker == null)
					this.__blocker = new qx.bom.Blocker();
				this.__blocker.block();
			}
		},
		initWidgets : function() {
			// Document is the application root
			var doc = this.getRoot();
			// bus.admin.mvp.presenter.GlobalPresenter
			var dockLayout = new qx.ui.layout.Dock();
			var dockLayoutComposite = new qx.ui.container.Composite(dockLayout);
			doc.add(dockLayoutComposite, {
				edge : 0
			});

			this.__pageContainer = new qx.ui.container.Stack();

			var loadingImage = new qx.ui.basic.Image("bus/admin/images/loading.gif");
			loadingImage.setMarginTop(-33);
			loadingImage.setMarginLeft(-33);
			this.__loadingIndicator = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
			this.__loadingIndicator.add(loadingImage, {
				left : "50%",
				top : "50%"
			});
			this.__pageContainer.add(this.__loadingIndicator);

			this.__header = new bus.admin.page.Header();

			dockLayoutComposite.add(this.__header, {
				edge : "north"
			});
			dockLayoutComposite.add(this.__pageContainer, {
				edge : "center"
			});
		}
	}
});
