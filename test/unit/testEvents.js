'use strict';

/**
 * Mock Alexa request events for testing
 */

const launchRequest = {
    'version': '1.0',
    'session': {
        'new': true,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {}
    },
    'context': {
        'System': {
            'application': {
                'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
            },
            'user': {
                'userId': 'amzn1.ask.account.123'
            },
            'device': {
                'deviceId': 'amzn1.ask.device.123',
                'supportedInterfaces': {}
            }
        }
    },
    'request': {
        'type': 'LaunchRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US'
    }
};

const askIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 0,
            'quizzed': false,
            'statesToGuess': ['Alabama', 'Alaska', 'Arizona', /* ... */]
        }
    },
    'context': {
        'System': {
            'application': {
                'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
            },
            'user': {
                'userId': 'amzn1.ask.account.123'
            },
            'device': {
                'deviceId': 'amzn1.ask.device.123',
                'supportedInterfaces': {}
            }
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'Ask',
            'confirmationStatus': 'NONE'
        }
    }
};

const answerIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 0,
            'quizzed': false,
            'statesToGuess': ['Alabama', 'Alaska', 'Arizona', /* ... */]
        }
    },
    'context': {
        'System': {
            'application': {
                'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
            },
            'user': {
                'userId': 'amzn1.ask.account.123'
            },
            'device': {
                'deviceId': 'amzn1.ask.device.123',
                'supportedInterfaces': {}
            }
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'Answer',
            'confirmationStatus': 'NONE',
            'slots': {
                'State': {
                    'name': 'State',
                    'value': 'California',
                    'confirmationStatus': 'NONE'
                }
            }
        }
    }
};

const responseIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 0,
            'quizzed': true,
            'statesToGuess': ['Alabama', 'Alaska', 'Arizona', /* ... */],
            'state': 'California'
        }
    },
    'context': {
        'System': {
            'application': {
                'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
            },
            'user': {
                'userId': 'amzn1.ask.account.123'
            },
            'device': {
                'deviceId': 'amzn1.ask.device.123',
                'supportedInterfaces': {}
            }
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'Response',
            'confirmationStatus': 'NONE',
            'slots': {
                'Capital': {
                    'name': 'Capital',
                    'value': 'Sacramento',
                    'confirmationStatus': 'NONE'
                }
            }
        }
    }
};

const helpIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 0,
            'quizzed': false
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'AMAZON.HelpIntent',
            'confirmationStatus': 'NONE'
        }
    }
};

const cancelIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 5,
            'quizzed': true
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'AMAZON.CancelIntent',
            'confirmationStatus': 'NONE'
        }
    }
};

const stopIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 5,
            'quizzed': true
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'AMAZON.StopIntent',
            'confirmationStatus': 'NONE'
        }
    }
};

const quitIntentRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 10,
            'quizzed': true
        }
    },
    'request': {
        'type': 'IntentRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'intent': {
            'name': 'Quit',
            'confirmationStatus': 'NONE'
        }
    }
};

const sessionEndedRequest = {
    'version': '1.0',
    'session': {
        'new': false,
        'sessionId': 'amzn1.echo-api.session.123',
        'application': {
            'applicationId': 'amzn1.echo-sdk-ams.app.ffc466b9-e51f-43bc-b203-5391844666ad'
        },
        'user': {
            'userId': 'amzn1.ask.account.123'
        },
        'attributes': {
            'score': 5,
            'quizzed': true
        }
    },
    'request': {
        'type': 'SessionEndedRequest',
        'requestId': 'amzn1.echo-api.request.123',
        'timestamp': '2020-01-01T12:00:00Z',
        'locale': 'en-US',
        'reason': 'USER_INITIATED'
    }
};

module.exports = {
    launchRequest,
    askIntentRequest,
    answerIntentRequest,
    responseIntentRequest,
    helpIntentRequest,
    cancelIntentRequest,
    stopIntentRequest,
    quitIntentRequest,
    sessionEndedRequest
};