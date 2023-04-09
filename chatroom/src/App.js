import logo from './logo.svg';
import './App.css';
import Login from './components/Login';
import Chatroom from './components/Chatroom';

import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
  Outlet
} from "react-router-dom";


import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useEffect, useState } from 'react';

function PrivateRoute({authenticated}) {
  return (
    authenticated === true ? (
      <Outlet />
    )
   : (
    <Navigate
      to={{pathname:"/"}}
      />
  )
  );
}

function PublicRoute({authenticated}) {
  return (
    authenticated === false ? (
      <Outlet />
    ) : (
      <Navigate to="/chatroom" />
    )
  );
}



function App() {
  const [authenticated, setAuthenticated] = useState(false);

  useEffect( () => {
    console.log('authenticated', authenticated);
    const auth = getAuth();

    onAuthStateChanged(auth, (user) => {
      console.log(user);
      if(user){
        setAuthenticated(true)
      }else {
        setAuthenticated(false)
      }
    })
  }, []);

  return (
    <div>
      <Router>
        <Routes>

          <Route exact path='/' element={<PublicRoute authenticated={authenticated} />} >
            <Route exact path='/' element={<Login />}></Route>
          </Route>

          <Route path='/chatroom' element={<PrivateRoute authenticated={authenticated} />} >
            <Route exact path='/chatroom' element={<Chatroom />}></Route>
          </Route>

        </Routes>
        </Router>
    </div>
  );
}

export default App;
