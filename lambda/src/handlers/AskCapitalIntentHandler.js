'use strict';

// Import state capitals utils but only used indirectly
// through the handle function using the statesToGuess array
// const stateCapitals = require('../utils/stateCapitals');

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Ask';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        // Flag that the user has started a quiz
        sessionAttributes.quizzed = true;
        
        // Get states to guess
        const statesToGuess = sessionAttributes.statesToGuess;
        const guessesLeft = statesToGuess.length;
        
        let speechOutput;
        
        // If there are states left to guess, ask a question
        if (guessesLeft > 0) {
            const randomIndex = Math.floor(Math.random() * guessesLeft);
            const state = statesToGuess[randomIndex];
            sessionAttributes.state = state;
            speechOutput = `What is the capital of ${state}?`;
            
            handlerInput.attributesManager.setSessionAttributes(sessionAttributes);
            
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .reprompt(speechOutput)
                .withSimpleCard('And the question is...', speechOutput)
                .getResponse();
        } else {
            // If no states left, end the quiz
            speechOutput = `Thank you for playing! Your final score was ${sessionAttributes.score}.`;
            
            return handlerInput.responseBuilder
                .speak(speechOutput)
                .withSimpleCard('Quiz Complete', speechOutput)
                .getResponse();
        }
    }
};