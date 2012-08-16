

qx.Class.define("bus.admin.helpers.WidgetHelper", {
			type : "static",

			statics : {
				getValueFromSelectBox : function(selectBox) {
					var selections = selectBox.getSelection();
					if (selections == null || selections == []
							|| selections.length <= 0) {
						return null;
					}
					var selectItem = selections[0];
					if (selectItem == null)
						return null;
					return selectItem.getLabel();
				}
			}
		});
