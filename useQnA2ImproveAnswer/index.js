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

const sendBingResToQnA = async (snippets, question) => {
    const records = snippets.map((s, index) => {
        return `{"id":"${index}","text":"${s}","language":"en"}`
    }).join(",")

    const options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Ocp-Apim-Subscription-Key': 'd74ad5e2d424461484b0b8d47bd614e9'
        },
        body: `{"records":[${records}],"question":"${question}"}`
    };

    return await fetch('https://nhsfreeqa.cognitiveservices.azure.com/language/:query-text?api-version=2021-10-01', options)
        .then(response => response.json())
        .catch(err => console.error(err));
}

module.exports = async function (context, req) {

    const miniumConfidenceScore = 0.4
    const miniumCS4ConciseAns = 0.3
    const miniumCS4PossibleAns = 0.2

    const body = req.body
    const params = {
        q: `${body.q} site:${body.site}`,
        textDecorations: false,
        textFormat: "RAW",
        count: 5,
        answerCount: 5,
        safeSearch: "Moderate"
    }
    const key = req.headers["ocp-apim-subscription-key"]
    let data = await sendGetReqToBing(params, key)
    context.log(`received ${data["webPages"]["value"].length} data from bing`)

    const bingResults = data["webPages"]["value"].map(d => {
        return {
            "name": d.name,
            "url": d.url,
            "snippet": d.snippet
        }
    })

    data = data["webPages"]["value"].map(d => d["snippet"])
    // data = data.join("\n\n")

    context.log(`sending data to QnA`)

    data = await sendBingResToQnA(data, body.q)
    context.log(data)
    context.log("received data from QnA, the highest confidence score is " + data.answers[0].confidenceScore)

    const topAnswer = data.answers[0]
    let result = "Sorry, I am having difficulties finding related information on our website to answer your question."
    let resultConcise = ""
    if(topAnswer.confidenceScore > miniumConfidenceScore){
        result = topAnswer.answer
        if(topAnswer.answerSpan.confidenceScore > miniumCS4ConciseAns){
            resultConcise = topAnswer.answerSpan.text
        }
    }


    context.res = {
        // status: 200, /* Defaults to 200 */
        body: {
            "answer": result,
            "conciseAnswer": resultConcise,
            "confidenceScore": topAnswer.confidenceScore,
            "cs4conciseAns": topAnswer.answerSpan.confidenceScore,
            "possibleAnswer": topAnswer.confidenceScore > miniumCS4PossibleAns && topAnswer.confidenceScore <= miniumConfidenceScore
                ? topAnswer.answer : "No possible answer",
            "bingResults": bingResults
        },
        headers: { "Content-Type": "application/json" }
    };
}