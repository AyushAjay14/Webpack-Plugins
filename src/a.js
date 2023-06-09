import { bFunc as bff } from './b';
import {efunc} from './e';
import '../app.css'
const getFooter = () => import('./footer')
// const getColor = (color) => import(`/color-styles/${color}.js`);
console.log('A');
function testFunc(randomparam){
    function testFunc1(randomparam1){
        function testFunc2(randomparam2){
        
        }
    }
}

//  function test2Func(){
//  }
const fatArrow = () =>{
    
}
const button = document.createElement("button");
button.innerText = "Get the Footer";
document.body.appendChild(button);

button.addEventListener('click' , (e) =>{
    // getColor('red').then(colorModule => {document.body.style.backgroundColor = colorModule.default});
    getFooter().then(footerModule=> {document.body.appendChild(footerModule.footer)})
})
bff();
efunc();
