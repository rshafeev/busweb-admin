

qx.Class.define("bus.admin.mvp.model.CitiesModel", {
			extend : qx.core.Object,
			properties : {
				data : {
					nullable : true
				}
			},
			members : {
				insertCity : function(city) {
					this.getData().push(city);
				},
				deleteCity : function(id) {
					var cities = this.getData();
					if (cities == null)
						return;
					for (var i = 0; i < cities.length; i++) {
						if (id == cities[i].id) {
							cities.splice(i, 1);
							return;
						}
					}
				},
				updateCity : function(oldID, city) {
					var cities = this.getData();
					if (cities == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						if (oldID == cities[i].id) {
							cities[i] = city;
							return;
						}
					}
					return;
				},

				getCityByID : function(id) {
					var cities = this.getData();
					if (cities == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						if (cities[i].id == id) {
							return cities[i];
						}
					}
					return null;

				},

				getCityByName : function(name, lang) {
					var cities = this.getData();
					if (cities == null || name == null || lang == null)
						return null;
					for (var i = 0; i < cities.length; i++) {
						for (var j = 0; j < cities[i].names.length; j++) {
							if (cities[i].names[j].lang_id.toString() == lang
									.toString()
									&& cities[i].names[j].value.toString() == name
											.toString()) {
								return cities[i];
							}
						}
					}

					return null;
				}

			}
		});