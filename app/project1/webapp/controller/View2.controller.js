sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/m/MessageToast",
    "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
    "use strict";

    return Controller.extend("project1.controller.View2", {

        onInit: function () {
            const obj = new JSONModel({
                categoryId: "",
                excelData: []
            });
            this.getView().setModel(obj, "obj");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.getRoute("RouteView2").attachPatternMatched(this.onRoute, this);
            
            var oFileUploader = this.byId("fileUploader");
            oFileUploader.clear();
        },

        onRoute: function (oEvent) {
            var categoryId = oEvent.getParameter("arguments").categoryId;

            if (!categoryId) {
                MessageToast.show("Category ID not found in route.");
                return;
            }

            var obj = this.getView().getModel("obj");
            obj.setProperty("/categoryId", categoryId);

            console.log("Selected Category ID:", categoryId);
        },

        handleUploadPress: function () {
            var oFileUploader = this.byId("fileUploader");
            var obj = this.getView().getModel("obj");
            var currentCategoryId = parseInt(obj.getProperty("/categoryId"));

            var oFileInput = oFileUploader.oFileUpload;
            if (!oFileInput || !oFileInput.files.length) {
                MessageToast.show("Please select a file first!");
                return;
            }

            var oFile = oFileInput.files[0];
            var reader = new FileReader();

            reader.onload = function (e) {
                try {
                    var data = e.target.result;
                    var workbook = XLSX.read(data, { type: "binary" });
                    var worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    var jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });

                    if (!jsonData || jsonData.length === 0) {
                        MessageToast.show("Excel file is empty!");
                        oFileUploader.clear();
                        return;
                    }

                    const requiredFields = [
                        "ProductID", "ProductName", "SupplierID",
                        "CategoryID", "QuantityPerUnit", "UnitPrice",
                        "UnitsInStock", "UnitsOnOrder", "ReorderLevel"
                    ];

                    let hasCategoryMismatch = false;

                    const processedData = jsonData.map(row => {
                        
                        const rowErrors = [];

                        const excelCatId = row.CategoryID ?? row.categoryId ?? "";
                        const excelCatNum = parseInt(excelCatId);

                        if (isNaN(excelCatNum) || excelCatNum !== currentCategoryId) {
                            rowErrors.push("CategoryID mismatch");
                            hasCategoryMismatch = true;
                        }

                        requiredFields.forEach(field => {
                            let val = row[field] ?? row[field.toLowerCase()];
                            if (!val || String(val).trim() === "") {
                                rowErrors.push(field + " missing");
                                row[field] = "";
                            }
                        });

                        row.Error = rowErrors.length ? rowErrors.join(", ") : "--";
                        return row;
                    });

                    if (hasCategoryMismatch) {
                        MessageToast.show("Some rows have CategoryID mismatch..!");
                        oFileUploader.clear();
                        return;
                    }

                    obj.setProperty("/excelData", processedData);
                    MessageToast.show("Excel file processed successfully!");
                    console.log("Processed Excel Data:", processedData);

                } catch (err) {
                    console.error("Error reading Excel:", err);
                    MessageToast.show("Error reading Excel file!");
                    oFileUploader.clear();
                }
            };

            reader.readAsBinaryString(oFile);
        }

    });
});
