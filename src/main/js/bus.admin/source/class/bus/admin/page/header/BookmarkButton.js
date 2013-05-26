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
 * Кнопка(вкладка) переключения страницы
 */
 qx.Class.define("bus.admin.page.header.BookmarkButton", {
 	extend : qx.ui.form.RadioButton,

 	/**
 	 * @param  label {String}    Label кнопки
 	 * @param  pageKey {String}  Key страницы, которую нужно сделать активной после нажатия на текущую кнопку
 	 */
 	construct : function(label, pageKey) {
 		this.base(arguments);
 		this.setLabel(label);
 		this.__pageKey = pageKey;
 		this.addListener("click", this.__onClickButton, this);
 		this.setUserData("pageKey", pageKey);
 	},

 	members : {
 		/**
 		 * Key страницы, которую нужно сделать активной после нажатия на текущую кнопку
 		 * @type {String}
 		 */
 		__pageKey : null,

 		/**
 		 * Обработчик нажатия на кнопку
 		 */
 		__onClickButton : function() {
 			this.debug("execute __onClickButton()");
 			if (this.isValue() == true){
 				var presenter  = qx.core.Init.getApplication().getPresenter();
 				qx.core.Init.getApplication().setWaitingWindow(true);
 				var callback = function(e){
 					qx.core.Init.getApplication().setWaitingWindow(false);
 				}
 				presenter.selectPageTrigger(this.__pageKey, callback, this);
 			}
 			
 		}
 	}

 });
