'use strict';

const Alexa = require('ask-sdk-core');

// Import handlers
const LaunchRequestHandler = require('./src/handlers/LaunchRequestHandler');
const AskCapitalIntentHandler = require('./src/handlers/AskCapitalIntentHandler');
const AnswerIntentHandler = require('./src/handlers/AnswerIntentHandler');
const ResponseIntentHandler = require('./src/handlers/ResponseIntentHandler');
const QuitIntentHandler = require('./src/handlers/QuitIntentHandler');
const HelpIntentHandler = require('./src/handlers/HelpIntentHandler');
const CancelAndStopIntentHandler = require('./src/handlers/CancelAndStopIntentHandler');
const SessionEndedRequestHandler = require('./src/handlers/SessionEndedRequestHandler');

// Error handler
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        console.log(`Error handled: ${error.message}`);
        console.log(`Error stack: ${error.stack}`);
        const speakOutput = 'Sorry, I had trouble understanding your request. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

// Skill ID - replace with your skill ID
const SKILL_ID = 'amzn1.ask.skill.cf17cd64-e4c3-4210-b7c1-121b33aeb2c3';

// Lambda handler function
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        LaunchRequestHandler,
        AskCapitalIntentHandler,
        AnswerIntentHandler,
        ResponseIntentHandler,
        QuitIntentHandler,
        HelpIntentHandler,
        CancelAndStopIntentHandler,
        SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .withSkillId(SKILL_ID)
    .lambda();
