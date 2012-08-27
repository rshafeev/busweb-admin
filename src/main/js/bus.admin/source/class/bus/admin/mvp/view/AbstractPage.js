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

qx.Class.define("bus.admin.mvp.view.AbstractPage", {
			type : "abstract",

			extend : qx.ui.container.Composite,
			events : {
				"init_finished" : "qx.event.type.Event"
			},
			construct : function() {
				this.base(arguments);
				this.setModelsContainer(qx.core.Init.getApplication()
						.getModelsContainer());
				this.setPresenter(qx.core.Init.getApplication().getPresenter());
			},
			properties : {
				modelsContainer : {
					nullable : true
				},
				presenter : {
					nullable : true
				}

			},
			members : {
				__name : null,

				setName : function(name) {
					this.__name = name;
				},

				getName : function() {
					return this.__name;
				}
			}
		});