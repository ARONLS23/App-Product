sap.ui.define([
    "./Base.controller",
    "sap/ui/model/json/JSONModel"
], function (BaseController, JSONModel) {
    "use strict";

    return BaseController.extend("product.controller.Detail", {
        onInit: function () {
            this.getOwnerComponent().getRouter().getRoute("viewDetail").attachPatternMatched(this._onPatternMatched, this);
        },

        _onPatternMatched: function (oEvent) {
            var userId = oEvent.getParameter("arguments").userId;
            var oView = this.getView();

            fetch(`https://fakestoreapi.com/users/${userId}`)
                .then(response => response.json())
                .then(data => {
                    var oModel = new JSONModel(data);
                    oView.setModel(oModel, "detailModel");
                    
                    if (data.address && data.address.geolocation) {
                        var lat = data.address.geolocation.lat;
                        var long = data.address.geolocation.long;

                        if (lat && long) {
                            var sHtml = `
                                <iframe
                                    width="100%"
                                    height="300px"
                                    frameborder="0"
                                    style="border:0"
                                    src="https://maps.google.com/maps?q=${lat},${long}&z=15&output=embed"
                                    allowfullscreen
                                ></iframe>
                            `;
                            oView.byId("mapHtml").setContent(sHtml);
                        }
                    }
                })
                .catch(error => {
                    console.error("Error al cargar detalle del usuario:", error);
                });
        }
    });
});
