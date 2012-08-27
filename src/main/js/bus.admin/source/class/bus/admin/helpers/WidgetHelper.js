

qx.Class.define("bus.admin.helpers.WidgetHelper", {
			type : "static",

			statics : {
				getValueFromSelectBox : function(selectBox) {
					if (selectBox == null)
						return null;
					var selections = selectBox.getSelection();
					if (selections == null || selections == []
							|| selections.length <= 0) {
						return null;
					}
					var selectItem = selections[0];
					if (selectItem == null)
						return null;
					return selectItem.getLabel();
				},
				getItemFromSelectBoxByID : function(selectBox,id) {
					if (selectBox == null)
						return null;
					var children = selectBox.getChildren();
					for (var i = 0; i < children.length; i++) {
						var children_id = children[i].getUserData("id");
						if (id == children_id)
							return children[i];
					}

					return null;
				},
				getSelectionItemFromSelectBox : function(selectBox) {
					if (selectBox == null)
						return null;
					var selections = selectBox.getSelection();
					if (selections == null || selections == []
							|| selections.length <= 0) {
						return null;
					}
					var selectItem = selections[0];
					if (selectItem == null)
						return null;
					return selectItem;
				}
			}
		});
