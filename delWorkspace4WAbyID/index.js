module.exports = async function (context, req) {
    let url = `https://api.us-south.assistant.watson.cloud.ibm.com/instances/${req.headers.instanceid}/v1/workspaces/${req.headers.workspaceid}?version=2021-11-27`;

    let options = {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${req.headers.token}`
        }
    };

    const res = await fetch(url, options)
        .then(res => res.json())
        .catch(err => context.error('error:' + err));

    context.res = {
        status: res["error"] === undefined ? 200 : 400,
        body: res
    };
}