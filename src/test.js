function f(){
}
const x = 5;
function y(){
    x = 5;
    f();
}
y();
x = 10;
