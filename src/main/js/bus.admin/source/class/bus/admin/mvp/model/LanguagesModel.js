

qx.Class.define("bus.admin.mvp.model.LanguagesModel", {
			extend : qx.core.Object,
			properties : {
				data : {
					nullable : true
				}
			},
			members : {
				getLangByName : function(name) {
					var langs = this.getData();
					if (langs == null)
						return null;
					for (var i = 0; i < langs.length; i++) {
						if (langs[i].name.toString() == name.toString()) {
							return langs[i];
						}
					}
					return null;
				}
			}
		});