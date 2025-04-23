'use strict';

const { expect } = require('chai');
const sinon = require('sinon');
const testEvents = require('./testEvents');

// Import handlers
const LaunchRequestHandler = require('../../lambda/src/handlers/LaunchRequestHandler');
const AnswerIntentHandler = require('../../lambda/src/handlers/AnswerIntentHandler');
const ResponseIntentHandler = require('../../lambda/src/handlers/ResponseIntentHandler');
const AskCapitalIntentHandler = require('../../lambda/src/handlers/AskCapitalIntentHandler');
const HelpIntentHandler = require('../../lambda/src/handlers/HelpIntentHandler');
const QuitIntentHandler = require('../../lambda/src/handlers/QuitIntentHandler');
const CancelAndStopIntentHandler = require('../../lambda/src/handlers/CancelAndStopIntentHandler');
const SessionEndedRequestHandler = require('../../lambda/src/handlers/SessionEndedRequestHandler');

describe('Alexa Skill Handlers', () => {
    let handlerInput;
    let sandbox;
    
    beforeEach(() => {
        sandbox = sinon.createSandbox();
        
        // Create a mock handlerInput object before each test
        handlerInput = {
            requestEnvelope: {},
            attributesManager: {
                getSessionAttributes: () => ({}),
                setSessionAttributes: () => {}
            },
            responseBuilder: {
                speak: function(speechText) { this.speechText = speechText; return this; },
                reprompt: function(repromptText) { this.repromptText = repromptText; return this; },
                withSimpleCard: function(title, content) { this.cardTitle = title; this.cardContent = content; return this; },
                withShouldEndSession: function(shouldEnd) { this.shouldEndSession = shouldEnd; return this; },
                getResponse: function() { return this; }
            }
        };
    });
    
    afterEach(() => {
        sandbox.restore();
    });
    
    describe('LaunchRequestHandler', () => {
        it('should handle launch requests', () => {
            handlerInput.requestEnvelope = testEvents.launchRequest;
            
            // Spy on the attributesManager
            const setAttributesSpy = sandbox.spy(handlerInput.attributesManager, 'setSessionAttributes');
            
            expect(LaunchRequestHandler.canHandle(handlerInput)).to.be.true;
            
            const response = LaunchRequestHandler.handle(handlerInput);
            
            // Verify the session attributes were set
            expect(setAttributesSpy.calledOnce).to.be.true;
            
            // Verify the response
            expect(response.speechText).to.include('Welcome to US Capitals');
            expect(response.repromptText).to.include('Welcome to US Capitals');
            expect(response.cardTitle).to.equal('Welcome!');
        });
    });
    
    describe('AnswerIntentHandler', () => {
        it('should handle answer intent with valid state', () => {
            handlerInput.requestEnvelope = testEvents.answerIntentRequest;
            
            expect(AnswerIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = AnswerIntentHandler.handle(handlerInput);
            
            // Verify the response for a valid state
            expect(response.speechText).to.include('The capital of California is Sacramento');
            expect(response.cardTitle).to.equal('And the answer is...');
        });
        
        it('should handle answer intent with invalid state', () => {
            // Create a deep copy of the request and modify it
            const invalidStateRequest = JSON.parse(JSON.stringify(testEvents.answerIntentRequest));
            invalidStateRequest.request.intent.slots.State.value = 'NotAState';
            
            handlerInput.requestEnvelope = invalidStateRequest;
            
            const response = AnswerIntentHandler.handle(handlerInput);
            
            // Verify the response for an invalid state
            expect(response.speechText).to.include('I did not recognize that as a valid US state');
        });
        
        it('should handle answer intent with missing state slot', () => {
            // Create a deep copy of the request and modify it to remove the state value
            const noStateRequest = JSON.parse(JSON.stringify(testEvents.answerIntentRequest));
            noStateRequest.request.intent.slots.State.value = undefined;
            
            handlerInput.requestEnvelope = noStateRequest;
            
            const response = AnswerIntentHandler.handle(handlerInput);
            
            // Verify the response when no state is provided
            expect(response.speechText).to.include('not sure what state');
        });
    });
    
    describe('AskCapitalIntentHandler', () => {
        it('should handle ask intent and return a question about a state', () => {
            handlerInput.requestEnvelope = testEvents.askIntentRequest;
            
            // Mock session attributes with states to guess
            const mockAttributes = {
                score: 0,
                statesToGuess: ['Alabama', 'Alaska', 'California']
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            expect(AskCapitalIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = AskCapitalIntentHandler.handle(handlerInput);
            
            // Verify the response asks for a capital
            expect(response.speechText).to.include('What is the capital of');
            expect(response.repromptText).to.include('What is the capital of');
            expect(response.cardTitle).to.equal('And the question is...');
            
            // Verify quizzed flag was set to true
            expect(mockAttributes.quizzed).to.be.true;
        });
        
        it('should handle ask intent when no more states to guess', () => {
            handlerInput.requestEnvelope = testEvents.askIntentRequest;
            
            // Mock session attributes with empty states array
            const mockAttributes = {
                score: 5,
                statesToGuess: []
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            const response = AskCapitalIntentHandler.handle(handlerInput);
            
            // Verify response indicates quiz completion
            expect(response.speechText).to.include('Thank you for playing');
            expect(response.speechText).to.include('final score was 5');
            expect(response.cardTitle).to.equal('Quiz Complete');
        });
    });
    
    describe('ResponseIntentHandler', () => {
        it('should handle correct capital responses', () => {
            handlerInput.requestEnvelope = testEvents.responseIntentRequest;
            
            // Mock session attributes
            const mockAttributes = {
                score: 0,
                quizzed: true,
                statesToGuess: ['Alabama', 'Alaska', 'California'],
                state: 'California'
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            expect(ResponseIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = ResponseIntentHandler.handle(handlerInput);
            
            // Verify correct answer response
            expect(response.speechText).to.include('You are correct');
            expect(response.speechText).to.include('score is now 1');
            expect(response.cardTitle).to.equal('And the answer is...');
            
            // Verify state was removed from list and score was incremented
            expect(mockAttributes.score).to.equal(1);
            expect(mockAttributes.statesToGuess).to.not.include('California');
        });
        
        it('should handle incorrect capital responses', () => {
            const wrongCapitalRequest = JSON.parse(JSON.stringify(testEvents.responseIntentRequest));
            wrongCapitalRequest.request.intent.slots.Capital.value = 'Los Angeles';
            handlerInput.requestEnvelope = wrongCapitalRequest;
            
            // Mock session attributes
            const mockAttributes = {
                score: 1,
                quizzed: true,
                statesToGuess: ['Alabama', 'Alaska', 'California'],
                state: 'California'
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            const response = ResponseIntentHandler.handle(handlerInput);
            
            // Verify incorrect answer response
            expect(response.speechText).to.include('Incorrect');
            expect(response.speechText).to.include('capital of California is Sacramento');
            expect(response.speechText).to.include('score is now 0');
            
            // Verify score was decremented but state wasn't removed
            expect(mockAttributes.score).to.equal(0);
            expect(mockAttributes.statesToGuess).to.include('California');
        });
        
        it('should handle responses when no question was asked', () => {
            handlerInput.requestEnvelope = testEvents.responseIntentRequest;
            
            // Mock session attributes with no state
            const mockAttributes = {
                score: 0,
                quizzed: true,
                statesToGuess: ['Alabama', 'Alaska', 'California']
                // No state attribute
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            const response = ResponseIntentHandler.handle(handlerInput);
            
            // Verify appropriate response when no question is pending
            expect(response.speechText).to.include('Ask me to quiz you');
        });
    });
    
    describe('HelpIntentHandler', () => {
        it('should handle help intent', () => {
            handlerInput.requestEnvelope = testEvents.helpIntentRequest;
            
            expect(HelpIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = HelpIntentHandler.handle(handlerInput);
            
            // Verify help message
            expect(response.speechText).to.include('Welcome to US Capitals');
            expect(response.speechText).to.include('ask me');
            expect(response.cardTitle).to.equal('Help');
        });
    });
    
    describe('QuitIntentHandler', () => {
        it('should handle quit intent with score', () => {
            handlerInput.requestEnvelope = testEvents.quitIntentRequest;
            
            // Explicitly set the session attributes here to ensure it's properly passed
            const mockAttributes = {
                score: 10,
                quizzed: true
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            expect(QuitIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = QuitIntentHandler.handle(handlerInput);
            
            // Debug log the response
            console.log('QuitIntent response:', response.speechText);
            
            // Verify quit message with score
            expect(response.speechText).to.include('Thank you for chatting with US Capitals');
            expect(response.speechText).to.include('Your final score was 10');
            expect(response.cardTitle).to.equal('Goodbye');
            expect(response.shouldEndSession).to.be.true;
        });
        
        it('should handle quit intent without quiz', () => {
            handlerInput.requestEnvelope = testEvents.quitIntentRequest;
            
            // Mock attributes without quizzed flag
            const mockAttributes = {
                score: 0,
                quizzed: false
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            const response = QuitIntentHandler.handle(handlerInput);
            console.log('QuitIntent no quiz response:', response.speechText);
            
            // Verify quit message without score
            expect(response.speechText).to.include('Thank you for chatting with US Capitals');
            expect(response.speechText).to.not.include('final score');
        });
    });
    
    describe('CancelAndStopIntentHandler', () => {
        it('should handle cancel intent', () => {
            handlerInput.requestEnvelope = testEvents.cancelIntentRequest;
            
            // Explicitly set the session attributes
            const mockAttributes = {
                score: 5,
                quizzed: true
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            expect(CancelAndStopIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = CancelAndStopIntentHandler.handle(handlerInput);
            console.log('CancelIntent response:', response.speechText);
            
            // Verify cancel/stop message
            expect(response.speechText).to.include('Thank you for playing');
            expect(response.speechText).to.include('Your final score was 5');
            expect(response.shouldEndSession).to.be.true;
        });
        
        it('should handle stop intent', () => {
            handlerInput.requestEnvelope = testEvents.stopIntentRequest;
            
            // Explicitly set the session attributes
            const mockAttributes = {
                score: 5,
                quizzed: true
            };
            sandbox.stub(handlerInput.attributesManager, 'getSessionAttributes').returns(mockAttributes);
            
            expect(CancelAndStopIntentHandler.canHandle(handlerInput)).to.be.true;
            
            const response = CancelAndStopIntentHandler.handle(handlerInput);
            console.log('StopIntent response:', response.speechText);
            
            // Verify cancel/stop message
            expect(response.speechText).to.include('Thank you for playing');
            expect(response.speechText).to.include('Your final score was 5');
            expect(response.shouldEndSession).to.be.true;
        });
    });
    
    describe('SessionEndedRequestHandler', () => {
        it('should handle session ended request', () => {
            handlerInput.requestEnvelope = testEvents.sessionEndedRequest;
            
            // Spy on console.log
            const consoleLogSpy = sandbox.spy(console, 'log');
            
            expect(SessionEndedRequestHandler.canHandle(handlerInput)).to.be.true;
            
            const response = SessionEndedRequestHandler.handle(handlerInput);
            
            // Verify logging
            expect(consoleLogSpy.calledWith(sinon.match(/Session ended with reason/))).to.be.true;
            expect(consoleLogSpy.calledWith(sinon.match(/USER_INITIATED/))).to.be.true;
        });
    });
});