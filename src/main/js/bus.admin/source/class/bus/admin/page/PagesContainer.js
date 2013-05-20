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
 * Контейнер отображения страниц.
 */
 qx.Class.define("bus.admin.page.PagesContainer", {

 	extend : qx.ui.container.Stack,

 	construct : function() {
    this.base(arguments);
    this.__initWidgets();
    var presenter  =  qx.core.Init.getApplication().getPresenter();
    presenter.addListener("select_page", this.__onSelectPage, this);
  },

  properties : {

  },


  members : {
      /**
       * Текущая страница
       * @type {bus.admin.mvp.view.AbstractPage}
       */
       __currPage : null,

      /**
       * Инициализация дочерних выджетов
       */
       __initWidgets : function(){
         this.debug("execute __initWidgets()");
         var loadingImage = new qx.ui.basic.Image("bus/admin/images/loading.gif");
         loadingImage.setMarginTop(-33);
         loadingImage.setMarginLeft(-33);
         var loadingIndicator = new qx.ui.container.Composite(new qx.ui.layout.Canvas());
         loadingIndicator.add(loadingImage, {
          left : "50%",
          top : "50%"
        });
         this.add(loadingIndicator);

       },


       __onSelectPage : function(e){
        var page = e.getData().page;
        this.setSelectedPage(page);
      },

      /**
       * Задает страницу, которая будет видна пользователю.
       * @param page {bus.admin.mvp.view.AbstractPage} Страница
       */ 
       setSelectedPage : function(page){
        if(this.indexOf(page) == -1 ){
          this.add(page);
        }
        this.setSelection([page]);
        this.__currPage = page;
      }

    }
  });
