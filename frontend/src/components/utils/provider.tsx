const api = 'http://127.0.0.1:8000/es/api/';

/**
 * Get value list
 */
export function getValueList(type: string) {
    let url = api + type + '/';
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
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
export function createValue(type: string, value: any) {
    let url = api + type + '/';
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
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
 * Edit value
 */
export function editValue(type: string, id: number, value: any) {
    let url = api + type + '/' + id + '/';
    return new Promise((resolve, reject) => {
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
export function deleteValue(type: string, id: string) {
    let url = api + type + '/' + id + '/';
    return new Promise((resolve, reject) => {
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