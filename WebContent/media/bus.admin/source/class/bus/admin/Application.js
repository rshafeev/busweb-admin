/* ************************************************************************

   Copyright:

   License:

   Authors:

************************************************************************ */

/* ************************************************************************

#asset(bus/admin/*)

************************************************************************ */

/**
 * This is the main application class of your custom application "bus.admin"
 */
qx.Class.define("bus.admin.Application",
{
  extend : qx.application.Standalone,



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __header: null,
    __tabs: null,


    /**
     * This method contains the initial application code and gets called 
     * during startup of the application
     * 
     * @lint ignoreDeprecated(alert)
     */
    main : function()
    {
      // Call super class
      this.base(arguments);
      
      // Enable logging in debug variant
      if (qx.core.Environment.get("qx.debug"))
      {
        // support native logging capabilities, e.g. Firebug for Firefox
        qx.log.appender.Native;
        // support additional cross-browser console. Press F7 to toggle visibility
        qx.log.appender.Console;
      }

      /*
      -------------------------------------------------------------------------
        Below is your actual application code...
      -------------------------------------------------------------------------
      */

      // Document is the application root
      var doc = this.getRoot();
      
      var dockLayout=new qx.ui.layout.Dock();
      var dockLayoutComposite = new qx.ui.container.Composite(dockLayout);
      doc.add(dockLayoutComposite, {edge:0});
      
      this.__header = new bus.admin.view.Header();
      dockLayoutComposite.add(this.__header, {edge: "north"});
      
      /*this.__tabs = new bus.admin.view.TabView();
      this.__tabs.set({
        minWidth: 800,
        padding: 15
      });
      scroll.add(this.__tabs);*/
    },
   
    getThemes: function() {
      return ([
        {"Indigo"  : "qx.theme.Indigo"},
        {"Modern"  : "qx.theme.Modern"},
        {"Simple"  : "qx.theme.Simple"},
        {"Classic" : "qx.theme.Classic"}
      ]);
    }
    
  }
});
