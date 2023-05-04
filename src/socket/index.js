import io from "socket.io-client";
import links from "../constants/links";

const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity",
    timeout: 10000,
    transports: [ "websocket" ]
};

const socket = io(links.SOCKET, options);
export default socket;