import { c1Func } from './c1';
import { dFunc } from './d';
import {callingc1Func} from './c1'
c1Func();
dFunc();
callingc1Func();
console.log('C');

export const cFunc = () => {
  console.log('cFunc invoked');
};
