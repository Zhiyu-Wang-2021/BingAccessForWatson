const sendGetReqToBing = async (query, key) => {
    let queryList = ["?"]
    for (let [key, value] of Object.entries(query)) {
        queryList.push(`${key}=${value}`)
        queryList.push('&')
    }
    queryList.pop()
    let queryStr = queryList.join("")

    const res = await fetch('https://api.bing.microsoft.com/v7.0/search' + queryStr,{
        method: 'GET',
        headers: {
            "Ocp-Apim-Subscription-Key": key,
            "Content-Type": "application/json"
        },

    });
    if (res.ok) {
        return await res.json()
    }
}

module.exports = async function (context, req) {

    const body = req.body
    const params = {
        q: body.q || "Invalid",
        textDecorations: body.textDecorations || false,
        textFormat: body.textFormat || "RAW",
        count: body.count || 3,
        answerCount: body.answerCount || 3,
        safeSearch: "Moderate"
    }
    const key = req.headers["ocp-apim-subscription-key"]
    let data = await sendGetReqToBing(params, key)

    context.res = {
        // status: 200, /* Defaults to 200 */
        body: data,
        headers: { "Content-Type": "application/json" }
    };
}