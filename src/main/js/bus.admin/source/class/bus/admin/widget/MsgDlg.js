
/**
 * @ignore(alert)
 * @lint ignoreDeprecated(alert) 
 */



qx.Class.define("bus.admin.widget.MsgDlg",
{
  extend: qx.ui.window.Window,

  statics : {
      info : function(message, caption){
        alert(message);
      },

      warn : function(caption, message){

      },

      error : function(caption, message){
         alert(message);
      }
  },

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