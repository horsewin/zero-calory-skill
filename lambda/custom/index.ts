"use strict";

import * as Alexa from "ask-sdk-core";
import {IntentRequest, RequestEnvelope} from "ask-sdk-model";
import * as util from "util";
import MEIGEN from "./data/meigen";
import MESSAGE from "./message";

const dynamoAdapter = require('ask-sdk-dynamodb-persistence-adapter');
const config = {tableName: 'zero-calory-skill', createTable: true};
const dynamoDBAdapter = new dynamoAdapter.DynamoDbPersistenceAdapter(config);

let skill: Alexa.Skill;

/**
 * Lambda Setup
 * @param event
 * @param context
 */
exports.handler = async (event: RequestEnvelope, context: any) => {
  console.log(JSON.stringify(event, null, 2));
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        YesHandler,
        ActionHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .withPersistenceAdapter(dynamoDBAdapter)
      .create();
  }
  return skill.invoke(event, context);
};

/**
 *
 */
const LaunchRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return isIntentType(handlerInput, `LaunchRequest`);
  },
  async handle(handlerInput: Alexa.HandlerInput) {
    const date = new Date();

    // Dynamoチェック
    let attributes = await handlerInput.attributesManager.getPersistentAttributes()

    let speak = MESSAGE.first.speak;
    let reprompt = MESSAGE.first.reprompt;

    if (attributes) {
      const index = randomInt(MESSAGE.login.speak.length - 1);
      speak = MESSAGE.login.speak[index];
      reprompt = MESSAGE.login.reprompt[index];
    }

    attributes.timestamp = date.toUTCString();
    handlerInput.attributesManager.setPersistentAttributes(attributes);
    await handlerInput.attributesManager.savePersistentAttributes();

    return handlerInput.responseBuilder
      .speak(`カロリーゼロ理論です。${speak}`)
      .reprompt(reprompt)
      .getResponse();
  },
};

const YesHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return isIntentType(handlerInput, "IntentRequest") &&
      isIntentName(handlerInput, "AMAZON.YesIntent");
  },
  handle(handlerInput: Alexa.HandlerInput) {
    const speak = MESSAGE.meigen.speak;

    const meigenList = Object.keys(MEIGEN);
    const contentIndex = meigenList[randomInt(meigenList.length - 1)];
    // @ts-ignore
    const meigen = MEIGEN[contentIndex];
    return handlerInput.responseBuilder
      .speak(util.format(speak, contentIndex, meigen))
      .withShouldEndSession(true)
      .getResponse();
  },
};

const ActionHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return isIntentType(handlerInput, "IntentRequest") &&
      isIntentName(handlerInput, "WordIntent");
  },
  handle(handlerInput: Alexa.HandlerInput) {
    const speak = MESSAGE.meigen.speak;

    const meigenList = Object.keys(MEIGEN);

    const word = Alexa.getSlotValue(handlerInput.requestEnvelope, "Query");
    console.log(word);


    const contentIndex = meigenList.includes(word) ? word : meigenList[randomInt(meigenList.length - 1)];

    // @ts-ignore
    const meigen = MEIGEN[contentIndex];
    return handlerInput.responseBuilder
      .speak(util.format(speak, contentIndex, meigen))
      .withShouldEndSession(true)
      .getResponse();
  },
};


const HelpHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" && (
      request.intent.name === "AMAZON.HelpIntent" ||
      request.intent.name === "AMAZON.HelpHandler"
    );
  },
  handle(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGE.help.speak)
      .reprompt(MESSAGE.help.reprompt)
      .getResponse();
  },
};

const ExitHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    const request = handlerInput.requestEnvelope.request;
    const hasStop = request.type === `IntentRequest` && (
      request.intent.name === "AMAZON.StopIntent" ||
      request.intent.name === "AMAZON.CancelIntent" ||
      request.intent.name === "AMAZON.NoIntent"
    );

    return hasStop;
  },
  handle(handlerInput: Alexa.HandlerInput) {
    return handlerInput.responseBuilder
      .speak(MESSAGE.exit.speak)
      .withShouldEndSession(true)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    console.log("Inside SessionEndedRequestHandler");
    return handlerInput.requestEnvelope.request.type === "SessionEndedRequest";
  },
  handle(handlerInput: Alexa.HandlerInput) {
    console.log(`Session ended with reason: ${JSON.stringify(handlerInput.requestEnvelope)}`);
    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    console.log("Inside ErrorHandler");
    return true;
  },
  handle(handlerInput: Alexa.HandlerInput, error: Error) {
    console.log(`Error handled: ${JSON.stringify(error)}`);
    console.log(`Handler Input: ${JSON.stringify(handlerInput)}`);

    if (handlerInput && handlerInput.requestEnvelope && handlerInput.requestEnvelope.session) {
      const isNew = handlerInput.requestEnvelope.session.new;
      if (isNew) {
        // LaunchHandlerで処理をする
      } else {
        // それ以外なのでエラー処理をする
      }
    }

    return handlerInput.responseBuilder
      .speak(MESSAGE.error.speak)
      .reprompt(MESSAGE.error.reprompt)
      .getResponse();
  },
};

/**
 *
 * @param handlerInput
 * @param targetType
 */
const isIntentType = (handlerInput: Alexa.HandlerInput, targetType: string): boolean => Alexa.getRequestType(handlerInput.requestEnvelope) === targetType;

/**
 *
 * @param handlerInput
 * @param targetName
 */
const isIntentName = (handlerInput: Alexa.HandlerInput, targetName: string): boolean => Alexa.getIntentName(handlerInput.requestEnvelope) === targetName;

/**
 *
 * @param maximum
 */
const randomInt = (maximum: number) => Math.floor(Math.random() * (maximum + 1));

/**
 *
 * @param slot
 * @returns {boolean}
 */
const CustomValidator = (slot: any): boolean => {
  if (slot && slot.resolutions) {
    return slot.resolutions.resolutionsPerAuthority[0].status.code === "ER_SUCCESS_MATCH";
  } else if (slot && slot.value) {
    return true;
  }
  return false;
};

/**
 *
 * @param slot
 * @returns {*|boolean}
 * @constructor
 */
const Validator = (slot: any): boolean => {
  return slot && slot.value && slot.value !== "?";
};

/**
 *
 * @param handlerInput
 */
const supportsDisplay = (handlerInput: Alexa.HandlerInput): boolean => {
  return !!(handlerInput.requestEnvelope.context && handlerInput.requestEnvelope.context.System &&
    handlerInput.requestEnvelope.context.System.device &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces &&
    handlerInput.requestEnvelope.context.System.device.supportedInterfaces.Display);
};
