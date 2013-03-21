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
 * Класс-родитель для всех страниц
 */
 qx.Class.define("bus.admin.mvp.view.AbstractPage", {
 	type : "abstract",

 	extend : qx.ui.container.Composite,

 	events : {
				/**
				 * Событие наступает после завершения загрузки страницы
				 */
				 "init_finished" : "qx.event.type.Event"
				},
				construct : function() {
					this.base(arguments);
					this.addListener("appear", this.__onAppear, this);
					this.setVisibility("hidden");
					this.addListenerOnce("init_finished", function() {
						this.setVisibility("visible");
					}, this);
				},
				properties : {
				/**
				 * Presenter страницы
				 * @type {Object}
				 */
				 presenter : {
				 	nullable : true
				 },

				/**
				 * Название страницы
				 * @type {String}
				 */
				 name : {
				 	nullable : true
				 }

				},
				members : {
					/**
					 * Равняется истине до тех пор, пока не произойдет первое отображение виджета данной страницы
					 * @type {Boolean}
					 */
					__firstShow : true,

 					/**
 		 			 * Обработчик события вызывается при появлении виджета данной страницы.
 		 			 * @param e {qx.event.type.Event} Объект события.
 		 			 */
					__onAppear : function(e) {
						var visible = this.isVisible();
						this.debug("visible: " + visible.toString());
						if(visible == true && this.__firstShow == false){
							qx.core.Init.getApplication().setWaitingWindow(true);
							var callback = qx.lang.Function.bind(function(data) {
								qx.core.Init.getApplication().setWaitingWindow(false);
								if (data.error == true) {
									var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
									this.tr("Error! Can not refresh page. Please, try again.");
									bus.admin.widget.MsgDlg.info(msg);
									return;
								}
							}, this);
							this.getPresenter().refreshTrigger(callback);
						}
						this.__firstShow = false;
					}
				}
			});
