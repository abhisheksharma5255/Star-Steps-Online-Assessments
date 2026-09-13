import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

function useAiSpeech() {
  const [aiSpeaking, setAiSpeaking] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);

  const aiSpeechRef = useRef(null);

  // ========================================================
  // DETECT QUESTION LANGUAGE
  // ========================================================

  const detectLanguage = useCallback((text) => {
    if (!text) {
      return "en";
    }

    // Hindi / Devanagari characters
    const hasHindiCharacters =
      /[\u0900-\u097F]/.test(text);

    if (hasHindiCharacters) {
      return "hi";
    }

    return "en";
  }, []);

  // ========================================================
  // GET FEMALE HINDI / ENGLISH VOICE
  // ========================================================

  const getFemaleVoice = useCallback(
    (language) => {
      if (!("speechSynthesis" in window)) {
        return null;
      }

      const voices =
        window.speechSynthesis.getVoices();

      if (!voices || voices.length === 0) {
        return null;
      }

      // ====================================================
      // HINDI
      // ====================================================

      if (language === "hi") {
        // -----------------------------------------------
        // First priority: Hindi female voices
        // -----------------------------------------------

        const hindiFemaleVoice =
          voices.find(
            (voice) =>
              voice.lang === "hi-IN" &&
              /female|woman|heera|veena/i.test(
                voice.name
              )
          );

        if (hindiFemaleVoice) {
          return hindiFemaleVoice;
        }

        // -----------------------------------------------
        // Any Hindi voice
        // -----------------------------------------------

        const hindiVoice =
          voices.find(
            (voice) =>
              voice.lang === "hi-IN"
          );

        if (hindiVoice) {
          return hindiVoice;
        }

        // -----------------------------------------------
        // Hindi-compatible fallback
        // -----------------------------------------------

        const hindiLanguageVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("hi")
          );

        if (hindiLanguageVoice) {
          return hindiLanguageVoice;
        }
      }

      // ====================================================
      // ENGLISH
      // ====================================================

      if (language === "en") {
        // -----------------------------------------------
        // First priority: Indian English female voice
        // -----------------------------------------------

        const indianFemaleVoice =
          voices.find(
            (voice) =>
              voice.lang === "en-IN" &&
              /female|woman|heera|veena/i.test(
                voice.name
              )
          );

        if (indianFemaleVoice) {
          return indianFemaleVoice;
        }

        // -----------------------------------------------
        // Known English female voices
        // -----------------------------------------------

        const knownFemaleVoice =
          voices.find(
            (voice) =>
              voice.lang.startsWith("en") &&
              /samantha|karen|zira|moira|female|woman/i.test(
                voice.name
              )
          );

        if (knownFemaleVoice) {
          return knownFemaleVoice;
        }

        // -----------------------------------------------
        // Any Indian English voice
        // -----------------------------------------------

        const indianEnglishVoice =
          voices.find(
            (voice) =>
              voice.lang === "en-IN"
          );

        if (indianEnglishVoice) {
          return indianEnglishVoice;
        }

        // -----------------------------------------------
        // English fallback
        // -----------------------------------------------

        const englishVoice =
          voices.find(
            (voice) =>
              voice.lang === "en-GB"
          ) ||
          voices.find(
            (voice) =>
              voice.lang === "en-US"
          ) ||
          voices.find(
            (voice) =>
              voice.lang.startsWith("en")
          );

        return englishVoice || null;
      }

      return null;
    },
    []
  );

  // ========================================================
  // STOP AI SPEAKING
  // ========================================================

  const stopAiSpeaking = useCallback(() => {
    console.log(
      "🛑 STOP AI SPEAKING"
    );

    aiSpeechRef.current = null;

    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    setAiSpeaking(false);
  }, []);

  // ========================================================
  // SPEAK QUESTION
  // ========================================================

  const speakAiQuestion = useCallback(
    (text, onSpeechComplete) => {
      console.log(
        "🎤 speakAiQuestion CALLED:",
        text
      );

      if (!aiEnabled || !text) {
        console.log(
          "⚠️ AI speech skipped:",
          {
            aiEnabled,
            text,
          }
        );

        return;
      }

      if (
        !("speechSynthesis" in window)
      ) {
        console.error(
          "❌ Speech synthesis is NOT supported."
        );

        if (onSpeechComplete) {
          onSpeechComplete();
        }

        return;
      }

      // ----------------------------------------------------
      // Stop previous speech
      // ----------------------------------------------------

      stopAiSpeaking();

      // ----------------------------------------------------
      // Detect question language
      // ----------------------------------------------------

      const language =
        detectLanguage(text);

      console.log(
        "🌐 Detected language:",
        language === "hi"
          ? "Hindi"
          : "English"
      );

      // ----------------------------------------------------
      // Create utterance
      // ----------------------------------------------------

      const utterance =
        new SpeechSynthesisUtterance(
          text
        );

      // ====================================================
      // SPEAK WITH SELECTED VOICE
      // ====================================================

      const speakWithSelectedVoice = () => {
        const selectedVoice =
          getFemaleVoice(language);

        // --------------------------------------------------
        // Voice found
        // --------------------------------------------------

        if (selectedVoice) {
          utterance.voice =
            selectedVoice;

          utterance.lang =
            selectedVoice.lang;

          console.log(
            "👩 Selected AI Voice:",
            selectedVoice.name
          );

          console.log(
            "🌐 Voice Language:",
            selectedVoice.lang
          );
        }

        // --------------------------------------------------
        // No matching voice
        // --------------------------------------------------

        else if (
          language === "hi"
        ) {
          utterance.lang = "hi-IN";

          console.warn(
            "⚠️ Hindi voice not found. Using hi-IN fallback."
          );
        } else {
          utterance.lang = "en-IN";

          console.warn(
            "⚠️ English female voice not found. Using en-IN fallback."
          );
        }

        // --------------------------------------------------
        // Voice settings
        // --------------------------------------------------

        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        utterance.volume = 1;

        // --------------------------------------------------
        // Store utterance
        // --------------------------------------------------

        aiSpeechRef.current =
          utterance;

        console.log(
          "📢 Calling speechSynthesis.speak()"
        );

        // ==================================================
        // SPEECH START
        // ==================================================

        utterance.onstart = () => {
          console.log(
            "🔊 AI SPEECH STARTED"
          );

          if (
            aiSpeechRef.current !==
            utterance
          ) {
            return;
          }

          setAiSpeaking(true);
        };

        // ==================================================
        // SPEECH END
        // ==================================================

        utterance.onend = () => {
          console.log(
            "✅ AI SPEECH ENDED"
          );

          if (
            aiSpeechRef.current !==
            utterance
          ) {
            return;
          }

          aiSpeechRef.current = null;

          setAiSpeaking(false);

          console.log(
            "⏱️ Calling onSpeechComplete()"
          );

          if (onSpeechComplete) {
            onSpeechComplete();
          }
        };

        // ==================================================
        // SPEECH ERROR
        // ==================================================

        utterance.onerror = (
          event
        ) => {
          console.error(
            "❌ AI SPEECH ERROR:",
            event?.error
          );

          if (
            aiSpeechRef.current !==
            utterance
          ) {
            return;
          }

          aiSpeechRef.current = null;

          setAiSpeaking(false);

          if (onSpeechComplete) {
            console.log(
              "⏱️ Speech error → calling onSpeechComplete()"
            );

            onSpeechComplete();
          }
        };

        // ==================================================
        // START SPEECH
        // ==================================================

        try {
          window.speechSynthesis.speak(
            utterance
          );

          console.log(
            "✅ speechSynthesis.speak() executed"
          );
        } catch (error) {
          console.error(
            "❌ speechSynthesis.speak() FAILED:",
            error
          );

          aiSpeechRef.current = null;

          setAiSpeaking(false);

          if (onSpeechComplete) {
            onSpeechComplete();
          }
        }
      };

      // ====================================================
      // VOICES ALREADY AVAILABLE
      // ====================================================

      const voices =
        window.speechSynthesis.getVoices();

      if (
        voices &&
        voices.length > 0
      ) {
        speakWithSelectedVoice();
        return;
      }

      // ====================================================
      // WAIT FOR VOICES
      // ====================================================

      console.log(
        "⏳ Waiting for browser voices..."
      );

      let handled = false;

      const handleVoicesChanged =
        () => {
          if (handled) {
            return;
          }

          const loadedVoices =
            window.speechSynthesis.getVoices();

          if (
            !loadedVoices ||
            loadedVoices.length === 0
          ) {
            return;
          }

          handled = true;

          window.speechSynthesis.removeEventListener(
            "voiceschanged",
            handleVoicesChanged
          );

          speakWithSelectedVoice();
        };

      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      // ----------------------------------------------------
      // Safety fallback
      // ----------------------------------------------------

      setTimeout(() => {
        if (handled) {
          return;
        }

        handled = true;

        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );

        speakWithSelectedVoice();
      }, 1000);
    },
    [
      aiEnabled,
      detectLanguage,
      getFemaleVoice,
      stopAiSpeaking,
    ]
  );

  // ========================================================
  // LOAD VOICES
  // ========================================================

  useEffect(() => {
    if (
      !("speechSynthesis" in window)
    ) {
      return;
    }

    window.speechSynthesis.getVoices();

    const handleVoicesChanged =
      () => {
        const voices =
          window.speechSynthesis.getVoices();

        console.log(
          "🎙️ Browser voices loaded:",
          voices.length
        );
      };

    window.speechSynthesis.addEventListener(
      "voiceschanged",
      handleVoicesChanged
    );

    return () => {
      window.speechSynthesis.removeEventListener(
        "voiceschanged",
        handleVoicesChanged
      );
    };
  }, []);

  // ========================================================
  // CLEANUP
  // ========================================================

  useEffect(() => {
    return () => {
      console.log(
        "🧹 Cleaning up AI speech"
      );

      aiSpeechRef.current = null;

      if (
        "speechSynthesis" in window
      ) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  // ========================================================
  // RETURN
  // ========================================================

  return {
    aiSpeaking,
    aiEnabled,
    setAiEnabled,
    speakAiQuestion,
    stopAiSpeaking,
  };
}

export default useAiSpeech;