import * as React from 'react'

function Greeting({name : propName}) {
  const [name, setName] = React.useState('')
  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>

  )

}

function App() {
  return <Greeting name = "hello" />
}

export default App
