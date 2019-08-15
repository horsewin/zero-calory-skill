const MESSAGE = {
  first: {
    speak: "カロリーって知っていますか？人が生きていく上で必ず必要になるカロリーですが、たくさん取りたくないとみんな感がていますね。考え方一つでこれをへらすことができるんですよ。試しに一つ聞いてみますか？",
    reprompt: "知りたくないですか？",
  },
  login: {
    speak: [
      "今日のゼロカロリーの話について聞いてみますか？",
      "カレーを食べた、のように話しかけてみてください。何を食べましたか？"
    ],
    reprompt: [
      "今日のゼロカロリーの話について聞いてみますか？",
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
    speak: "考え方一つでカロリーを減らす方法をお教えしますよ。聞いてみますか？",
    reprompt: "ゼロカロリーの話について聞いてみませんか？",
  },
};

export default MESSAGE;
