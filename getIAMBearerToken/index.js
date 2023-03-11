module.exports = async function (context, req) {

    const apiKey = req.headers.iamkey

    const accessLink = `https://iam.cloud.ibm.com/identity/token?grant_type=urn%3Aibm%3Aparams%3Aoauth%3Agrant-type%3Aapikey&apikey=${apiKey}`
    const res = await fetch(
        accessLink,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }
    ).then(response => response.json())
    context.log(res.status)
    context.res = {
        status: res.status,
        body: res
    };
}