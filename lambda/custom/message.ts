const MESSAGE = {
  first: {
    speak: "カロリーゼロ理論って知っていますか？カロリーの理論を覆すとんでもない理論なんですよ。試しに一つ聞いてみますか？",
    reprompt: "知りたくないですか？",
  },
  login: {
    speak: [
      "今日のカロリーゼロ理論について聞いてみますか？",
      "カレーを食べた、のように話しかけてみてください。何を食べましたか？"
    ],
    reprompt: [
      "今日のカロリーゼロ理論について聞いてみますか？",
      "カレーを食べた、のように話しかけてみてください。何を食べましたか？"
    ],
  },
  error: {
    speak: "うまく聞き取れなかったです。何を食べましたか？",
    reprompt: "カレーを食べた、のように話しかけてみてください。何を食べましたか？",
  },
  meigen: {
    speak: "実は、%s%s。<break time=\"1500ms\"/> <say-as interpret-as=\"interjection\">なんちゃって</say-as>。<say-as interpret-as=\"interjection\">またね</say-as>。",
  },
  exit: {
    speak: "<say-as interpret-as=\"interjection\">またいつでも聞いてください</say-as>",
  },
  help: {
    speak: "カロリーゼロ理論という、カロリーの理論を覆す、驚異の理論について説明します。聞いてみますか？",
    reprompt: "カロリーゼロ理論について聞いてみませんか？",
  },
};

export default MESSAGE;
