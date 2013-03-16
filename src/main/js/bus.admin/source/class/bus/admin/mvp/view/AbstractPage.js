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

			}
		});
