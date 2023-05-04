import { useRef, useState } from "react";
import 'react-notifications-component/dist/theme.css';
import 'animate.css/animate.min.css';
import axios from "axios";
import Loading from "./Loading";
import { useNavigate } from "react-router";
import token from "../constants/token";
import links from "../constants/links";
import notification from "../notification/notification";

export default function Login({ setIsToken }) {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const loginInput = useRef();
    const passwordInput = useRef();

    async function sendLogin() {
        const loginVal = loginInput.current.value;
        const passwordVal = passwordInput.current.value;

        setIsLoading(true);

        await axios.post(links.BACKEND + "/login", {
            login: loginVal,
            password: passwordVal
        }).then(r => {
            localStorage.setItem(token.NAME, r.data.token);
            setIsToken(true);
        }).catch(e => {
            e.response.data.errors.forEach(m => {
                notification("Login error", m, "danger");
            });
        });
        setIsLoading(false);
    }

    return <div className="login-wrapper bg-gray-950 flex justify-center items-center">
        <div className="flex flex-col w-52">
            {isLoading && <Loading />}
            <h1 className="font-mono text-center text-white text-3xl mt-6 select-none text-white relative">
                Login page
            </h1>
            <button className="font-mono text-sm mb-6 mt-2 text-white auth-link-color transition"
                onClick={() => navigate("/register")}>
                    Registration
            </button>
            <input ref={loginInput} type="text" placeholder="Login" className="mb-5 px-2 py-1 outline-0 rounded" />
            <input ref={passwordInput} type="password" placeholder="Password" className="mb-5 px-2 py-1 outline-0 rounded" />
            <button onClick={() => sendLogin()} className="bg-gray-800 text-white font-mono rounded hover:bg-gray-600 transition py-1.5">
                Login
            </button>
        </div>
    </div>
}