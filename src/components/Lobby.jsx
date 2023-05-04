import { useNavigate } from "react-router-dom";
import Header from "./Header";
import close_white from "../assets/close-white.svg";
import { useEffect, useRef, useState } from "react";
import socket from "../socket";
import actions from "../constants/actions";
import { v4 } from "uuid";

export default function Lobby({ setIsToken }) {

    const [ rooms, updateRooms ] = useState([]);
    const rootNode = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit(actions.REQUEST_INITIAL_ROOMS_UPDATE);
        socket.on(actions.SHARE_ROOMS, ({ rooms = [] } = {}) => {
            if (rootNode.current) {
                updateRooms(rooms);
            }
        });
    }, []);

    return (
        <div className="lobby-wrapper bg-gray-950" ref={rootNode}>
            <Header setIsToken={setIsToken} isRoomPage={ false } />
                <h1 className="text-center font-mono text-white text-4xl mt-6 mb-10 select-none relative">
                    Rooms 
                    <button onClick={() => navigate(`/room/${v4()}`)} className="ml-5">
                        <img className="image-lobby-add h-7 w-7 rotate-45 absolute top-2  shake"
                            src={close_white} alt="Create" />
                    </button>
                </h1>
                <div className="lobby pb-10 grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2">
                    {rooms.length === 0 && <p className="text-center text-xl">No rooms</p>}
                    {rooms.length !== 0 && rooms.map((room, i) => <div style={{ "animationDelay": (i * 0.2) + "s" }}
                        className="lobby__item p-2 opacity-0 h-52" key={room.roomID}>
                        <div onClick={() => navigate(`/room/${room.roomID}`)}
                                className="content
                                    rounded-md
                                    bg-gray-800
                                    hover:bg-gray-600
                                    transition
                                    hover:cursor-pointer
                                    hover:-translate-y-2
                                    p-4
                                    h-full
                                    w-full">
                                <div className="flex flex-col h-full w-full">
                                    <p className="lobby__item-username text-xl font-rubik-bold">{room.username}</p>
                                    <p className="lobby__item-places grow">
                                        { room.usersInRoom } user{ room.usersInRoom === "1" ? "" : "s" }
                                    </p>
                                    <p className="lobby__item-uuid font-mono uuid-text-size">
                                        { room.roomID }
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
            </div>
        </div>
    )
}