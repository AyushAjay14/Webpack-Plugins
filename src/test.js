function f(){
}
const x = 5;
function y(){
    function j(){
    }
}

// const z = y(x);
x = y();
x = 10;
x = {
    f : f()
};