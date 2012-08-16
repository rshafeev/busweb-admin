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

/* ************************************************************************

************************************************************************ */

qx.Class.define("bus.admin.widget.MessageDialog",
{
  extend: qx.ui.window.Window,

  construct: function(text,caption)
  {
    this.base(arguments,"caption");
    this.setModal(true);
    qx.core.Init.getApplication().getRoot().addListener("resize",function(){
    	this.center();
    	
    },this);
    var label = new qx.ui.basic.Label(text);
    this.add(label);
    this.center();
  },

  members:
  {
	
  }
});