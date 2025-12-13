const authService = {
  login: async ({email,password}) => {
    if(email === 'test@example.com' && password === 'pass') return { token: 'fake-token' }
    throw new Error('Invalid credentials (demo)')
  },
  register: async ({name,email,password}) => {
    if(!email) throw new Error('Email required')
    return { ok: true }
  }
}

export default authService
