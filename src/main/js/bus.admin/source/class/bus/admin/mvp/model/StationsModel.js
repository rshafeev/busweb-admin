

qx.Class.define("bus.admin.mvp.model.StationsModel", {
			extend : qx.core.Object,
			properties : {
				data : {
					nullable : true
				}
			},
			members : {
				insertStation : function(station) {
					this.getData().push(station);
				},
				deleteStation : function(id) {
					var stations = this.getData();
					if (stations == null)
						return;
					for (var i = 0; i < stations.length; i++) {
						if (id == stations[i].id) {
							stations.splice(i, 1);
							return;
						}
					}
				},
				updateStation : function(station) {
					var stations = this.getData();
					if (stations == null)
						return null;
					for (var i = 0; i < stations.length; i++) {
						if (station.id == stations[i].id) {
							stations[i] = station;
							return;
						}
					}
					return null;
				},

				getStationByID : function(id) {
					var stations = this.getData();
					if (stations == null)
						return null;
					for (var i = 0; i < stations.length; i++) {
						if (stations[i].id == id) {
							return stations[i];
						}
					}
					return null;

				},

				getStationByName : function(name, lang) {
					var stations = this.getData();
					if (stations == null || name == null || lang == null)
						return null;
					for (var i = 0; i < stations.length; i++) {
						for (var j = 0; j < stations[i].names.length; j++) {
							if (stations[i].names[j].lang_id.toString() == lang
									.toString()
									&& stations[i].names[j].value.toString() == name
											.toString()) {
								return stations[i];
							}
						}
					}

					return null;
				}
				
				

			}
		});