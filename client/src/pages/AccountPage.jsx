import axios from "axios"
import { useContext, useState } from "react"
import { Link, Navigate, useParams } from "react-router-dom"
import AccountNav from "../AccountNav"
import { UserContext } from "../UserContext"
import PlacesPage from "./PlacesPage"

export default function AccountPage() {
    const {user, ready, setUser} = useContext(UserContext) //for aquiring logged in user
    const [redirect, setRedirect] = useState(null)
    let {subpage} = useParams() //return everything after /account/ in url //also links to app.jsx
    if (subpage === undefined) {
        subpage = "profile"
    }

    async function logout() {
        await axios.post("/logout")
        setRedirect("/")
        setUser(null)
    }

    if (!ready) { //if user is not fetched yet
        return "loading..."
    }

    if (ready && !user && !redirect) { //if not logged in
        return <Navigate to={"/login"} />        
    }

    if (redirect) {
        return <Navigate to={redirect} />
    }

    return (
        <div>
            <AccountNav />
            {/* Login/Logout Text */}
            {subpage === "profile" && (
                <div className="text-center max-w-lg mx-auto">
                    Logged in as {user.name} ({user.email}) <br />
                    <button onClick={logout} className="primary max-w-sm mt-2">Logout</button>
                </div>
            )}
            {subpage === "places" && (
                <PlacesPage />
            )}
        </div>
    ) 
}