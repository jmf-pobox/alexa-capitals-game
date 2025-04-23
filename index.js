/**
 * US State Capitals - a memorization assistant Alexa skill
 *
 * This skill enables Alexa to teach a user the state capitals.
 * V1 either tells the user a state capital or quizzes the user.
 */

// handle incoming requests
exports.handler = function (event, context) {
    try {
        console.log("event.session.application.applicationId=" + event.session.application.applicationId);

        // verify request is from our app
        if (event.session.application.applicationId !== "amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad") {
            context.fail("Invalid Application ID");
        }

        // setup the session if new
        if (event.session.new) {
            onSessionStarted({requestId: event.request.requestId}, event.session);
        }

        // launch with a simple help message
        if (event.request.type === "LaunchRequest") {
            onLaunch(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        }
        // proces our intents
        else if (event.request.type === "IntentRequest") {
            onIntent(event.request,
                event.session,
                function callback(sessionAttributes, speechletResponse) {
                    context.succeed(buildResponse(sessionAttributes, speechletResponse));
                });
        }
        // cleanup when session is over
        else if (event.request.type === "SessionEndedRequest") {
            onSessionEnded(event.request, event.session);
            context.succeed();
        }
    } catch (e) {
        context.fail("Exception: " + e);
    }
};

/**
 * Called when the session starts.
 */
function onSessionStarted(sessionStartedRequest, session) {
    console.log("onSessionStarted requestId=" + sessionStartedRequest.requestId +
        ", sessionId=" + session.sessionId);

    session.attributes = {score: 0, statesToGuess: getAllStates(), quizzed: false};
}

/**
 * Called when the user ends the session.
 * Is not called when the skill returns shouldEndSession=true.
 */
function onSessionEnded(sessionEndedRequest, session) {
    console.log("onSessionEnded requestId=" + sessionEndedRequest.requestId +
        ", sessionId=" + session.sessionId);

    // Add cleanup logic here
    session.attributes = null;
}

/**
 * Called when the user launches the skill without specifying what they want.
 */
function onLaunch(launchRequest, session, callback) {
    console.log("onLaunch requestId=" + launchRequest.requestId +
        ", sessionId=" + session.sessionId);
    getWelcomeResponse(session, callback);
}

/**
 * Called when the user specifies an intent for this skill.
 */
function onIntent(intentRequest, session, callback) {
    var intent = intentRequest.intent;
    var intentName = intentRequest.intent.name;

    console.log("onIntent requestId=" + intentRequest.requestId + ", sessionId=" + session.sessionId +
        ", intent=" + intentName);

    // Dispatch to your skill's intent handlers
    if ("Ask" === intentName) {
        executeAskIntent(intent, session, callback);
    }
    else if ("Answer" === intentName) {
        executeAnswerIntent(intent, session, callback);
    }
    else if ("Response" === intentName) {
        executeResponseIntent(intent, session, callback);
    }
    else if ("Quit" === intentName) {
        executeQuitIntent(session, callback);
    }
    else if ("AMAZON.HelpIntent" === intentName) {
        getWelcomeResponse(session, callback);
    }
    else {
        throw "Invalid intent";
    }
}

// --------------- Functions that control the skill's behavior -----------------------

/**
 * Explains how the app works.
 */
function getWelcomeResponse(session, callback) {
    var sessionAttributes = session.attributes;

    var cardTitle = "Welcome!";
    var repromptText = "You can ask me the capital of any US state or ask me to quiz you.";
    var speechOutput = "Welcome to US Capitals! " + repromptText;
    var shouldEndSession = false;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Quit the app and share a final score.
 */
function executeQuitIntent(session, callback) {
    var sessionAttributes = session.attributes;

    var cardTitle = "Goodbye";
    var speechOutput = "Thank you for chatting with US Capitals. ";
    if (sessionAttributes.quizzed) {
        speechOutput += "Your final score was " + sessionAttributes.score;
    }
    var repromptText = "";
    var shouldEndSession = true;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Tells the user the capital of a state after the user asks, "What is the capital of {State}?"
 */
function executeAnswerIntent(intent, session, callback) {
    var cardTitle = "And the answer is ...";

    var stateSlot = intent.slots.State;

    var repromptText = "";
    var sessionAttributes = session.attributes;
    var shouldEndSession = false;
    var speechOutput = "";

    if (stateSlot) {
        var state = stateSlot.value;
        if (state && isState(state)) {
            speechOutput = "The capital of " + state + " is " + getCapitalForState(state) + ".";
            repromptText = "Ask me to quiz you, tell me a capital, or ask me for a capital.";
        }
        else {
            speechOutput = "I did not recognize that as a valid US state.";
            repromptText = "Ask me to quiz you or ask me for a capital.";
        }
    }
    else {
        speechOutput = "Hmmm... I'm not sure what state you are talking about.  Are you?";
    }

    // make sure the user cannot immediately reuse an answer to earn a point
    delete sessionAttributes.state;

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

/**
 * Asks the user for the capital of a specific state, "What is the capital of Georgia?"
 */
function executeAskIntent(intent, session, callback) {
    var shouldEndSession = false;
    var cardTitle = "And the question is ...";
    var sessionAttributes = session.attributes;
    var speechOutput;

    // flag that the user has started a quiz, so we can report the final score
    sessionAttributes.quizzed = true;

    // get the states and number of capitals left to guess from the session
    var statesToGuess = sessionAttributes.statesToGuess;
    var guessesLeft = statesToGuess.length;

    // ask another question if there are more capitals to guess
    if (guessesLeft > 0) {
        var state = statesToGuess[Math.floor((Math.random() * guessesLeft))];
        sessionAttributes.state = state;
        speechOutput = "What is the capital of " + state + "?";
    }
    // end quiz
    else {
        executeQuitIntent(session, callback);
    }

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, speechOutput, shouldEndSession));
}

/**
 * Tells the user whether their answer is correct and their current score.
 */
function executeResponseIntent(intent, session, callback) {
    var cardTitle = "And the answer is ...";
    var shouldEndSession = false;
    var sessionAttributes = session.attributes;
    var speechOutput, repromptText;

    var capitalSlot = intent.slots.Capital;
    var capital = capitalSlot.value;

    var state = sessionAttributes.state;
    var statesToGuess = sessionAttributes.statesToGuess;

    // make sure there is an unanswered question to the user to evaluate
    if (isState(state) ) {
        // correct response by user
        if (isCapitalOfState(capital, state)) {
            sessionAttributes.score = sessionAttributes.score + 1;
            speechOutput = "You are correct!";
            sessionAttributes.statesToGuess = removeState(statesToGuess, state);
        }
        // incorrect response by user
        else {
            sessionAttributes.score = sessionAttributes.score - 1;
            speechOutput = "Incorrect!  The capital of " + state + " is " + getCapitalForState(state) + ".  ";
        }
        // don't allow the user to answer the same question twice in one Q&A sequence
        delete sessionAttributes.state;
        speechOutput += "  Your score is now " + sessionAttributes.score;
    }
    else {
        speechOutput = "Ask me to quiz you or ask me for a capital.";
    }

    repromptText = "Ask me to quiz you or ask me for a capital.";

    callback(sessionAttributes,
        buildSpeechletResponse(cardTitle, speechOutput, repromptText, shouldEndSession));
}

// --------------- Helpers with state capital data -------------------------------

function isState(state) {
    return (getCapitalForState(state) !== "Unknown");
}

function isCapitalOfState(capital, state) {
    return getCapitalForState(state) === capital ||
        getCapitalForState(state).toLowerCase() === capital.toLowerCase();
}

function getCapitalForState(state) {
    var capitalsByState = getAllCapitalsByState();
    var capital = capitalsByState[state];
    if (capital) return capital;
    return "Unknown";
}

function getAllCapitalsByState() {
    return {
        "Alabama"       : "Montgomery",
        "Alaska"        : "Juneau",
        "Arizona"       : "Phoenix",
        "Arkansas"      : "Little Rock",
        "California"    : "Sacramento",
        "Colorado"      : "Denver",
        "Connecticut"   : "Hartford",
        "Delaware"      : "Dover",
        "Florida"       : "Tallahassee",
        "Georgia"       : "Atlanta",
        "Hawaii"        : "Honolulu",
        "Idaho"         : "Boise",
        "Illinois"      : "Springfield",
        "Indiana"       : "Indianapolis",
        "Iowa"          : "Des Moines",
        "Kansas"        : "Topeka",
        "Kentucky"      : "Frankfort",
        "Louisiana"     : "Baton Rouge",
        "Maine"         : "Augusta",
        "Maryland"      : "Annapolis",
        "Massachusetts" : "Boston",
        "Michigan"      : "Lansing",
        "Minnesota"     : "Saint Paul",
        "Mississippi"   : "Jackson",
        "Missouri"      : "Jefferson City",
        "Montana"       : "Helena",
        "Nebraska"      : "Lincoln",
        "Nevada"        : "Carson City",
        "New Hampshire" : "Concord",
        "New Jersey"    : "Trenton",
        "New Mexico"    : "Santa Fe",
        "New York"      : "Albany",
        "North Carolina": "Raleigh",
        "North Dakota"  : "Bismarck",
        "Ohio"          : "Columbus",
        "Oklahoma"      : "Oklahoma City",
        "Oregon"        : "Salem",
        "Pennsylvania"  : "Harrisburg",
        "Rhode Island"  : "Providence",
        "South Carolina": "Columbia",
        "South Dakota"  : "Pierre",
        "Tennessee"     : "Nashville",
        "Texas"         : "Austin",
        "Utah"          : "salt lake city",
        "Vermont"       : "Montpelier",
        "Virginia"      : "Richmond",
        "Washington"    : "Olympia",
        "West Virginia" : "Charleston",
        "Wisconsin"     : "Madison",
        "Wyoming"       : "Cheyenne"
    }
}

function removeState(existingStates, state) {
    var remainingStates = [];
    for (var i=0; i < existingStates.length; i++) {
        if (existingStates[i] != state) {
            remainingStates.push(existingStates[i]);
        }
    }
    return remainingStates;
}

function getAllStates() {
    return [
        "Alabama",
        "Alaska",
        "Arizona",
        "Arkansas",
        "California",
        "Colorado",
        "Connecticut",
        "Delaware",
        "Florida",
        "Georgia",
        "Hawaii",
        "Idaho",
        "Illinois",
        "Indiana",
        "Iowa",
        "Kansas",
        "Kentucky",
        "Louisiana",
        "Maine",
        "Maryland",
        "Massachusetts",
        "Michigan",
        "Minnesota",
        "Mississippi",
        "Missouri",
        "Montana",
        "Nebraska",
        "Nevada",
        "New Hampshire",
        "New Jersey",
        "New Mexico",
        "New York",
        "North Carolina",
        "North Dakota",
        "Ohio",
        "Oklahoma",
        "Oregon",
        "Pennsylvania",
        "Rhode Island",
        "South Carolina",
        "South Dakota",
        "Tennessee",
        "Texas",
        "Utah",
        "Vermont",
        "Virginia",
        "Washington",
        "West Virginia",
        "Wisconsin",
        "Wyoming"
    ];
}

// --------------- Helpers that build all of the responses -----------------------

function buildSpeechletResponse(title, output, repromptText, shouldEndSession) {
    return {
        outputSpeech: {
            type: "PlainText",
            text: output
        },
        card: {
            type: "Simple",
            title: title,
            content: output
        },
        reprompt: {
            outputSpeech: {
                type: "PlainText",
                text: repromptText
            }
        },
        shouldEndSession: shouldEndSession
    };
}

function buildResponse(sessionAttributes, speechletResponse) {
    return {
        version: "1.0",
        sessionAttributes: sessionAttributes,
        response: speechletResponse
    };
}