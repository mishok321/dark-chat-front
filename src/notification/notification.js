import { Store } from "react-notifications-component";

export default function notification(title, message, type) {
    Store.addNotification({
    title,
    message,
    type,
    insert: "bottom",
    container: "bottom-right",
    animationIn: ["animate__animated", "animate__fadeIn"],
    animationOut: ["animate__animated", "animate__fadeOut"],
    dismiss: {
        duration: 5000,
        onScreen: true
    }
});
}