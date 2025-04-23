'use strict';

const { expect } = require('chai');
const responses = require('../../lambda/src/utils/responses');

describe('Responses Utils', () => {
    describe('getWelcomeMessage', () => {
        it('should return the welcome message', () => {
            const welcomeMessage = responses.getWelcomeMessage();
            expect(welcomeMessage).to.be.a('string');
            expect(welcomeMessage).to.include('Welcome to US Capitals');
            expect(welcomeMessage).to.include('ask me the capital');
            expect(welcomeMessage).to.include('quiz you');
        });
    });
});