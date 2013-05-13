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
 * @ignore(alert)
 * @lint ignoreDeprecated(alert) 
 */


/**
 * Message box окно
 */
qx.Class.define("bus.admin.widget.MsgDlg",
{
  extend: qx.ui.window.Window,

  statics : {

      /**
       * Открыает информационное диалоговое окно
       * @param  message {String}  Текст сообщения 
       * @param  caption {String} Заголовок диалогового окна.
       */
      info : function(caption, message){
        alert(message);
      },

      /**
       * Открыаеn окно предупреждения.
       * @param  message {String}  Текст сообщения 
       * @param  caption {String} Заголовок диалогового окна.
       */
      warn : function(caption, message){
         alert(message);
      },

      /**
       * Открыает диалоговое окно, оповещающее об ошибке.
       * @param  message {String}  Текст сообщения 
       * @param  caption {String} Заголовок диалогового окна.
       */
      error : function(caption, message){
         alert(message);
      }
  },

  /**
   * @param  text {String}  Текст сообщения 
   * @param  caption {String} Заголовок диалогового окна.
   */
  construct: function(caption, text)
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