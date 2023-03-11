module.exports = async function (context, req) {


    const token = req.body.token
    const instanceId = req.body.instanceId

    let res
    let options = {
        method: "GET",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }
    res = await fetch(`https://api.us-south.assistant.watson.cloud.ibm.com/instances/${instanceId}/v1/workspaces?version=2021-11-27`, options)
        .then(response => response.json())
        .catch(err => context.log(err));

    context.log(res)

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: res
    };
}