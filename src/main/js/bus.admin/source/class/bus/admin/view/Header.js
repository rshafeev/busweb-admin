/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Jonathan Weiß (jonathan_rass)
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * The Application's header
 */

qx.Class.define("bus.admin.view.Header",
		{
	  extend : qx.ui.container.Composite,

	  /**
	   * @lint ignoreUndefined(qxc)
	   */
	  construct : function()
	  {
	    this.base(arguments, new qx.ui.layout.HBox());
	    this.setAppearance("app-header");

	        
	    // Build select-box
	    var select = new qx.ui.form.SelectBox("Theme");
	    qx.core.Init.getApplication().getThemes().forEach(function(theme) {
	      var name = qx.Bootstrap.getKeys(theme)[0];
	      var item = new qx.ui.form.ListItem(name + " Theme");
	      item.setUserData("value", theme[name]);
	      select.add(item);

	      var value = theme[name];
	      if (value == qx.core.Environment.get("qx.theme")) {
	        select.setSelection( [item] );
	      }
	    });

	    select.setFont("default");

	    // Find current theme from URL search param
	    var currentThemeItem = select.getSelectables().filter(function(item) {
	      if (window.location.search) {
	        return window.location.search.match(item.getUserData("value"));
	      }
	    })[0];

	    // Set current theme
	    if (currentThemeItem) {
	      select.setSelection([currentThemeItem]);
	    }

	    select.setTextColor("black");

	    select.addListener("changeSelection", function(evt) {
	      var selected = evt.getData()[0];
	      var url = "app?qx.theme=" + selected.getUserData("value");
	      window.location = url;
	    });
	    //////////////
	    
	    // EVIL HACK
	    this.addListener("appear", function() {
	      var el = this.getContentElement();
	      el.setStyle("top", (parseInt(el.getStyle("top")) + 1) + "px");
	    }, this);
	    // /////////
	    
	    this.__pagesGroup = new bus.admin.view.PagesGroup();

	    this.add(new qx.ui.basic.Label(this.tr("Bus.admin")));
	    this.add(new qx.ui.core.Spacer(30));
	    
	    this.add(this.__pagesGroup);
	    
	    this.add(new qx.ui.core.Spacer(), { flex : 1 });
	  
	    this.add(new qx.ui.core.Spacer, {flex : 1});
	    this.add(select);
	    this.add(new qx.ui.core.Spacer, {width: "2%"});
	    
	    
	    
	  },


	  properties : {
	    /** The mode the header should be currently in. */
	    mode : {
	      event : "changeMode",
	      check : "String",
	      init : "RIA",
	      apply : "_applyMode"
	    }
	  },


	  members : {
	    __pagesGroup : null,


	    // property apply
	    _applyMode : function(value) {
	      if (this.__group.getModelSelection().getItem(0) != value) {
	        this.__group.setModelSelection([value]);
	      }
	    },


	    /**
	     * Enables or disabled the button for the given mode.
	     * @param mode {String} the mode to change the enabled state.
	     * @param value {boolean} <code>true</true> if the button should be enabled.
	     */
	    setEnabledMode : function(mode, value) {
	      for (var i=0; i < this.__buttons.length; i++) {
	        if (this.__buttons[i].getModel() == mode) {
	          var button = this.__buttons[i];
	          break;
	        }
	      };

	      var label = value ? this.tr("Mobile") : this.tr("Mobile (Webkit only)");
	      button.setEnabled(value);
	      button.setLabel(label);
	    },
	    
	    getPagesGroup : function(){
	    	return this.__pagesGroup;
	    }
	  }
	});
