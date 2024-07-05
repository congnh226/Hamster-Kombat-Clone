import stores from "../../stores";
import messagesList from "./messages.js";

const success = message => {
    stores.notificationStore.push({
        color: "success",
        message: messagesList[message] || message
    });
};

const error = message => {
    stores.notificationStore.push({
        color: "danger",
        message: messagesList[message] || message
    });
};

const warning = message => {
    stores.notificationStore.push({
        color: "warning",
        message: messagesList[message] || message
    });
};

const notificationService = {
    success,
    error,
    warning
};

export default notificationService;
