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
 
 /*
  #use(bus.admin.mvp.view.Cities) 
  #use(bus.admin.mvp.view.Stations)
  #use(bus.admin.mvp.view.Routes)
  */

/**
 * Глобальный презентер приложения.
 */
 qx.Class.define("bus.admin.mvp.presenter.GlobalPresenter", 
 {
 	extend : qx.core.Object,
 	events : {

 		/**
 		 * Событие наступает после выбора страницы, которую нужно отобразить пользователю.
 		 * <br><br>Свойства возвращаемого объекта: <br> 		 
 		 * <pre>
 		 * <ul>
 		 * <li> page            Страница, {@bus.admin.mvp.view.AbstractPage CitiesModel}. </li>
 		 * <li> pageKey         Код страницы, String. </li>
 		 * <li> error           Наличие ошибки при выполнении события, Boolean. </li>
 		 * <li> errorCode       Код ошибки, String. </li>
 		 * <li> errorRemoteInfo Описание ошибки с сервера, String. </li>
 		 * <li> sender          Объект, который вызвал триггер, Object </li>
 		 * <ul>
 		 * </pre>
 		 */
 		 "select_page"     : "qx.event.type.Data"

 		},

 		construct : function() {
 			this.base(arguments);
 			var dataStorage = new bus.admin.mvp.storage.GlobalDataStorage();
 			this.initDataStorage(dataStorage);
 		},

 		properties : {
 		/**
 		 * Глобальное хранилище приложения
 		 * @type {bus.admin.mvp.storage.GlobalDataStorage}
 		 */
 		 dataStorage : {
 		 	deferredInit : true
 		 }
 		},

 		members : {

 			/**
 			 * Триггер вызывается для отображения страницы с заданным кодом
 			 * @param  pageKey {String} Код страницы. Возможные значения: "Cities", "Routes", ...
 			 * @param  callback {Function}  callback функция
 			 * @param  sender {Object}      Объект, который вызвал триггер
 			 */
 			 selectPageTrigger : function(pageKey, callback, sender){
 			 	this.debug("execute selectPageTrigger()");
 			 	var pages = this.getDataStorage().getLoadedPages();
 			 	var page = pages[pageKey];
 			 	this.getDataStorage().setCurrentPageKey(pageKey);
 			 	if(page !=  undefined){
 			 		var args = {
 			 			page : pages[pageKey],
 			 			pageKey : pageKey,
 			 			sender : sender,
 			 			error : false
 			 		};
 			 		
 			 		this.fireDataEvent("select_page", args);
 			 		if(callback != undefined)
 			 			callback(args);
 			 	}
 			 	else
 			 	{
 			 		var classname = "bus.admin.mvp.view." + pageKey;
 			 		var part = classname.split(".").pop().toLowerCase();
 			 		qx.Part.require(part, function() 
 			 		{
 			 			this.debug("loaded: " + classname);
 			 			var clazz = qx.Class.getByName(classname);
 			 			page = new clazz();
 			 			page.initialize();

						// Hotfix for browser bug [#BUG #4666]
						if (qx.core.Environment.get("browser.name") == "opera"
							&& qx.core.Environment.get("browser.version") == "11.0") 
						{
							var app = qx.core.Init.getApplication();
							var scroll = app.getScroll().getChildControl("pane").getContentElement().getDomElement();
							page.addListenerOnce("appear", function() {
								if (scroll) {
									scroll.scrollTop = 0;
								}
							});

						}
						pages[pageKey] = page;
						var args = {
							page : page,
							sender : sender,
							pageKey : pageKey,
							error : false
						};
						this.fireDataEvent("select_page", args);

						if(callback != undefined)
							callback(args);

					}, this);
 			 	}
 			 	


 			 }


 			}
 		});
