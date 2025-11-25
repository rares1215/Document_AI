import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Login } from './pages/Login';
import { Register } from './pages/Register';


function App() {
  return(
    <BrowserRouter>

      <Routes >
        <Route path='/register/' element={<Register />}></Route>
        <Route path='/login/' element={<Login />}></Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
