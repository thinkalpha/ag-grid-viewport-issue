import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.scss";

import { ClientSideRowModelModule } from "@ag-grid-community/client-side-row-model";
import { ModuleRegistry } from "@ag-grid-community/core";
import "@ag-grid-community/core/dist/styles/ag-grid.css";
import { ColumnsToolPanelModule } from "@ag-grid-enterprise/column-tool-panel";
import { LicenseManager } from "@ag-grid-enterprise/core";
import { MenuModule } from "@ag-grid-enterprise/menu";
import { ViewportRowModelModule } from "@ag-grid-enterprise/viewport-row-model";

LicenseManager.setLicenseKey(
  "CompanyName=Alpha Trading Systems,LicensedApplication=Alpha,LicenseType=SingleApplication,LicensedConcurrentDeveloperCount=2,LicensedProductionInstancesCount=0,AssetReference=AG-021506,ExpiryDate=13_December_2022_[v2]_MTY3MDg4OTYwMDAwMA==74535a15b256de62531a237749cc8649"
);

ModuleRegistry.registerModules([
  // the modules to register
  ClientSideRowModelModule,
  ViewportRowModelModule,
  MenuModule,
  ColumnsToolPanelModule,
]);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root") as HTMLElement
);
