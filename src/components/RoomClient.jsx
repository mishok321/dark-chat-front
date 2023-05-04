import { useState } from "react";
import default_avatar from "../assets/user_white.svg";
import hark from "hark";

export default function RoomClient({ client, provideMediaRef }) {
    const [ isSpeaking, setIsSpeaking ] = useState(false);

    return (
        <div className={"room__card rounded-md m-2 flex flex-col justify-center items-center" + (isSpeaking ? 
                " room__card-speaking" : "")}>
            <img className="w-16 h-16" src={default_avatar} alt="avatar" />    
            <p className="font-rubik-bold">{ client.username }</p>
            <audio
                ref={instance => {
                    provideMediaRef(client.peerID, instance)
                    if (instance !== null) {
                        const speech = hark(client.stream, { threshold: -70 });
                        speech.on("speaking", () => setIsSpeaking(true));
                        speech.on("stopped_speaking", () => setIsSpeaking(false));
                    }
                }}
                autoPlay
                playsInline
            />
        </div>
    )
}