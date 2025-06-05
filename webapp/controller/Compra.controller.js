sap.ui.define([
    "./Base.controller",
    "sap/ui/model/json/JSONModel",
    "sap/ui/core/BusyIndicator",
    "sap/m/MessageToast",
    "sap/ui/export/Spreadsheet",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator"
], function (BaseController, JSONModel, BusyIndicator, MessageToast, Spreadsheet, Filter, FilterOperator) {
    "use strict";

    return BaseController.extend("product.controller.Compra", {
        onInit: function () {
            this._loadCartData();
        },

        _loadCartData: async function () {
            var oView = this.getView();
            BusyIndicator.show(0);

            try {
                const [cartsRes, usersRes] = await Promise.all([
                    fetch("https://fakestoreapi.com/carts"),
                    fetch("https://fakestoreapi.com/users")
                ]);

                const [carts, users] = await Promise.all([
                    cartsRes.json(),
                    usersRes.json()
                ]);

                // Map userId -> full name
                const userMap = {};
                users.forEach(user => {
                    userMap[user.id] = `${user.name.firstname} ${user.name.lastname}`;
                });

                // sumar cantidad
                const addCarts = carts.map(cart => {
                    const userName = userMap[cart.userId] || "Desconocido";
                    const totalQuantity = cart.products.reduce((sum, p) => sum + p.quantity, 0);

                    return {
                        id: cart.id,
                        date: new Date(cart.date).toLocaleDateString(),
                        userName,
                        totalQuantity
                    };
                });

                const oModel = new JSONModel(addCarts);
                oView.setModel(oModel, "cartModel");

            } catch (error) {
                console.error("Error al cargar los datos de compras:", error);
            } finally {
                BusyIndicator.hide();
            }
        },
        onDataExport: function () {
            var oModel = this.getView().getModel("cartModel");
            var aCompras = oModel.getProperty("/");

            var aCols = [
                { label: "ID Compra", property: "id" },
                { label: "Fecha", property: "date" },
                { label: "Usuario", property: "userName" },
                { label: "Cantidad Total", property: "totalQuantity", type: "number" }
            ];

            var oSettings = {
                workbook: {
                    columns: aCols
                },
                dataSource: aCompras,
                fileName: "Compras.xlsx"
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
            var oTable = this.byId("cartTable");
            var oBinding = oTable.getBinding("items");

            var aFilters = [];

            if (sQuery && sQuery.length > 0) {
                aFilters.push(
                    new Filter("userName", FilterOperator.Contains, sQuery)
                );
            }

            oBinding.filter(aFilters);
        },
        onPressDetail: function (oEvent) {
            var oItem = oEvent.getSource().getParent();
            var oContext = oItem.getBindingContext("cartModel");
            var scartId = oContext.getProperty("id");

            var oRouter = this.getOwnerComponent().getRouter();
            oRouter.navTo("viewCompraDetail", {
                cartId: scartId
            });
        }
    });
});
