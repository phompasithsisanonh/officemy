import React from "react"
import './App.css';
import { Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard"
import Add from './page/Add';
import Login from './auth/Login';
import Resgister from './auth/Resgister';
import ListExp from "./page/ListExp";
import Dashbord from "./page/Dashbord";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/add" element={<Add />} />
      <Route path="/login" element={<Login />} />
      <Route path="/resgister" element={<Resgister/>} />
      <Route path="/listExp" element={<ListExp/>} />
      <Route path="/dash" element={<Dashbord/>} />
    </Routes>
  );
}

export default App;
