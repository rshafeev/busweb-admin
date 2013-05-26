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
 #asset(bus/admin/js/app.js)
 */

/**
 * Главный класс js приложения
 */
 qx.Class.define("bus.admin.Application", {
 	extend : qx.application.Standalone,

 	properties : {
 		/**
 		 * Глобальный презентер приложения
 		 */
 		presenter : {
 			nullable : true,
 			check : "bus.admin.mvp.presenter.GlobalPresenter"
 		}
 	},
 	members : {

 		__header : null,
 		__tabs : null,
 		__scroll : null,

	 	/**
	 	 * Объект для работы с url параметрами после #
	 	 * @type {qx.bom.History}
	 	 */
	 	 __history : null,

	 	/**
	 	 * Контайнер страниц
	 	 * @type {bus.admin.page.PagesContainer}
	 	 */
	 	 __pagesContainer : null,

	 	 /**
	 	  * Индикатор ожидания
	 	  * @type {bus.admin.widget.WaitingWindow}
	 	  */
	 	 __waitingWindow : null,

		 /**
		  * Main функция
		  */
		  main : function() {
			// Call super class
			this.base(arguments);
			
			// Enable logging in debug variant
			if (qx.core.Environment.get("qx.debug") == true) {
				// support native logging capabilities, e.g. Firebug for Firefox
				qx.log.appender.Native;
				// support additional cross-browser console. Press F7 to toggle visibility
				qx.log.appender.Console;
				console.debug("qx.debug = ON");

			}
			else
			{
				console.debug = function(){}
				qx.log.Logger.setLevel("error");
			}

			this.__setGlobalOptions();
			this.__initWidgets();

			this.__history = qx.bom.History.getInstance();
			this.__history.addListener("changeState", this.__onBookmarkChanged,	this);
			var historyState = this.__history.getState();
			this.__selectPage(historyState);

		},

		/**
		 * Возвращает глобальное хранилище приложения
		 * @return {bus.admin.mvp.storage.GlobalDataStorage} Хранилище
		 */
		getDataStorage : function(){
			return this.getPresenter().getDataStorage();
		},

	 	/**
	 	 * Задает такие опции приложения, как локаль, ContextPath. Эти данные берутся из нешней функции  GlobalOptions()
	 	 */
	 	 __setGlobalOptions : function(){

	 	 	var presenter = new bus.admin.mvp.presenter.GlobalPresenter();
	 	 	var dataStorage  = presenter.getDataStorage();
	 	 	var globalOptions = GlobalOptions();
	 	 	this.debug("Global opts: ", globalOptions);
	 	 	var localeManager = qx.locale.Manager.getInstance();
	 	 	if(globalOptions!= undefined){
	 	 		dataStorage.setContextPath(globalOptions.contextPath);
	 	 		localeManager.setLocale(globalOptions.lang);
	 	 	}else{
	 	 		localeManager.setLocale("en");
	 	 	}
	 	 	this.setPresenter(presenter);
	 	 },

		/**
		 * Обработчик изменения текущей страницы 
		 * @param  e {qx.event.type.Data} Данные события. 
		 */
		 __onBookmarkChanged : function(e) {
		 	this.debug("__onBookmarkChanged : execute");
		 	var state = new qx.type.BaseString(e.getData());
		 	this.__selectPage(state);
		 },

		 /**
		  * Делает активной ту страницу, key которой сохранен в хранилище браузера или
		  * в глобальном хранилище приложения
		  * @param  historyState {String} Параметры url
		  */
		 __selectPage : function(historyState){
		 	var pageKey = this.getDataStorage().getLastSelectedPageKey();
		 	var historyPageKey = null;
		 	if (historyState.match('page-*')) {
		 		historyPageKey = historyState.substr(5);
		 	} 

		 	if(this.getDataStorage().getCurrentPageKey() != null && 
		 		this.getDataStorage().getCurrentPageKey() == historyPageKey)
		 	{
		 		return;
		 	}

		 	if(historyPageKey != null){
		 		pageKey = historyPageKey;
		 	}
		 	qx.core.Init.getApplication().setWaitingWindow(true);
		 	var callback = function(e){
		 		qx.core.Init.getApplication().setWaitingWindow(false);
		 	}
		 	this.debug("load key: ", pageKey);
		 	this.getPresenter().selectPageTrigger(pageKey, callback, this);
		 },

		 /**
		  * Устанавливает индикатор ожидания
		  * @param  visible {Boolean}  Видимость индикатора
		  */
		 setWaitingWindow : function(visible) {
		 	if(this.__waitingWindow == undefined){
		 		this.__waitingWindow = new bus.admin.widget.WaitingWindow(true);
		 	}
		 	this.__waitingWindow.setVisible(visible);
		 },

		 /**
		  * Инициализация дочерних виджетов
		  */
		 __initWidgets : function() {
		 	this.getRoot().setVisibility("hidden");
		 	var doc = this.getRoot();
		 	var dockLayout = new qx.ui.layout.Dock();
		 	var dockLayoutComposite = new qx.ui.container.Composite(dockLayout);
		 	doc.add(dockLayoutComposite, {
		 		edge : 0
		 	});
		 	this.__header = new bus.admin.page.Header();
		 	dockLayoutComposite.add(this.__header, {
		 		edge : "north"
		 	});
		 	this.__pagesContainer = new bus.admin.page.PagesContainer();
		 	this.debug("add __pagesContainer");
		 	dockLayoutComposite.add(this.__pagesContainer, {
		 		edge : "center"
		 	});

		 	this.getPresenter().addListener("select_page", function(e) {
		 		this.debug("listener: load_page_finished()");
		 		if (qx.core.Init.getApplication().getRoot().isVisible() == false) {
		 			qx.core.Init.getApplication().getRoot().setVisibility("visible");
		 		}
		 		qx.bom.History.getInstance().addToHistory("page-" + e.getData().pageKey);
		 	}, this);


		 }
		}
	});
