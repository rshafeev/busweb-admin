

qx.Class.define("bus.admin.pages.cities.CitiesData", {
			extend : qx.core.Object,
			properties : {
				citiesModel : {
					nullable : true
				},
				langsModel : {
					nullable : true
				}
			},
			members : {
				/*
				 * status: 0 - not loaded yet -1 - loaded with errors 1 - loaded
				 * complete
				 */
				__citiesResponceStatus : 0,
				__langsResponceStatus : 0,

				isCitiesResponceComplete : function() {
					if (this.__citiesResponceStatus == 1)
						return true;
					return false;
				},
				isLangsResponceComplete : function() {
					if (this.__langsResponceStatus == 1)
						return true;
					return false;
				},
				setCitiesResponceComplete : function(flag) {
					if (flag == true) {
						this.__citiesResponceStatus = 1;
					} else
						this.__citiesResponceStatus = -1;

				},
				setLangsResponceComplete : function(flag) {
					if (flag == true) {
						this.__langsResponceStatus = 1;
					} else
						this.__langsResponceStatus = -1;
					this.debug("setLangsResponceComplete: "
							+ this.__langsResponceStatus);
				},
				isAllResponcesReceived : function() {
					if (this.__citiesResponceStatus != 0
							&& this.__langsResponceStatus != 0)
						return true;
					this.debug(this.__citiesResponceStatus);
					this.debug(this.__langsResponceStatus);
					return false;
				},
				refresh : function() {
					this.__citiesResponceStatus = 0;
					this.__langsResponceStatus = 0;
				},

				getLangByName : function(name) {
					var langs = this.getLangsModel();
					if (langs == null)
						return null;
					for (var i = 0; i < langs.length; i++) {
						if (langs[i].name.toString() == name.toString()) {
							return langs[i];
						}
					}
					return null;
				},
				
				updateCity : function(city) {
					var cities = this.getCitiesModel();
					if (cities == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						if (city.id == cities[i].id) {
							cities[i] = city;
							return;
						}
					}
					return null;
				},

				getCityByID : function(id) {
					var cities = this.getCitiesModel();
					if (cities == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						if (cities[i].id == id) {
							return cities[i];
						}
					}
					return null;

				},
				changeCity : function(id, city) {
					var cities = this.getCitiesModel();
					if (cities == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						if (cities[i].id == id) {
							cities[i] = city;
							return;
						}
					}

				}

			}
		});