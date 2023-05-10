import React, { useState } from 'react'

const LoginForm = ({ onLogin, onCloseForm }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = await onLogin(username, password)
    if(data.token) {
        onCloseForm()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md">
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full mb-2 p-2 rounded-md"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-2 p-2 rounded-md"
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md cursor-pointer">
        Login
      </button>
    </form>
  )
}

const RegisterForm = ({ onRegister, onCloseForm }) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
  
    const handleSubmit = async (e) => {
      e.preventDefault()
      const data = await onRegister(username, password)
      if(data.token) {
        onCloseForm()
      }
    }
  
    return (
      <form onSubmit={handleSubmit} className="bg-white p-4 rounded-md">
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full mb-2 p-2 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-2 p-2 rounded-md"
        />
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded-md">
          Register
        </button>
      </form>
    )
  }

export { LoginForm, RegisterForm }
