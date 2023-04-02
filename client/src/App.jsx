import { Route, Routes } from 'react-router-dom'
import './App.css'
import Layout from './Layout'
import IndexPage from './pages/IndexPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import axios from 'axios'
import { UserContextProvider } from './UserContext'
import AccountPage from './pages/AccountPage'
import PlacesPage from './pages/PlacesPage'
import PlacesFormPage from './pages/PlacesFormPage'
import PlacePage from './pages/PlacePage'

axios.defaults.baseURL = "http://localhost:4000"
axios.defaults.withCredentials = true

//ROUTES HERE to different pages
function App() {
  return (
    <UserContextProvider>
      <Routes> {/* //pages - alternative routes are in pages below */}
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} /> {/* if :subpage is undefined only /account will return */}
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/new" element={<PlacesFormPage />} />
          <Route path="/account/places/:id" element={<PlacesFormPage />} /> {/* NOTE same as new page */}
          <Route path="/place/:id" element={<PlacePage />}/>
        </Route>
      </Routes>
    </UserContextProvider>
  )
}

export default App
