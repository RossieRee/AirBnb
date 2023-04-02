import { Outlet } from "react-router-dom";
import Header from "./Header";

/* Header (navbar, logo, accuont icon) avoids repeated code */
export default function Layout() {
    return(
        <div className="py-4 px-10 pt-5 flex flex-col min-h-screen">
            <Header />
            <Outlet />
        </div>
    )
}