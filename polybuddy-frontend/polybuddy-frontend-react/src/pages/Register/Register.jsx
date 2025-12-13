import React, {useState} from 'react'
import authService from '../../services/auth.service'
import { useNavigate } from 'react-router-dom'

export default function Register(){
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  const nav = useNavigate()

  const submit = async (e) => {
    e.preventDefault()
    try{
      await authService.register({name,email,password})
      nav('/login')
    }catch(err){
      setError(err.message || 'Registration failed')
    }
  }

  return (
    <div className="container" style={{maxWidth:540}}>
      <h2>Create Account</h2>
      <form onSubmit={submit}>
        <label>Full name</label>
        <input value={name} onChange={e=>setName(e.target.value)} required />
        <label>Email</label>
        <input value={email} onChange={e=>setEmail(e.target.value)} type="email" required />
        <label>Password</label>
        <input value={password} onChange={e=>setPassword(e.target.value)} type="password" required />
        {error && <div style={{color:'red'}}>{error}</div>}
        <button type="submit">Create account</button>
      </form>
    </div>
  )
}
