sap.ui.define([
    "./Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], (Controller, JSONModel, MessageToast, Spreadsheet, Filter, FilterOperator) => {
    "use strict";
    return Controller.extend("product.controller.Usuario", {
        onInit() {
            this.onLoadData();
        },
        onLoadData: function () {
            var oModel = new JSONModel();
            fetch('https://fakestoreapi.com/users')
                .then(response => response.json())
                .then(data => {
                    oModel.setData({ users: data });
                    this.getView().setModel(oModel, "usersModel");
                })
                .catch(error => {
                    console.error("Error al obtener los usuarios:", error);
                });
        },
        onPressDetail: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("usersModel");
            var sUserId = oContext.getProperty("id");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("viewDetail", {
                userId: sUserId
            });
        },
        onDataExport: function () {
            var oModel = this.getView().getModel("usersModel");
            var aUser = oModel.getProperty("/users");

            var aCols = [
                { label: "Username", property: "username" },
                { label: "Email", property: "email" },
                { label: "Teléfono", property: "phone" },
                { label: "Ciudad", property: "address/city" },
                { label: "Dirección", property: "address/street" }
            ];

            var oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: aUser,
                fileName: "Usuarios.xlsx"
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
            var oTable = this.byId("userTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                aFilters.push(
                    new Filter("username", FilterOperator.Contains, sQuery)
                );
            }

            oBinding.filter(aFilters);
        }
    });
});