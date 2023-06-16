import {React} from 'react';
interface FooProp {
    name: string;
    X: number;
    Y: number;
  }
  declare function AnotherComponent(prop: { name: string });
  function ComponentFoo(prop: FooProp) {
    return <AnotherComponent name={prop.name} />;
  }
  const Button = (prop: { value: string }, context: { color: string }) => (
    <button />
  );
  declare namespace JSX {
    interface ElementClass {
      render: any;
    }
  }
  class MyComponent {
    render() {}
  }
  function MyFactoryFunction() {
    return { render: () => {} };
  }
  <MyComponent />; // ok
  <MyFactoryFunction />; // ok
  class NotAValidComponent {}
  function NotAValidFactoryFunction() {
    return {};
  }
  <NotAValidComponent />; // error
  <NotAValidFactoryFunction />; // error