sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/core/UIComponent",
    "sap/ui/core/routing/History",
    "sap/ui/core/Core"
], (Controller, UIComponent, History, Core) => {
    "use strict";

    return Controller.extend("product.controller.Base", {
        getRouter: function () {
            return UIComponent.getRouterFor(this);
        },
        onNavTo: function (viewRoute, param = null) {
            this.getRouter().navTo(viewRoute, param);
        },
        onNavBack: function () {
            let oHistory, sPreviewHash;
            oHistory = History.getInstance();
            sPreviewHash = oHistory.getPreviousHash();
            if (sPreviewHash !== undefined) {
                window.history.go(-1);
            } else {
                this.getRouter().navTo("RouteMain");
            }
        },
        getById: function (sId) {
            return this.getView().byId(sId);
        },
        onTheme: function (oEvent) {
            let theme = oEvent.getSource().data("tipoTema");
            if (theme == "L") {
                Core.applyTheme("sap_horizon");
                localStorage.setItem("tipoTema", "sap_horizon");
            } else {
                Core.applyTheme("sap_horizon_dark");
                localStorage.setItem("tipoTema", "sap_horizon_dark");
            }
        },
        _initThema: function () {
            if (localStorage.getItem("tipoTema")) {
                Core.applyTheme(localStorage.getItem("tipoTema"));
            }
        }

    });
});