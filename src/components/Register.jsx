import axios from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router";
import Loading from "./Loading";
import notification from "../notification/notification";
import links from "../constants/links";

export default function Register() {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const usernameInput = useRef();
    const loginInput = useRef();
    const passwordInput = useRef();

    async function sendRegister() {
        const usernameVal = usernameInput.current.value;
        const loginVal = loginInput.current.value;
        const passwordVal = passwordInput.current.value;

        setIsLoading(true);

        await axios.post(links.BACKEND + "/register", {
            username: usernameVal,
            login: loginVal,
            password: passwordVal
        }).then(r => {
            notification(
                "Success",
                "You have been successfully registered",
                "success"
            );
            navigate("/login");
        }).catch(e => {
            e.response.data.errors.forEach(m => {
                notification("Registration Error", m, "danger");
            })
        });
        setIsLoading(false);
    }

    return <div className="login-wrapper bg-gray-950 flex justify-center items-center">
        <div className="flex flex-col w-52">
            {isLoading && <Loading />}
            <h1 className="font-mono text-center text-white text-3xl mt-6 select-none text-white relative">
                Registration page
            </h1>
            <button className="font-mono text-sm mb-6 mt-2 text-white auth-link-color transition"
                onClick={() => navigate("/login")}>
                    Login
            </button>
            <input ref={usernameInput} type="text" placeholder="Username" className="mb-5 px-2 py-1 outline-0 rounded" />
            <input ref={loginInput} type="text" placeholder="Login" className="mb-5 px-2 py-1 outline-0 rounded" />
            <input ref={passwordInput} type="password" placeholder="Password" className="mb-5 px-2 py-1 outline-0 rounded" />
            <button onClick={() => sendRegister()} className="bg-gray-800 text-white font-mono rounded hover:bg-gray-600 transition py-1.5">
                Register
            </button>
        </div>
    </div>
}