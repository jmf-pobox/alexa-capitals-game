'use strict';

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let speechOutput = 'Goodbye!';
        if (sessionAttributes.quizzed) {
            speechOutput = `Thank you for playing! Your final score was ${sessionAttributes.score}. Goodbye!`;
        }
        
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard('Goodbye', speechOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};