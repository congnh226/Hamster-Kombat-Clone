import axios from "axios";
import config from "../../config";
import * as _ from "lodash";
import notificationService from "../notificationService";

const API_ROOT = config.API_ROOT;

// const encode = encodeURIComponent;

const handleErrors = err => {
    if (err && err.response && err.response.status === 401) {
        window.location.href = "/";
    }
    const errMessage =
        (err.response && err.response.data && err.response.data.message) ||
        "Something went wrong!";
    notificationService.error(errMessage);
    return Promise.reject(errMessage);
};

const responseBody = res => {
    const { data } = res;
    return data;
};

const http = axios.create({
    // withCredentials: true,
    headers: {
        "Content-Type": "application/json"
    }
});

const requests = {
    del: (url, body) =>
        http
            .delete(`${API_ROOT}${url}`, { data: body })
            .then(responseBody)
            .catch(handleErrors),
    get: url =>
        http
            .get(`${API_ROOT}${url}`)
            .then(responseBody)
            .catch(handleErrors),
    put: (url, body) =>
        http
            .put(`${API_ROOT}${url}`, body)
            .then(responseBody)
            .catch(handleErrors),
    patch: (url, body) =>
        http
            .patch(`${API_ROOT}${url}`, body)
            .then(responseBody)
            .catch(handleErrors),
    post: (url, body) =>
        http
            .post(`${API_ROOT}${url}`, body)
            .then(responseBody)
            .catch(handleErrors),
    sendWithFiles: (url, method, bodyData, files) => {
        let formData = new FormData();
        bodyData = _.omitBy(bodyData, dataItem => _.isNil(dataItem));

        if (files && files.length > 0) {
            for (let i = 0; i < files.length; i++) {
                for (let j = 0; j < files[i].files.length; j++) {
                    formData.append(
                        files[i].name,
                        files[i].files[j],
                        files[i].files[j]
                            ? files[i].files[j].name
                            : "__upload_file"
                    );
                }
            }
        }
        for (let [key, value] of Object.entries(bodyData)) {
            appendRecursive(formData, value, key);
        }
        return http[method](`${API_ROOT}${url}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        })
            .then(responseBody)
            .catch(handleErrors);
    }
};

const appendRecursive = (fData, data, prop) => {
    if ("object" === typeof data) {
        for (let [key, value] of Object.entries(fData)) {
            appendRecursive(fData, value, `${key}`);
        }
    } else {
        fData.append(prop, data);
    }
};

export default requests;
