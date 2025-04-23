'use strict';

module.exports = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'Quit';
    },
    handle(handlerInput) {
        const sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        
        let speechOutput = 'Thank you for chatting with US Capitals. ';
        if (sessionAttributes.quizzed) {
            speechOutput += `Your final score was ${sessionAttributes.score}.`;
        }
        
        return handlerInput.responseBuilder
            .speak(speechOutput)
            .withSimpleCard('Goodbye', speechOutput)
            .withShouldEndSession(true)
            .getResponse();
    }
};