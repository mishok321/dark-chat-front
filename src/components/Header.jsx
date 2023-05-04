import links from "../constants/links"
import github_white from "../assets/github_white.svg";
import user_white from "../assets/user_white.svg";
import { useEffect } from "react";
import useCurrentUser from "../hooks/useCurrentUser";
import notification from "../notification/notification";

export default function Header({ setIsToken }) {
    const { isError, username } = useCurrentUser();

    useEffect(() => {
        if (isError) {
            notification(
                "Token Error",
                "Your token is invalid or expired, please re-login",
                "danger"
            );
            setIsToken(false);
        }
    });
    
    return (
        <div className="text-white bg-gray-900 h-16">
            <div className="header container mx-auto px-5 grid grid-cols-2 items-center h-full">
                <div className="header__profile flex items-center">
                        <img className="h-8 w-8" src={user_white} alt="User's profile" />
                        <span className="ml-3 hover:opacity-75 transition font-rubik-bold">{ username }</span>
                </div>
                <div className="header__link">
                    <a
                        href={links.GITHUB}
                        target="_blank"
                        rel="noreferrer">
                            <img className="ml-auto" src={github_white} alt="Author's github" />
                    </a>
                </div>
            </div>
        </div>
    )
}