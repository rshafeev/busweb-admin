/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Tristan Koch (tristankoch)

************************************************************************ */

qx.Class.define("bus.admin.view.TabView",
{
  extend : qx.ui.tabview.TabView,
 

  construct : function()
  {
    this.base(arguments);

    this.init();
    this.addListener("changeSelection", this.__rememberCurrentTab, this);
    this.debug("TabView consctuctor was finished");
    
    
    
    
  },

  members :
  {
	__is_created: null,
    init: function() {
      var controls, classname;
      // Window
      classname = "bus.admin.pages.Window";
      controls = {disabled: true};
      var win = new bus.admin.view.TabPage("Window", classname, controls);
      this.add(win);
      
      // Basic
      classname = "bus.admin.pages.Basic";
      controls = {disabled: true};
      var basic = new bus.admin.view.TabPage("Basic", classname, controls);
      this.add(basic);
      
    },
    selectTab : function(tab_name){

    	this.debug("tab_name:" +tab_name);
    	
    	var currentTab = this.getSelection()[0];
    	var newTab = new qx.type.Array().append(this.getChildren()).filter(function(tab) {
            return tab.getLabel() == tab_name;
        })[0];
    	if (newTab) {
    		this.debug("tab_name:" + newTab.getLabel());
    	    this.setSelection([newTab]);
    	}
    },
    __rememberCurrentTab: function(e) {
    }

  }
});
