const sendGetReqToBing = async (query) => {

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
            "Ocp-Apim-Subscription-Key": "ef99b91a0209431cb66dd4d32a0b20c6"
        },

    });
    if (res.ok) {
        return await res.json()
    }
}

const query = {
    "q": "query",
    "textDecorations": false,
    "textFormat": "RAW",
    "count": 1,
    "safeSearch": "Moderate"
}

const run = async () => {
    let data = await sendGetReqToBing(query)
    console.log(data)
}

run()