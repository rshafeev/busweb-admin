/*******************************************************************************
 * 
 * qooxdoo - the new era of web development
 * 
 * http://qooxdoo.org
 * 
 * Copyright: 2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
 * 
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 * 
 * Authors: Jonathan Weiß (jonathan_rass) Tristan Koch (tristankoch)
 * 
 ******************************************************************************/

/**
 * The Application's header
 */

 qx.Class.define("bus.admin.page.Header", {
 	extend : qx.ui.container.Composite,

			/**
			 * @lint ignoreUndefined(qxc)
			 */
			 construct : function() {
			 	this.base(arguments, new qx.ui.layout.HBox());
			 	this.setAppearance("app-header");

				// EVIL HACK
				this.addListener("appear", function() {
					var el = this.getContentElement();
					el.setStyle("top",(parseInt(el.getStyle("top")) + 1) + "px");
				}, this);
				// /////////

				this.__bookmarksGroup = new bus.admin.page.header.BookmarksGroup();

				this.add(new qx.ui.basic.Label(this.tr("CityWays Admin Tool")));
				this.add(new qx.ui.core.Spacer(30));
				this.add(this.__bookmarksGroup);
				this.add(new qx.ui.core.Spacer(), {
					flex : 1
				});
				this.add(new qx.ui.core.Spacer, {
					flex : 1
				});
				this.add(new qx.ui.core.Spacer, {
					width : "2%"
				});
				this.__createLocaleBox();
				this.debug("Header was initialized");
			},

			members : {
				__bookmarksGroup : null,

				__createLocaleBox : function() {
					// Build select-box
					var select = new qx.ui.form.SelectBox("Locale");
					var items = [];
					var item1 = new qx.ui.form.ListItem("English");
					var item2 = new qx.ui.form.ListItem("Русский");
					item1.setUserData("value", "en");
					item1.setUserData("fullValue", "en_US");
					item2.setUserData("value", "ru");
					item2.setUserData("fullValue", "rus_RU");

					select.add(item1);
					select.add(item2);
					items.push(item1);
					items.push(item2);

					select.setFont("default");
					select.setTextColor("black");
					select.setMaxHeight(25);

					var locale = qx.locale.Manager.getInstance().getLocale();
					for (var i = 0; i < items.length; i++) {
						if (items[i].getUserData("value") == locale) {
							select.setSelection([items[i]]);
							break;
						}
					}

					select.addListener("changeSelection", function(evt) {
						var selected = evt.getData()[0];
						var locale = selected.getUserData("value");
						var urlModel = new bus.admin.mvp.model.URLModel();
						urlModel.parseURL();

						urlModel.setParameter("lang", selected.getUserData("fullValue"));
						window.location = urlModel.getURL();

					}, this);
					this.add(select);

					var btnLogout = new qx.ui.basic.Label("logout");
					btnLogout.addListener("click", function(evt) {
						var contextPath  = qx.core.Init.getApplication().getDataStorage().getContextPath();
						window.location = contextPath + "j_spring_security_logout";
					}, this);	
					this.add(new qx.ui.core.Spacer(10));
					btnLogout.setCursor("pointer");
					btnLogout.setFont("default");
					btnLogout.setAppearance("app-header-label");
					this.add(btnLogout);		
				}
			}
		});
