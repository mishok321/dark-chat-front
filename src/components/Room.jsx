import { useParams } from "react-router-dom";
import Header from "./Header";
import useWebRTC from "../hooks/useWebRTC";
import RoomClient from "./RoomClient";
import socket from "../socket/index";
import { useEffect, useState } from "react";
import ACTIONS from "../constants/actions";
import ReactDOM from "react-dom";

export default function Room() {
    window.onpopstate = () => {
        ReactDOM.render(null, document.getElementById("root"));
        window.location.reload();
    }

    const { id: roomID } = useParams();
    const { clients, provideMediaRef } = useWebRTC(roomID);

    const [ roomMessages, setRoomMessages ] = useState([]);

    const classColors = ["text-orange-500", "text-amber-400", "text-yellow-400", 
        "text-lime-500", "text-green-500", "text-emerald-500", "text-teal-500",
        "text-cyan-400", "text-sky-500", "text-blue-600", "text-indigo-800", "text-violet-700",
        "text-purple-800", "text-fuchsia-700", "text-pink-600", "text-rose-600"];

    let [ myColor ] = useState(classColors[Math.floor(Math.random() * classColors.length)]);

    useEffect(() => {
        socket.on(ACTIONS.ROOM_RECEIVE_NEW_MESSAGE, ({ message, author, color }) => {
            const messageObject = {message, author, color};
            setRoomMessages(prev => {
                return [messageObject, ...prev];
            });
        });
    }, []);

    return (
        <div className="bg-gray-950 text-white room-wrapper flex flex-col">
            <Header isRoomPage={ true } />
            <div className="h-full my-auto flex">
                <div className="room grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grow">
                    {clients.map((client, i) => 
                        <RoomClient
                            key={client.peerID}
                            client={client}
                            provideMediaRef={provideMediaRef} />
                    )}
                </div>
                <div className="room__sidebar rounded bg-gray-900 flex flex-col">
                    <hr />
                    <input
                        type="text"
                        className="my-2 rounded mx-3 p-1 text-black"
                        placeholder="Message..." 
                        required
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && e.target.value !== "") {
                                socket.emit(ACTIONS.ROOM_NEW_MESSAGE, {
                                    roomID,
                                    message: e.target.value,
                                    author: clients[0].username,
                                    color: myColor
                                });
                                e.target.value = "";
                            }
                        }}/>
                    <ul className="overflow-auto">
                        {roomMessages.map((m, i) => <li className="p-2" key={i}>
                            <span className={m.color}>{ m.author }: </span>
                            <span>{ m.message }</span>
                        </li>)}
                    </ul>
                </div>
            </div>
        </div>
    )
}