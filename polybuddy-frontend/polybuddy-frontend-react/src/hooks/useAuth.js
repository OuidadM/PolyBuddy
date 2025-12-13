import { useState, useEffect } from 'react'
import authService from '../services/auth.service'

export default function useAuth(){
  const [user, setUser] = useState(null)
  useEffect(()=>{ },[])
  return { user, setUser }
}
