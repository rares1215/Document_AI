import ProtectedRoute from './components/ProtectedRoute'
import { BrowserRouter, Routes, Route, Navigate} from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { UploadResume } from './pages/UploadResume';
import { Home } from './pages/Home';
import { LatestAnalysis } from './pages/LatestAnalysis';
import { History } from './pages/History';
import { SingleAnalysis } from './pages/SingleAnalysis';



function App() {
  return(
    <BrowserRouter>
    <Navbar />
      <Routes >
        {/* Normal Routes */}
        <Route path='/register/' element={<Register />}></Route>
        <Route path='/login/' element={<Login />}></Route>
        <Route path='/' element={<Home />}/>


        {/* Protected Routes */}
        <Route 
        path='/upload_file/'
        element={
          <ProtectedRoute children={<UploadResume />}/>
        }
        />
        <Route 
        path='/analysis/latest/'
        element={
          <ProtectedRoute children={<LatestAnalysis />}/>
        }
        />
        <Route 
        path='/analyses/'
        element={
          <ProtectedRoute children={<History />}/>
        }
        />
        <Route 
        path='/analysis/:id/'
        element={
          <ProtectedRoute children={<SingleAnalysis />}/>
        }
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App
