/*************************************************************************
 *
 * Copyright:
 * Bus.Admin-lib is copyright (c) 2012, {@link http://ways.in.ua} Inc. All Rights Reserved. 
 *
 * License:
 * Bus.Admin-lib is free software, licensed under the MIT license. 
 * See the file {@link http://api.ways.in.ua/license.txt license.txt} in this distribution for more details.
 *
 * Authors:
 * Roman Shafeyev (rs@premiumgis.com)
 *
 *************************************************************************/

/*
 * #asset(bus/admin/images/*)
 */

/**
 * Диалоговое окно для создания/ редактироания станции.
 */
 qx.Class.define("bus.admin.mvp.view.stations.CUStationForm", {
 	extend : bus.admin.mvp.view.stations.StationForm,

 	/**
 	 * @param  presenter   {bus.admin.mvp.presenter.StationsPresenter}  Presenter   
 	 * @param  stationModel   {bus.admin.mvp.model.StationModelEx}     Модель станции.
 	 * @param  isChangeDlg {Boolean}  Тип окна. True - диалоговое окно для редактирования ранее созданной станции. 
 	 *                                False - диалоговое окнго создания новой станции.
 	 */
 	 construct : function(presenter, stationModel, isChangeDlg) {
 	 	this.__presenter = presenter;
 	 	var langsModel = presenter.getDataStorage().getLangsModel();
 	 	var cityModel = presenter.getDataStorage().getSelectedCity();
 	 	this.base(arguments, stationModel, langsModel, cityModel, isChangeDlg);
 	 	this.addListener("prepared_model", this.__onPreparedModel, this);
 	 },

 	 members : {
 		/**
 		 * Presenter
 		 * @type {bus.admin.mvp.presenter.StationsPresenter}
 		 */
 		 __presenter : null,

 		/**
 		 * Обработчик события нажатия на кнопку "Save" или "Cancel". В аргументах события присутствует модель станции.
         * @param  e {qx.event.type.Data} Данные события. Структуру свойств смотрите в описании события.
         */
         __onPreparedModel : function(e) {
         	this.debug("execute __onPreparedModel event listener.");
         	var newStationModel = e.getData().station;
         	if(newStationModel == null || e.getData().cancel == true){
         		this.close();
         		return;
         	}
         	qx.core.Init.getApplication().setWaitingWindow(true);
         	var callback = qx.lang.Function.bind(function(data) {
         		qx.core.Init.getApplication().setWaitingWindow(false);
         		if (data.error == true) {
         			var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
         			this.tr("Error! Can not save station. Please, check input data.");
         			bus.admin.widget.MsgDlg.info(msg);
         			return;
         		}
         		this.close();
         	}, this);
         	console.debug(newStationModel);
         	if(this._isChangeDlg == true)
         	{
         		this.__presenter.updateStationTrigger(this._stationModel, newStationModel, callback, this);
         	}
         	else
         	{
         		this.__presenter.insertStationTrigger(newStationModel, callback, this);
         	}
         	
         }

     }

 });