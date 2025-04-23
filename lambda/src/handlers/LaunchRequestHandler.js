'use strict';

const { getWelcomeMessage } = require('../utils/responses');

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Initialize session attributes
        sessionAttributes.score = 0;
        sessionAttributes.quizzed = false;
        const stateCapitals = require('../utils/stateCapitals');
        sessionAttributes.statesToGuess = stateCapitals.getAllStates();
        
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        const speakOutput = getWelcomeMessage();
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .withSimpleCard('Welcome!', speakOutput)
            .getResponse();
    }
};