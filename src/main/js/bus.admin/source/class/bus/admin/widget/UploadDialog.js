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
 * Диалоговое окно для загрузки файлов.
 */
qx.Class.define("bus.admin.widget.UploadDialog", {

			extend : qx.ui.core.Widget,

			members : {
				/**
				 * Создает в диалоговом окне html контент для загрузки файлов.
				 * @return {var} Html элемент
				 */
				_createContentElement : function() {
					return new qx.html.Element("input", {
								overflowX : "hidden",
								overflowY : "hidden"
							}, {
								type : "file"
							});
				},

				/**
				 * Дает доступ к выбранным пользователем для загрузки  файлам
				 * @return {var} Объект для работы с файлами
				 */
				getFiles : function() {
					return this.getContentElement().getDomElement().files;
				}
			}

		});
