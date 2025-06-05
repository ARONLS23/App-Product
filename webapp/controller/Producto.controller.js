sap.ui.define([
    "./Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, Spreadsheet, Filter, FilterOperator) => {
    "use strict";
    return Controller.extend("product.controller.Producto", {
        onInit() {
            this.onLoadData();
        },
        onLoadData: function () {
            var oModel = new JSONModel();
            fetch('https://fakestoreapi.com/products')
                .then(response => response.json())
                .then(data => {
                    oModel.setData({ products: data });
                    this.getView().setModel(oModel, "productsModel");
                })
                .catch(error => {
                    console.error("Error al obtener los productos:", error);
                });
        },
        onDataExport: function () {
            var oModel = this.getView().getModel("productsModel");
            var aProducts = oModel.getProperty("/products");

            var aCols = [
                { label: "Nombre", property: "title" },
                { label: "Precio ($)", property: "price", type: "number" },
                { label: "Categoría", property: "category" },
                { label: "Rating", property: "rating/rate", type: "number" },
                { label: "Descripción", property: "description" },
            ];

            var oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: aProducts,
                fileName: "Productos.xlsx"
            };

            var oSheet = new Spreadsheet(oSettings);
            oSheet.build()
                .then(function () {
                    MessageToast.show("Exportación completada");
                })
                .finally(function () {
                    oSheet.destroy();
                });
        },
        onSearch: function (oEvent) {
            var sQuery = oEvent.getParameter("newValue");
            var oTable = this.byId("productTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                aFilters.push(
                    new Filter("title", FilterOperator.Contains, sQuery)
                );
            }

            oBinding.filter(aFilters);
        }
    });
});