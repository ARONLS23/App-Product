sap.ui.define([
    "./Base.controller",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("product.controller.CompraDetail", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("viewCompraDetail").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: async function (oEvent) {
            const cartId = oEvent.getParameter("arguments").cartId;
            const oView = this.getView();

            try {
                // Obtener datos de la compra
                const cartRes = await fetch(`https://fakestoreapi.com/carts/${cartId}`);
                const cart = await cartRes.json();

                // Obtener usuario
                const userRes = await fetch(`https://fakestoreapi.com/users/${cart.userId}`);
                const user = await userRes.json();

                // Obtener todos los productos
                const allProductsRes = await fetch("https://fakestoreapi.com/products");
                const allProducts = await allProductsRes.json();

                // Agregar productos
                const addProducts = cart.products.map(prod => {
                    const productInfo = allProducts.find(p => p.id === prod.productId);
                    return {
                        name: productInfo ? productInfo.title : "Desconocido",
                        quantity: prod.quantity
                    };
                });

                // Crear modelo combinado
                const oModel = new JSONModel({
                    user: {
                        fullName: `${user.name.firstname} ${user.name.lastname}`
                    },
                    cart: {
                        date: new Date(cart.date).toLocaleDateString(),
                        products: addProducts
                    }
                });

                oView.setModel(oModel, "cartDetailModel");

            } catch (error) {
                console.error("Error al cargar detalles de la compra:", error);
            }
        }
    });
});
