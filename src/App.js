import React, { Fragment, useEffect, useState } from "react";
import Form from "./components/Form";
import Header from "./components/Header";
import "./css/styles.css";
function App() {
  const [loading, setLoading] = useState(true);
  // useEffect(() => {
  //   const scripTag = document.createElement("script");
  //   scripTag.async = true;
  //   scripTag.src = "https://www.geogebra.org/apps/deployggb.js";
  //   scripTag.addEventListener("load", () => setLoading(false));
  //   document.body.appendChild(scripTag);
  // }, []);
  // useEffect(() => {
  //   if (!loading) {
  //     const GGBApplet = window.GGBApplet;
  //     const ggbApp = new GGBApplet(
  //       {
  //         appName: "graphing",
  //         width: 1024,
  //         height: 1080,
  //         showToolBar: false,
  //         showAlgebraInput: false,
  //         showMenuBar: false,
  //       },
  //       true
  //     );
  //     ggbApp.inject("ggb-element");
  //   }
  // }, [loading]);
  return (
    <Fragment>
      <Header />
      <Form />
    </Fragment>
  );
}

export default App;
