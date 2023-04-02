import { Link, Navigate } from "react-router-dom";
import { useContext, useState } from "react";
import axios from "axios";
import { UserContext } from "../UserContext";

export default function LoginPage() {
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [redirect, setRedirect] = useState(false)
    const {setUser} = useContext(UserContext) //will show logged in index page

    //executes on login submission
    async function loginSubmit(ev) {
        ev.preventDefault(); //keeps values after refreshing
        try {
            const {data} = await axios.post("/login", { email, password }, {withCredentials: true})
            setUser(data);
            alert("Login Successful")
            setRedirect(true)
        } catch (e) {
            alert("Login failed")
        }
    }

    //once logged in redirect to home page
    if (redirect) {
        return <Navigate to={"/"} />
    }

    return (
        <div className="grow flex justify-around">
            <div className="mt-56">
                <form className="max-w-md mx-auto space-y-3" onSubmit={loginSubmit}>
                    <h1 className="text-4xl text-center mb-3">Login</h1>
                    <input
                        type="email"
                        placeholder={"your@email.com"}
                        value={email}
                        onChange={ev => setEmail(ev.target.value)}
                    />
                    <input 
                        type="password"
                        placeholder="password"
                        value={password}
                        onChange={ev => setPassword(ev.target.value)}
                    />
                    <button className="primary">Login</button>
                </form>
                <div className="py-1 text-grey-500">
                    Don't have an account yet?
                    <Link to={"/register"} className="underline text-black"> Register</Link>
                </div>
            </div>
        </div>
    )
}