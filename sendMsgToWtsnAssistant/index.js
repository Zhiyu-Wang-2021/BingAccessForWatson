module.exports = async function (context, req) {

    const token = req.body.token
    const msg = req.body.msg
    const instanceId = req.body.instanceId
    const workspaceId = req.body.workspaceId

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        },
        body: `{"input":{"text":"${msg}","spelling_suggestions":true,"spelling_auto_correct":true}}`
    };

    const baseUrl = "https://api.us-south.assistant.watson.cloud.ibm.com"
    const version = "2021-11-27"

    const res = await fetch(`${baseUrl}/instances/${instanceId}/v1/workspaces/${workspaceId}/message?version=${version}`, options)
        .then(response => response.json())

    context.res = {
        headers: {
            'Content-Type': 'application/json'
        },
        body: {
            "text": res["output"]["generic"][0]["text"] || "invaild"
        }
    };
}