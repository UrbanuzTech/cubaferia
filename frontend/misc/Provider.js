const api = 'http://192.168.71.1:8000/es/api/';
const api_without_i18n = 'http://192.168.71.1:8000/api/';

/**
 * Get value list
 */
export async function getValueList(type) {
    let url = api + type + '/';
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(data => {
                resolve(data.json());
            }, (err) => {
                reject(err);
            });
    });
}

/**
 * Login
 */
export async function login(username, password) {
    let url = api_without_i18n + 'token/';
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({username: username, password: password}),
        })
            .then(data => {
                resolve(data);
            }, (err) => {
                reject(err);
            });
    });
}

/**
 * Create value
 */
export async function createValue(type, value) {
    let url = api + type + '/';
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        })
            .then(data => {
                resolve(data.json());
            }, (err) => {
                reject(err.json());
            });
    });
}

/**
 * Edit value
 */
export async function editValue(type, id, value) {
    let url = api + type + '/' + id + '/';
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(value),
        })
            .then(data => {
                resolve(data);
            }, (err) => {
                reject(err);
            });
    });
}

/**
 * Delete value
 */
export async function deleteValue(type, id) {
    let url = api + type + '/' + id + '/';
    return await new Promise((resolve, reject) => {
        fetch(url, {
            method: 'DELETE',
        })
            .then(data => {
                resolve(data);
            }, (err) => {
                reject(err);
            });
    });
}