sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/Fragment",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, Fragment, Filter, FilterOperator) => {
    "use strict";

    return Controller.extend("project1.controller.View1", {
        onInit() {
            
            const oData = {
                CategoryCollection: [
                    { CategoryID: "1" },
                    { CategoryID: "2" },
                    { CategoryID: "3" },
                    { CategoryID: "4" },
                    { CategoryID: "5" },
                    { CategoryID: "6" },
                    { CategoryID: "7" },
                    { CategoryID: "8" }
                ]
            };

            const oModel = new JSONModel(oData);
            this.getView().setModel(oModel, "obj");
        },

        onValueHelpRequest: function (oEvent) {
            const oView = this.getView();
            const sInputValue = oEvent.getSource().getValue();

            if (!this._pValueHelpDialog) {
                this._pValueHelpDialog = Fragment.load({
                    id: oView.getId(),
                    name: "project1.fragment.valueHelpDialog", 
                    controller: this
                }).then(function (oDialog) {
                    oView.addDependent(oDialog);
                    oDialog.setModel(oView.getModel("obj"), "obj"); 
                    return oDialog;
                }).catch(function (err) {
                    console.error("Dialog load error:", err);
                });
            }

            this._pValueHelpDialog.then(function (oDialog) {
                oDialog.open(sInputValue);
            });
        },


        onValueHelpSearch: function (oEvent) {
            const sValue = oEvent.getParameter("value");
            const oFilter = new Filter("CategoryID", FilterOperator.Contains, sValue);
            oEvent.getSource().getBinding("items").filter([oFilter]);
        },

        onValueHelpClose: function (oEvent) {
            const oSelectedItem = oEvent.getParameter("selectedItem");
            oEvent.getSource().getBinding("items").filter([]);

            if (!oSelectedItem) return;

            this.byId("categoryInput").setValue(oSelectedItem.getTitle());
        },

        onSubmitPress: function(){
            const categoryId=this.byId("categoryInput").getValue();
            console.log("Selected Category ID : ",categoryId);

             this.getOwnerComponent().getRouter().navTo("RouteView2", { categoryId: categoryId });
        }
    });
});
