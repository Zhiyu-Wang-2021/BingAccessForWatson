module.exports = async function (context, req) {

    const dialogJson = req.body
    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${req.headers.token}`
        },
        body: JSON.stringify(dialogJson)
    };

    let res = await fetch(`https://api.us-south.assistant.watson.cloud.ibm.com/instances/${req.headers.instanceid}/v1/workspaces?version=2021-11-27`, options)
        .then(response => response.json())
        .catch(err => context.error(err));

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: res
    };
}