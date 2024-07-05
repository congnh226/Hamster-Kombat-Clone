import requests from "../http";

const updateOrAddUserApi = data => {
    return requests.post("/login", data);
}

export {
    updateOrAddUserApi
}
