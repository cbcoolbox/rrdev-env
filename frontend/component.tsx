import * as React from "react";

export default class Component extends React.Component <{}> {
    getData() {
        postData('/api', {"query": "query { users(id:2) firstName(render:value), lastName, payments { products_id }}"}).then(data => {
            console.log("successful", data);
        }).catch(err => {
            console.log("error", err);
        });
    }


    render() {
        return (
            <>
                <h3>what the WHATTT</h3>
                <button onClick={() => this.getData()}>Get the perfect data.</button>
            </>
        );
    }
}

// Example POST method implementation:
async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
        'Content-Type': 'application/json'
        // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });

    return response.json(); // parses JSON response into native JavaScript objects
}