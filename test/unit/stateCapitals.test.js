'use strict';

const { expect } = require('chai');
const stateCapitals = require('../../lambda/src/utils/stateCapitals');

describe('State Capitals Utils', () => {
    describe('getAllStates', () => {
        it('should return an array of all US states', () => {
            const states = stateCapitals.getAllStates();
            expect(states).to.be.an('array');
            expect(states).to.have.length(50);
            expect(states).to.include('California');
            expect(states).to.include('New York');
            expect(states).to.include('Texas');
        });
    });

    describe('isState', () => {
        it('should return true for valid states', () => {
            expect(stateCapitals.isState('California')).to.be.true;
            expect(stateCapitals.isState('New York')).to.be.true;
            expect(stateCapitals.isState('Texas')).to.be.true;
        });

        it('should return false for invalid states', () => {
            expect(stateCapitals.isState('NotAState')).to.be.false;
            expect(stateCapitals.isState('')).to.be.false;
            expect(stateCapitals.isState(undefined)).to.be.false;
        });
    });

    describe('getCapitalForState', () => {
        it('should return the correct capital for a state', () => {
            expect(stateCapitals.getCapitalForState('California')).to.equal('Sacramento');
            expect(stateCapitals.getCapitalForState('New York')).to.equal('Albany');
            expect(stateCapitals.getCapitalForState('Texas')).to.equal('Austin');
        });

        it('should return "Unknown" for invalid states', () => {
            expect(stateCapitals.getCapitalForState('NotAState')).to.equal('Unknown');
            expect(stateCapitals.getCapitalForState('')).to.equal('Unknown');
            expect(stateCapitals.getCapitalForState(undefined)).to.equal('Unknown');
        });
    });

    describe('isCapitalOfState', () => {
        it('should return true for correct capital-state pairs', () => {
            expect(stateCapitals.isCapitalOfState('Sacramento', 'California')).to.be.true;
            expect(stateCapitals.isCapitalOfState('Albany', 'New York')).to.be.true;
            expect(stateCapitals.isCapitalOfState('Austin', 'Texas')).to.be.true;
        });

        it('should be case-insensitive', () => {
            expect(stateCapitals.isCapitalOfState('sacramento', 'California')).to.be.true;
            expect(stateCapitals.isCapitalOfState('ALBANY', 'New York')).to.be.true;
        });

        it('should return false for incorrect capital-state pairs', () => {
            expect(stateCapitals.isCapitalOfState('Los Angeles', 'California')).to.be.false;
            expect(stateCapitals.isCapitalOfState('New York City', 'New York')).to.be.false;
            expect(stateCapitals.isCapitalOfState('Dallas', 'Texas')).to.be.false;
        });

        it('should return false for invalid states', () => {
            expect(stateCapitals.isCapitalOfState('Unknown', 'NotAState')).to.be.false;
            expect(stateCapitals.isCapitalOfState('Capital', '')).to.be.false;
            expect(stateCapitals.isCapitalOfState('Capital', undefined)).to.be.false;
        });
    });

    describe('removeState', () => {
        it('should remove a state from an array', () => {
            const states = ['California', 'New York', 'Texas'];
            const result = stateCapitals.removeState(states, 'New York');
            expect(result).to.deep.equal(['California', 'Texas']);
        });

        it('should return the same array if state not found', () => {
            const states = ['California', 'New York', 'Texas'];
            const result = stateCapitals.removeState(states, 'Florida');
            expect(result).to.deep.equal(['California', 'New York', 'Texas']);
        });

        it('should not modify the original array', () => {
            const states = ['California', 'New York', 'Texas'];
            stateCapitals.removeState(states, 'New York');
            expect(states).to.deep.equal(['California', 'New York', 'Texas']);
        });
    });
});
