// const swc = require('@swc/core')

// const code = `import { bFunc as bff } from "./b";
// import { efunc } from "./e";
// import "../app.css";
// var getFooter = function() {
//     return import("./footer");
// };
// console.log("A");
// var button = document.createElement("button");
// button.innerText = "Get the Footer";
// document.body.appendChild(button);
// button.addEventListener("click", function(e) {
//     getFooter().then(function(footerModule) {
//         document.body.appendChild(footerModule.footer);
//     });
// });
// bff();
// efunc();
// `
// swc.parse(code, {
//         comments: false,
//         script: true,

//         // Defaults to es3
//         target: "es3",

//         // Input source code are treated as module by default
//         isModule: false,
//     })
//     .then((module) => {
//         module.type // file type
//         console.log(module.body)
//     })

