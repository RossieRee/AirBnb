import { Link } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export default function RegisterPage() {
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    async function registerUser(ev) {
        ev.preventDefault(); //keeps values after refreshing
        try {
            await axios.post("/register", { //sends information to database
                name,
                email,
                password
            });
            alert("Registration successful. Now you can log in.")
        } catch (e) {
            alert("Registration failed. Please try again later")
        }
    }

    return (
        <div className="grow flex justify-around">
            <div className="mt-56">
                <form className="max-w-md mx-auto space-y-3" onSubmit={registerUser}>
                    <h1 className="text-4xl text-center mb-3">Register</h1>
                    <input 
                        type="text"
                        placeholder={"John Doe"}
                        value={name}
                        onChange={ev => setName(ev.target.value)}
                    />
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
                    <button className="primary">Create Account</button>
                </form>
                <div className="py-1 text-grey-500">
                    Already a member? 
                    <Link to={"/login"} className="underline text-black">Login</Link>
                </div>
            </div>
        </div>
    )
}