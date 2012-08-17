/*******************************************************************************
 * 
 * qooxdoo - the new era of web development
 * 
 * http://qooxdoo.org
 * 
 * Copyright: 2004-2010 1&1 Internet AG, Germany, http://www.1und1.de
 * 
 * License: LGPL: http://www.gnu.org/licenses/lgpl.html EPL:
 * http://www.eclipse.org/org/documents/epl-v10.php See the LICENSE file in the
 * project's top-level directory for details.
 * 
 * Authors: Tristan Koch (tristankoch)
 * 
 ******************************************************************************/
/*
  #use(bus.admin.mvp.view.Cities) 
  #use(bus.admin.mvp.view.Stations)
  #use(bus.admin.mvp.view.Routes)
 */

qx.Class.define("bus.admin.page.header.PageButton", {
	extend : qx.ui.form.RadioButton,

	include : bus.admin.MControls,
	events : {
		"load_page_finished" : "qx.event.type.Event"
	},
	construct : function(label, classname, controls, viewContainer) {
		this.base(arguments);

		this.setLabel(label);
		this.__viewContainer = viewContainer;
		this.__controls = controls;
		this.__classname = classname;
		this.addListener("changeValue", this.__onClickButton);

	},

	members : {
		__page : null,
		__viewContainer : null,
		__controls : null,
		__classname : null,
		__onClickButton : function() {
			if (this.isValue() == true
					&& qx.core.Init.getApplication().getHistoryObj()) {
				this.selectPage();

			}
		},

		__loadPart : function() {
			var part = this.__classname.split(".").pop().toLowerCase();
			qx.Part.require(part, function() {
				// Finally, instantiate class
				var clazz = qx.Class.getByName(this.__classname);
				this.__page = new clazz();
				this.__page.addListenerOnce("init_finished", function() {
							this.fireEvent("load_page_finished");
						}, this);
				this.__page.initialize();
				// Add to page
				// this.add(pageContent, {top: 40, edge: 0});

				// Hotfix for browser bug [#BUG #4666]
				if (qx.core.Environment.get("browser.name") == "opera"
						&& qx.core.Environment.get("browser.version") == "11.0") {
					var scroll = qx.core.Init.getApplication().getScroll()
							.getChildControl("pane").getContentElement()
							.getDomElement();
					this.__page.addListenerOnce("appear", function() {
								if (scroll) {
									scroll.scrollTop = 0;
								}
							});

				}

				// Init controls for widgets of page
				this.__viewContainer.add(this.__page);
				this.__viewContainer.setSelection([this.__page]);
				this.__saveHistoryToUrl();

			}, this);
		},

		selectPage : function() {
			if (this.__page != null) {
				this.__viewContainer.setSelection([this.__page]);
				this.__saveHistoryToUrl();
			} else {
				this.__viewContainer.setSelection([qx.core.Init
						.getApplication().getLoadingIndicator()]);
				this.__loadPart();
			}

		},
		__saveHistoryToUrl : function() {
			this.debug("page:" + this.getLabel());
			qx.bom.History.getInstance()
					.addToHistory("page-" + this.getLabel());
		}
	}
});