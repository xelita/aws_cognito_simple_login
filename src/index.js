"use strict";

// imports
const AWS = require('aws-sdk');
const cognitoIdentitySP = new AWS.CognitoIdentityServiceProvider({ region: 'eu-west-1' });

const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// process args
let args = process.argv.slice(2);

// args
let poolId = args[0];
console.log(`poolId: ${poolId}`);

let clientId = args[1];
console.log(`clientId: ${clientId}`);

let email = args[2];
console.log(`email: ${email}`);

let password = args[3];
console.log(`password: ${password}`);

let confirmationCode = args[4];
console.log(`confirmationCode: ${confirmationCode}`);

// callbacks
const onSuccess = (result) => console.log(result);
const onFailure = (error) => console.log(error, error.stack);

// signup function
const signUp = (email, password, onSuccess, onFailure) => {
    // pool
    let poolData = {
        UserPoolId: poolId,
        ClientId: clientId
    }
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // user attributes
    let userAttributes = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: email
        })
    ];

    // signing up>
    userPool.signUp(email, password, userAttributes, null, (error, result) => {
        if (error) {
            onFailure(error);
        }
        else {
            onSuccess(result);
        }
    });
};

// confirm signup function
const confirmSignUp = (email, confirmationCode, onSuccess, onFailure) => {
    // pool
    let poolData = {
        UserPoolId: poolId,
        ClientId: clientId
    }
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // user attributes
    let userAttributes = [
        new AmazonCognitoIdentity.CognitoUserAttribute({
            Name: 'email',
            Value: email
        })
    ];

    // signing up>
    cognitoUser(email).confirmRegistration(confirmationCode, false, (error, result) => {
        if (error) {
            onFailure(error);
        }
        else {
            onSuccess(result);
        }
    });
};

// sign a user in
const signIn = (email, password, onSuccess, onFailure) => {
    // authentication
    let authenticationData = {
        Username: email,
        Password: password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);

    // authentication
    cognitoUser(email).authenticateUser(authenticationDetails, {
        onSuccess: onSuccess,
        onFailure: onFailure
    });
};

// create an instance of cognito user
const cognitoUser = (email) => {
    // pool
    let poolData = {
        UserPoolId: poolId,
        ClientId: clientId
    }
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    // user
    let userData = {
        Username: email,
        Pool: userPool
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
}

// execution
//signUp(email, password, onSuccess, onFailure);
//confirmSignUp(email, confirmationCode, onSuccess, onFailure);
//signIn(email, password, onSuccess, onFailure);