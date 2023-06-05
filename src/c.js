import { c1Func } from './c1';
import { dFunc } from './d';

c1Func();
dFunc();

console.log('C');

export const cFunc = () => {
  console.log('cFunc invoked');
};
