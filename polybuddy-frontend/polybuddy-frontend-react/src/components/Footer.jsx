import React from 'react'
export default function Footer(){
  return (
    <footer style={{padding:'1rem', textAlign:'center', fontSize:13, color:'#667085'}}>
      © {new Date().getFullYear()} PolyBuddy — built with ❤️
    </footer>
  )
}
