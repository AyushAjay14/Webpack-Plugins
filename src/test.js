function f(){
}
const x = 5;
function y(){
    function j(){
        x = 10;
    }
}

const z = y();
x = 10;
x = {
    a : {
        b:{
            f: f()
        }
    }
};