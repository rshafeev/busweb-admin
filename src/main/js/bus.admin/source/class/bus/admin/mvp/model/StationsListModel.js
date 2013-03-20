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
 * Модель хранит список остановок.
 */
 qx.Class.define("bus.admin.mvp.model.StationsListModel", {
 	extend : Object,

 	/**
 	 * В конструктор передается JS объект, который имеет следующий формат:
 	 * 
 	 * @param  dataModel {Object|null}  JS объект.
 	 */
 	 construct : function(dataModel) {
 	 	this.__stationsList = [];
 	 	if(dataModel != undefined){
 	 		this.fromDataModel(dataModel);
 	 	}
 	 },

 	 members : 
 	 {
 	 	__stationsList : null,


 	 	getAll : function(){
 	 		return this.__stationsList;
 	 	},

 	 	fromDataModel : function(dataModel){
 	 		this.__stationsList = [];
 	 		for(var i = 0; i < dataModel.stationsList.length; i++){
 	 			this.__stationsList.push(qx.data.marshal.Json.createModel(dataModel.stationsList[i]));
 	 		}
 	 	},

 	 	getStationByID : function(stationID){
 	 		if(this.__stationsList == null)
 	 			return null;
 	 		for(var i = 0; i < this.__stationsList.length; i++){
 	 			if(stationID == this.__stationsList[i].getId()){
 	 				return this.__stationsList[i];
 	 			}
 	 		}
 	 		return null;
 	 	},

 	 	insert : function(stationID, stationName){
 	 		var model = {
 	 			id : stationID,
 	 			name : stationName
 	 		};
 	 		if(this.__stationsList == undefined)
 	 			this.__stationsList = [];
 	 		this.__stationsList.push(qx.data.marshal.Json.createModel(model));
 	 	},

 	 	remove : function(stationID){
 	 		if(this.__stationsList == null)
 	 			return null;
 	 		for(var i = 0; i < this.__stationsList.length; i++){
 	 			if(stationID == this.__stationsList[i].getId()){
 	 				this.__stationsList.splice(i, 1);
 	 				break;
 	 			}
 	 		}	
 	 	}

 	 }

 	});