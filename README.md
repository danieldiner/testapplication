# testapplication
Test Aplication for Payments Integration

## Overview and Scope
The scope of this repo is to consume an API and perform the next tasks: 

1. One authorization transaction and one capture a transaction in two different calls (two different requests)
2. One authorization transaction and one capture a transaction in one single call (one single request)
3. One authorization reversal
4. One authorization credit (refund)
5. Trigger one decision manager rejection rule, rejecting transactions using the email address emailtoreject@enviromnent.com

## Prerequisite 

For the usage of this repo you need to have installed Both Node and npm  
https://docs.npmjs.com/downloading-and-installing-node-js-and-npm


## Usage 

Clone the Repo

git clone https://github.com/danieldiner/testapplication.git

install the SDk for the Payments API

   `npm install`
   
run the code in order to preform the specified action 


i.e. 

`node 1_1auth.js`

Use the Payment-id to modify the resource

`line 134-  var resource = "/pts/v2/payments/6308050612566254804002/captures";`

into 1_2capturecall.js URL to submit the Authorization for captue. Save changes.  


`node 1_2capturecall.js`


Same applies for all of the request URLs including /{id}/

For further reference, check the [API resource here]
(https://developer.cybersource.com/api-reference-assets/index.html#static-api-endpoints-section)


## Keys Used 
Keys used from the Test environment:

```
//Credentials  Daniel
var merchantId = 'company_daniel';
var merchantKeyId = '02330251-f3c6-4710-9680-d85ce56a315a'
var merchantSecretKey = 'rTKVf+MefREvRCAPdaVyLti3BzoKrjw14PQoBNfQwQQ='
```

## Resources Used 

**REST API Reference**
- https://developer.cybersource.com/api-reference-assets/index.html


**Official Repository for the Intregration with the API**
- https://github.com/CyberSource/cybersource-rest-samples-node 


**Official Postman Documentation for the API**
- https://documenter.getpostman.com/view/2960117/S17m1riA#95d2f779-e2be-4939-8a14-40e1016f397c


**Account Creation for key generation and Transaction visualization**
- https://developer.cybersource.com/api/developer-guides/dita-gettingstarted/registration.html


