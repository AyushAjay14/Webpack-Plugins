console.log('C1');
import { d1Func } from './d1'

export const callingc1Func = ()=>{
  d1Func();
}
export const c1Func = () => {
  console.log('c1Func invoked');
};