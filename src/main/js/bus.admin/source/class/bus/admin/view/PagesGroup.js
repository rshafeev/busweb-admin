
qx.Class.define("bus.admin.view.PagesGroup",
{
	extend : qx.ui.form.RadioButtonGroup,
	include : [qx.ui.core.MContentPadding],
 
  construct : function()
  {
    this.base(arguments,new qx.ui.layout.HBox(1));
    this.init();
   
  },

  members :
  {
	__is_created: null,
    init: function() {
      var controls, classname;
      var pagesContainer = qx.core.Init.getApplication().getPageContainer();
      this.debug(pagesContainer);
      // Cities
      classname = "bus.admin.pages.Cities";
      controls = {disabled: true};
      var cities = new bus.admin.view.PageButton("Cities", classname, controls, pagesContainer);
      cities.set({	appearance: "modeButton"   });
      this.add(cities);
      
      // Stations
      classname = "bus.admin.pages.Stations";
      controls = {disabled: true};
      var stations = new bus.admin.view.PageButton("Stations", classname, controls, pagesContainer);
      stations.set({	appearance: "modeButton"   });
      this.add(stations);
      
      // Routes
      classname = "bus.admin.pages.Routes";
      controls = {disabled: true};
      var routes = new bus.admin.view.PageButton("Routes", classname, controls, pagesContainer);
      routes.set({	appearance: "modeButton"   });
      
      this.add(routes);
      
      
    },
    selectPage : function(page_name){

    	this.debug("page_name:" +page_name);
    	
    	var selectButton = new qx.type.Array().append(this.getChildren()).filter(function(btn) {
            return btn.getLabel() == page_name;
            
        })[0];
       if(selectButton){
    	   this.setSelection([selectButton]);
    	   selectButton.selectPage();
       }

    }


  }
});