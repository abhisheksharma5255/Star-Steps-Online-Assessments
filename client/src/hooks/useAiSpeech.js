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
  // GET FEMALE VOICE
  // ========================================================

  const getFemaleVoice = useCallback(() => {
    if (!("speechSynthesis" in window)) {
      return null;
    }

    const voices =
      window.speechSynthesis.getVoices();

    if (!voices || voices.length === 0) {
      return null;
    }

    // ------------------------------------------------------
    // Highest priority:
    // Female Indian English voices
    // ------------------------------------------------------

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

    // ------------------------------------------------------
    // Known female English voices
    // ------------------------------------------------------

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

    // ------------------------------------------------------
    // Some browsers do not include "female" in the name.
    // Prefer common English voices as fallback.
    // ------------------------------------------------------

    const englishVoice =
      voices.find(
        (voice) =>
          voice.lang === "en-IN"
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "en-GB"
      ) ||
      voices.find(
        (voice) =>
          voice.lang === "en-US"
      );

    return englishVoice || null;
  }, []);

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

      if (!("speechSynthesis" in window)) {
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
      // Create utterance
      // ----------------------------------------------------

      const utterance =
        new SpeechSynthesisUtterance(text);

      // ----------------------------------------------------
      // IMPORTANT:
      // Voices may not be loaded immediately.
      // Wait briefly if needed.
      // ----------------------------------------------------

      const speakWithFemaleVoice = () => {
        const femaleVoice =
          getFemaleVoice();

        if (femaleVoice) {
          utterance.voice =
            femaleVoice;

          utterance.lang =
            femaleVoice.lang;

          console.log(
            "👩 Selected AI Voice:",
            femaleVoice.name
          );

          console.log(
            "🌐 Voice Language:",
            femaleVoice.lang
          );
        } else {
          utterance.lang =
            "en-IN";

          console.warn(
            "⚠️ No preferred female voice found. Using en-IN voice."
          );
        }

        // --------------------------------------------------
        // Voice settings
        // --------------------------------------------------

        utterance.rate = 1.05;
        utterance.pitch = 1.15;
        utterance.volume = 1;

        // --------------------------------------------------
        // Store current utterance
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
            console.log(
              "⚠️ Speech started but utterance is no longer active."
            );

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
            console.log(
              "⚠️ Speech ended but utterance is no longer active."
            );

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

        utterance.onerror = (event) => {
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

      // ----------------------------------------------------
      // Voices are already available
      // ----------------------------------------------------

      const voices =
        window.speechSynthesis.getVoices();

      if (
        voices &&
        voices.length > 0
      ) {
        speakWithFemaleVoice();
        return;
      }

      // ----------------------------------------------------
      // Voices not loaded yet
      // ----------------------------------------------------

      console.log(
        "⏳ Waiting for browser voices..."
      );

      let handled = false;

      const handleVoicesChanged = () => {
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

        speakWithFemaleVoice();
      };

      window.speechSynthesis.addEventListener(
        "voiceschanged",
        handleVoicesChanged
      );

      // Safety fallback
      setTimeout(() => {
        if (handled) {
          return;
        }

        handled = true;

        window.speechSynthesis.removeEventListener(
          "voiceschanged",
          handleVoicesChanged
        );

        speakWithFemaleVoice();
      }, 1000);
    },
    [
      aiEnabled,
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

    // Force browser to initialize voices
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