const ACTIONS = {
    JOIN: "join",
    LEAVE: "leave",
    SHARE_ROOMS: "share-rooms",
    ADD_PEER: "add-peer",
    REMOVE_PEER: "remove-peer",
    RELAY_SDP: "relay-sdp",
    RELAY_ICE: "relay-ice",
    ICE_CANDIDATE: "ice-candidate",
    SESSION_DESCRIPTION: "session-description",
    REQUEST_INITIAL_ROOMS_UPDATE: "request-initial-rooms-update",
    ROOM_NEW_MESSAGE: "room-new-message",
    ROOM_RECEIVE_NEW_MESSAGE: "room-receive-new-message",
    MUTE_PEER: "mute-peer",
    UNMUTE_PEER: "unmute-peer",
    HANDLE_MUTE_TOGGLE: "handle-mute-toggle"
}

export default ACTIONS;