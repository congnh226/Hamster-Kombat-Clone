import requests from "../http";

const updateOrAddUserApi = data => {
    return requests.post("/auth/login", data);
}

export {
    updateOrAddUserApi
}
