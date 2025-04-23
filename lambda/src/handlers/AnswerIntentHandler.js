'use strict';

const stateCapitals = require('../utils/stateCapitals');

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Answer';
    },
    handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const { intent } = requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let speechOutput = '';
        let repromptText = 'Ask me to quiz you or ask me for a capital.';
        
        // Get the state slot value
        if (intent.slots && intent.slots.State && intent.slots.State.value) {
            const state = intent.slots.State.value;
            
            if (stateCapitals.isState(state)) {
                const capital = stateCapitals.getCapitalForState(state);
                speechOutput = `The capital of ${state} is ${capital}.`;
            } else {
                speechOutput = 'I did not recognize that as a valid US state.';
            }
        } else {
            speechOutput = 'Hmmm... I\'m not sure what state you are talking about.';
        }
        
        // Make sure the user cannot immediately reuse an answer to earn a point
        delete sessionAttributes.state;
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptText)
            .withSimpleCard('And the answer is...', speechOutput)
            .getResponse();
    }
};