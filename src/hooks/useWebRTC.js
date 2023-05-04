import { useCallback, useEffect, useRef } from "react";
import useStateWithCallback from "./useStateWithCallback";
import freeice from "freeice";
import socket from "../socket/index";
import actions from "../constants/actions";
import token from "../constants/token";
import links from "../constants/links";
import axios from "axios";

export const LOCAL_AUDIO = "LOCAL_AUDIO";

export default function useWebRTC(roomID) {
    const [clients, updateClients] = useStateWithCallback([]);

    const addNewClient = useCallback((newClient, cb) => {
        if (!clients.includes(newClient)) {
            updateClients(list => [...list, newClient], cb);
        }
    }, [clients, updateClients]);

    const peerConnections = useRef({});
    const localMediaStream = useRef(null);
    const peerMediaElements = useRef({
        [LOCAL_AUDIO]: null,
    });

    useEffect(() => {
        async function handleNewPeer({ peerID, createOffer, username }) {
            if (peerID in peerConnections.current) {
                return console.warn(`Already connected to peer ${peerID}`);
            }

            peerConnections.current[peerID] = new RTCPeerConnection({
                iceServers: freeice(),
            })

            peerConnections.current[peerID].onicecandidate = event => {
                if (event.candidate) {
                    socket.emit(actions.RELAY_ICE, {
                        peerID,
                        iceCandidate: event.candidate
                    });
                }
            };

            let tracksNumber = 0;
            peerConnections.current[peerID].ontrack = ({ streams: [remoteStream] }) => {
                tracksNumber++;

                if (tracksNumber === 1) {
                    addNewClient({peerID, stream: remoteStream, username, muted: false}, () => {
                        peerMediaElements.current[peerID].srcObject = remoteStream;
                    })
                }
            };

            localMediaStream.current.getTracks().forEach(track => {
                peerConnections.current[peerID].addTrack(track, localMediaStream.current);
            });

            if (createOffer) {
                const offer = await peerConnections.current[peerID].createOffer();
                await peerConnections.current[peerID].setLocalDescription(offer);
                socket.emit(actions.RELAY_SDP, {
                    peerID,
                    sessionDescription: offer
                });
            }
        }
        socket.on(actions.ADD_PEER, handleNewPeer);
    });

    useEffect(() => {
        async function setRemoteMedia({ peerID, sessionDescription: remoteDescription }) {
            await peerConnections.current[peerID].setRemoteDescription(
                new RTCSessionDescription(remoteDescription)
            );

            if (remoteDescription.type === "offer") {
                const answer = await peerConnections.current[peerID].createAnswer();
                await peerConnections.current[peerID].setLocalDescription(answer);
                socket.emit(actions.RELAY_SDP, {
                    peerID,
                    sessionDescription: answer
                });
            }
        }

        socket.on(actions.SESSION_DESCRIPTION, setRemoteMedia);
    }, []);

    useEffect(() => {
        socket.on(actions.ICE_CANDIDATE, ({ peerID, iceCandidate }) => {
            peerConnections.current[peerID].addIceCandidate(
                new RTCIceCandidate(iceCandidate)
            );
        });
    }, []);

    useEffect(() => {
        const handleRemovePeer = ({ peerID }) => {
            if (peerConnections.current[peerID]) {
                peerConnections.current[peerID].close();
            }

            delete peerConnections.current[peerID];
            delete peerMediaElements.current[peerID];
            updateClients(list => list.filter(c => c.peerID !== peerID));
        };
        socket.on(actions.REMOVE_PEER, handleRemovePeer);

        return () => {
            socket.off(actions.REMOVE_PEER);
        };
    });

    useEffect(() => {
        let username = "";
    
        const currentToken = localStorage.getItem(token.NAME);
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
                username = r.data.username;
                async function startCapture() {
                    localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                    });
        
                    addNewClient({peerID: LOCAL_AUDIO, stream: localMediaStream.current, username, muted: false}, () => {
                        const localAudioElement = peerMediaElements.current[LOCAL_AUDIO];
                        if (localAudioElement) {
                            localAudioElement.volume = 0;
                            localAudioElement.srcObject = localMediaStream.current;
                        }
                    });
                }
                startCapture()
                    .then(() => {
                        // !
                        socket.emit(actions.JOIN, { room: roomID, username });
                    })
                    .catch(e => console.warn("Error getting userMedia: ", e));
            })
            .catch(e => {
                console.warn("Error while fetching data about current user", e)
            });
        }
        fetch();

        return () => {
            localMediaStream.current.getTracks().forEach(track => track.stop());
            socket.emit(actions.LEAVE, { room: roomID })
        };
    }, [ roomID ]);

    const provideMediaRef = useCallback((id, node) => {
        peerMediaElements.current[id] = node;
    }, []);

    return {
        clients,
        provideMediaRef
    };
}