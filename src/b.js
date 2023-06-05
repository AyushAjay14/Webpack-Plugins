import { b1Func } from './b1';
import { cFunc } from './c';

console.log('B');

b1Func();
cFunc();

export const bFunc = () => {
  console.log('bFunc invoked');
};
