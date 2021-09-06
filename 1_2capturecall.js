'use strict';

const superagent = require('superagent');
const crypto = require('crypto');

var requestHost = 'apitest.cybersource.com';


//Credentials  Daniel
var merchantId = 'company_daniel';
var merchantKeyId = '02330251-f3c6-4710-9680-d85ce56a315a'
var merchantSecretKey = 'rTKVf+MefREvRCAPdaVyLti3BzoKrjw14PQoBNfQwQQ='



var payloadJSON =

{
    "clientReferenceInformation": {
        "code": "Capt12"
    },
    "orderInformation": {
        "amountDetails": {
            "totalAmount": "50.21",
            "currency": "USD"
        }
    }
}


var payloadforAuth2 = JSON.stringify(payloadJSON)





function paramToString(param) {
    if (param == undefined || param == null) {
        return '';
    }
    if (param instanceof Date) {
        return param.toJSON();
    }
    return param.toString();
}

function normalizeParams(params) {
    var newParams = {};
    for (var key in params) {
        if (params.hasOwnProperty(key) && params[key] != undefined && params[key] != null) {
            var value = params[key];
            if (Array.isArray(value)) {
                newParams[key] = value;
            } else {
                newParams[key] = paramToString(value);
            }
        }
    }
    return newParams;
}

function generateDigest(request) {
    var buffer = Buffer.from(payloadforAuth2, 'utf8');

    const hash = crypto.createHash('sha256');

    hash.update(buffer);

    var digest = hash.digest('base64');

    return digest;
}

function getHttpSignature(resource, method, request) {
    var signatureHeader = "";
    var signatureValue = "";


    // KeyId is the key obtained from EBC
    signatureHeader += "keyid=\"" + merchantKeyId + "\"";

    // Algorithm should be always HmacSHA256 for http signature
    signatureHeader += ", algorithm=\"HmacSHA256\"";

    // Headers - list is choosen based on HTTP method. 
    // Digest is not required for GET Method
    if (method === "get") {
        var headersForGetMethod = "host date (request-target) v-c-merchant-id";
        signatureHeader += ", headers=\"" + headersForGetMethod + "\"";
    }
    else if (method === "post") {
        var headersForPostMethod = "host date (request-target) digest v-c-merchant-id";
        signatureHeader += ", headers=\"" + headersForPostMethod + "\"";
    }

    var signatureString = 'host: ' + requestHost;

    signatureString += '\ndate: ' + new Date(Date.now()).toUTCString();
    signatureString += '\n(request-target): ';

    if (method === "get") {
        var targetUrlForGet = "get " + resource;
        signatureString += targetUrlForGet + '\n';
    }
    else if (method === "post") {
        // Digest for POST call
        var digest = generateDigest(payloadforAuth2);

        var targetUrlForPost = "post " + resource;
        signatureString += targetUrlForPost + '\n';

        signatureString += 'digest: SHA-256=' + digest + '\n';
    }

    signatureString += 'v-c-merchant-id: ' + merchantId;

    var data = new Buffer.from(signatureString, 'utf8');

    // Decoding scecret key
    var key = new Buffer.from(merchantSecretKey, 'base64');

    signatureValue = crypto.createHmac('sha256', key)
        .update(data)
        .digest('base64');

    signatureHeader += ", signature=\"" + signatureValue + "\"";

    return signatureHeader;
}

var bodyParam = payloadforAuth2;
var uri = ''
function processPost(bodyParam, uri = '', callback) {
    var resource = "/pts/v2/payments/6308050612566254804002/captures";
    var uri = "";
    var method = "post";
    var statusCode = -1;
    var url = 'https://' + requestHost + resource + uri;

    var headerParams = {};
    var contentType = 'application/json;charset=utf-8';
    var acceptType = 'application/hal+json;charset=utf-8';

    var request = superagent(method, url);

    var signature = getHttpSignature(resource, method, request);

    var date = new Date(Date.now()).toUTCString();

    var digest = generateDigest(payloadforAuth2);
    digest = "SHA-256=" + digest;

    console.log("\n -- RequestURL --");
    console.log("\tURL : " + url);
    console.log("\n -- HTTP Headers --");
    console.log("\tContent-Type : application/json;charset=utf-8");
    console.log("\tv-c-merchant-id : " + merchantId);
    console.log("\tDate : " + date);
    console.log("\tHost : " + requestHost);
    console.log("\tSignature : " + signature);
    console.log("\tDigest : " + digest);

    headerParams['digest'] = digest;

    headerParams['v-c-merchant-id'] = merchantId;
    headerParams['date'] = date;
    headerParams['host'] = requestHost;
    headerParams['signature'] = signature;
    headerParams['User-Agent'] = "Mozilla/5.0";

    // Set header parameters
    request.set(normalizeParams(headerParams));

    // Set request timeout
    request.timeout(60000);

    request.type(contentType);

    request.send(bodyParam);

    request.accept(acceptType);

    request.end(function (error, response) {
        var data = response.body;
        if (data == null || (typeof data === 'object' && typeof data.length === 'undefined' && !Object.keys(data).length)) {
            // SuperAgent does not always produce a body; use the unparsed response as a fallback
            data = response.text;
        }

        console.log("\n -- Response Message for POST call --");
        console.log("\tResponse Code : " + response['status']);
        console.log("\tv-c-correlation-id : " + response.headers['v-c-correlation-id']);
        console.log("\tResponse Data :");
        console.log(JSON.stringify(data));

        var _status = -1;
        if (response['status'] >= 200 && response['status'] <= 299) {
            _status = 0;
        }

        callback(error, data, response, _status);
    });

    return request;
}








function standaloneHttpSignature(callback) {
    // HTTP POST REQUEST	
    console.log('\n\nSample 1: POST call - CyberSource Payments API - HTTP POST Payment request');
    processPost(bodyParam, uri = '', function (error, data, response, statusCode) {
        if (statusCode == 0) {
            console.log("\nSTATUS : SUCCESS Second Call (HTTP Status = " + statusCode + ")");
            var data1 = data
            console.log('data1&&&&&&&&&&&&&&&&&', data1)

        }
        else {
            console.log("\nSTATUS : ERROR Second Call (HTTP Status = " + statusCode + ")");
        }
    });


}





if (require.main === module) {
    standaloneHttpSignature(function () {
        console.log('\nStandAlone Http Signature end.');
    }, false);
}
module.exports.standaloneHttpSignature = standaloneHttpSignature;