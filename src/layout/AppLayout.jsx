import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header.jsx'
function AppLayout() {
  return (
    <div>
      <main>
        <Header/>
        {/* {body} */}
        <Outlet/>
      </main>
      {/* footer */}
    </div>
  )
}

export default AppLayout