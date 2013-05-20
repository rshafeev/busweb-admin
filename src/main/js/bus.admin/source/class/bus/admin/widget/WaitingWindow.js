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
 * Индикатор ожидания
 */
 qx.Class.define("bus.admin.widget.WaitingWindow",
 {
  extend: qx.core.Object,

  /**
   * @param  isCalculateVisible {Boolean}  Текст сообщения 
   */
   construct: function(isCalculateVisible)
   {
    this.base(arguments,"caption");
    if(isCalculateVisible != undefined)
      this.__isCalculateVisible = isCalculateVisible;
    this.__blocker = new qx.bom.Blocker();
  },

  members:
  {
    __indicator : null,

    __isCalculateVisible : false,
    
    __visible : false,

    __calc : 0,

    __blocker : null,



    __showIndicator : function(val){
      if(val == this.__visible)
        return;
      if(val == false && this.__indicator != undefined){
        qx.core.Init.getApplication().getRoot().remove(this.__indicator);
        this.__indicator = null;
        this.__blocker.unblock();
        this.__visible = false;
      }else{
        this.__indicator = new qx.ui.basic.Image("bus/admin/images/loading.gif");
        this.__indicator.setMarginTop(-33);
        this.__indicator.setMarginLeft(-33);
        this.__indicator.setZIndex(150000000);
        qx.core.Init.getApplication().getRoot().add(this.__indicator, {
          left : "50%",
          top : "50%"
        });
        this.__blocker.block();
        this.__visible = true;
      }
    },

    setVisible : function(val){
      if(this.__isCalculateVisible == true){
        this.__calc = val == true ? (this.__calc + 1) : this.__calc;
        this.__calc = (val == false && this.__calc > 0) ? (this.__calc - 1) : this.__calc;
        if(this.__calc == 0 && this.__visible == true){
         this.__showIndicator(false);
       }
       else
        if(this.__calc > 0 && this.__visible == false){
          this.__showIndicator(true);
        }        
      }else{
        this.__showIndicator(val);
      }
      
    }
  }
});