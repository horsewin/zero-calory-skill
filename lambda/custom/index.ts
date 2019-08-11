"use strict";

import * as Alexa from "ask-sdk-core";
import {IntentRequest, RequestEnvelope} from "ask-sdk-model";
import * as util from "util";
import MEIGEN from "./data/meigen";
import STATE from "./data/state";
import MESSAGE from "./message";

/**
 * エンティティ解決時の成功コード
 * @type {string}
 */
const ER_SUCCESS_MATCH = "ER_SUCCESS_MATCH";

/**
 * エンティティ解決時の失敗コード
 * @type {string}
 */
const ER_SUCCESS_NO_MATCH = "ER_SUCCESS_NO_MATCH";

// ------------------------------------------------------

let skill: Alexa.Skill;

/* LAMBDA SETUP */
exports.handler = async (event: RequestEnvelope, context: any) => {
  console.log(JSON.stringify(event, null, 2));
  if (!skill) {
    skill = Alexa.SkillBuilders.custom()
      .addRequestHandlers(
        LaunchRequestHandler,
        YesHandler,
        HelpHandler,
        ExitHandler,
        SessionEndedRequestHandler,
      )
      .addErrorHandlers(ErrorHandler)
      .create();
  }
  return skill.invoke(event, context);
};

const LaunchRequestHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    return handlerInput.requestEnvelope.request.type === `LaunchRequest`;
  },
  handle(handlerInput: Alexa.HandlerInput) {
    // Dynamoチェック
    const speak = MESSAGE.first.speak;
    const reprompt = MESSAGE.first.reprompt;

    handlerInput.attributesManager.setSessionAttributes({
      STATE: STATE.LOOPBACK,
    });

    return handlerInput.responseBuilder
      .speak(`カロリーゼロ理論です。${speak}`)
      .reprompt(reprompt)
      .getResponse();
  },
};

const YesHandler = {
  canHandle(handlerInput: Alexa.HandlerInput) {
    console.log("Inside YesHandler");
    const request = handlerInput.requestEnvelope.request;
    return request.type === "IntentRequest" &&
      request.intent.name === "AMAZON.YesIntent";
  },
  handle(handlerInput: Alexa.HandlerInput) {
    console.log("yes");
    const speak = MESSAGE.meigen.speak;
    const contentIndex = "糖分";
    const meigen = MEIGEN[contentIndex];
    console.log(meigen);
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
      request.intent.name === "AMAZON.CancelIntent"
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
 * @param slot
 * @returns {boolean}
 */
const CustomValidator = (slot: any): boolean => {
  if (slot && slot.resolutions) {
    return slot.resolutions.resolutionsPerAuthority[0].status.code === ER_SUCCESS_MATCH;
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
