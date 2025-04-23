'use strict';

const stateCapitals = require('../utils/stateCapitals');

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Response';
    },
    handle(handlerInput) {
        const { requestEnvelope } = handlerInput;
        const { intent } = requestEnvelope.request;
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let speechOutput = '';
        let repromptText = 'Ask me to quiz you or ask me for a capital.';
        
        // Get the capital slot value
        if (intent.slots && intent.slots.Capital && intent.slots.Capital.value) {
            const capital = intent.slots.Capital.value;
            const state = sessionAttributes.state;
            const statesToGuess = sessionAttributes.statesToGuess;
            
            // Make sure there is an unanswered question
            if (stateCapitals.isState(state)) {
                if (stateCapitals.isCapitalOfState(capital, state)) {
                    // Correct response
                    sessionAttributes.score += 1;
                    speechOutput = 'You are correct!';
                    sessionAttributes.statesToGuess = stateCapitals.removeState(statesToGuess, state);
                } else {
                    // Incorrect response
                    sessionAttributes.score -= 1;
                    const correctCapital = stateCapitals.getCapitalForState(state);
                    speechOutput = `Incorrect! The capital of ${state} is ${correctCapital}.`;
                }
                
                // Don't allow answering the same question twice
                delete sessionAttributes.state;
                speechOutput += ` Your score is now ${sessionAttributes.score}.`;
            } else {
                speechOutput = 'Ask me to quiz you or ask me for a capital.';
            }
        } else {
            speechOutput = 'I didn\'t catch that capital name.';
        }
        
        handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
        
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .reprompt(repromptText)
            .withSimpleCard('And the answer is...', speechOutput)
            .getResponse();
    }
};