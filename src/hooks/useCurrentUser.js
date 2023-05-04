import axios from "axios";
import { useEffect, useState } from "react";
import token from "../constants/token";
import links from "../constants/links";

export default function useCurrentUser() {
    const [username, setUsername] = useState("");

    const currentToken = localStorage.getItem(token.NAME);
    useEffect(() => {
        async function fetch() {
            await axios.get(links.BACKEND + "/user", {
                headers: {
                    Authorization: "Bearer " + currentToken
                }
            }).then(r => {
                if (r.data.status === 401) {
                    localStorage.removeItem(token.NAME);
                    return;
                }
                setUsername(r.data.username);
            })
            .catch(e => {
                console.warn("Error while fetching data about current user", e)
            });
        }
        fetch();
    });

    return { username };
}