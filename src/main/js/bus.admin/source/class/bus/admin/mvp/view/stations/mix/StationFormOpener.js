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
 
/**
 * Содержит функции для открытия диалогового окна редактирования/создания станции с дальнейшим оповещение презентера 
 * {@link bus.admin.mvp.presenter.StationsPresenter}.
 * 
 */
 qx.Mixin.define("bus.admin.mvp.view.stations.mix.StationFormOpener", {
 	construct : function() {
 	},
 	members : {

		  /**
		   * Создает и открывает диалоговое окно для редактирования станции
		   * @param presenter {bus.admin.mvp.presenter.StationsPresenter} Презентер
		   * @param  stationModel {bus.admin.mvp.model.StationModel}  Модель станции
		   */
		   _openUpdateStationForm : function(presenter, stationModel){
		   	this.debug("execute _openUpdateStationForm()");
		   	var langsModel =presenter.getDataStorage().getLangsModel();
		   	var dlg = new bus.admin.mvp.view.stations.StationForm(stationModel, langsModel, true);
		   	dlg.addListener("prepared_model", function(e){
		   		qx.core.Init.getApplication().setWaitingWindow(true);
		   		var newStationModel = e.getData().station;
		   		if(newStationModel == null || e.getData().cancel == true){
		   			dlg.close();
		   		}
		   		var callback = qx.lang.Function.bind(function(data) {
		   			qx.core.Init.getApplication().setWaitingWindow(false);
		   			if (data.error == true) {
		   				var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		   				this.tr("Error! Can not update station. Please, check input data.");
		   				bus.admin.widget.MsgDlg.info(msg);
		   				return;
		   			}
		   			dlg.close();
		   		}, this);
		   		console.debug(newStationModel);
		   		presenter.updateStationTrigger(stationModel, newStationModel, callback, this);

		   	},this);
		   	dlg.open();
		   },

		  /**
		   * Создает и открывает диалоговое окно для создания новой станции
		   * @param presenter {bus.admin.mvp.presenter.StationsPresenter} Презентер
		   * @param  stationModel {bus.admin.mvp.model.StationModel}  Модель станции
		   */
		   _openInsertStationForm : function(presenter, stationModel){
		   	var langsModel = presenter.getDataStorage().getLangsModel();
		   	var dlg = new bus.admin.mvp.view.stations.StationForm(stationModel, langsModel, false);
		   	dlg.addListener("prepared_model", function(e){
		   		qx.core.Init.getApplication().setWaitingWindow(true);
		   		var newStationModel = e.getData().station;
		   		if(newStationModel == null || e.getData().cancel == true){
		   			dlg.close();
		   		}
		   		var callback = qx.lang.Function.bind(function(data) {
		   			qx.core.Init.getApplication().setWaitingWindow(false);
		   			if (data.error == true) {
		   				var msg = data.errorInfo != undefined ? this.tr("Error! ") + data.errorInfo : 
		   				this.tr("Error! Can not update station. Please, check input data.");
		   				bus.admin.widget.MsgDlg.info(msg);
		   				return;
		   			}
		   			dlg.close();
		   		}, this);
		   		console.debug(newStationModel);
		   		this.presenter.insertStationTrigger(newStationModel, callback, this);

		   	},this);
		   	dlg.open();
		   }


		}
	});