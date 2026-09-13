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
  // STOP AI SPEAKING
  // ========================================================

  const stopAiSpeaking = useCallback(() => {
    console.log("🛑 STOP AI SPEAKING");

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
      // Create speech
      // ----------------------------------------------------

      const utterance =
        new SpeechSynthesisUtterance(text);

      // ----------------------------------------------------
      // Get available voices
      // ----------------------------------------------------

      const voices =
        window.speechSynthesis.getVoices();

      console.log(
        "🎙️ Available voices:",
        voices
      );

      // ----------------------------------------------------
      // Find female Indian / English voice
      // ----------------------------------------------------

      const femaleVoice =
        voices.find(
          (voice) =>
            voice.lang === "en-IN" &&
            /female|woman|heera|veena/i.test(
              voice.name
            )
        ) ||
        voices.find(
          (voice) =>
            voice.lang.startsWith("en") &&
            /female|woman|samantha|karen|zira|moira/i.test(
              voice.name
            )
        );

      if (femaleVoice) {
        utterance.voice = femaleVoice;
        utterance.lang = femaleVoice.lang;

        console.log(
          "👩 Female AI Voice:",
          femaleVoice.name
        );

        console.log(
          "🌐 Voice Language:",
          femaleVoice.lang
        );
      } else {
        utterance.lang = "en-IN";

        console.warn(
          "⚠️ Female voice not found. Using default voice."
        );
      }

      // ----------------------------------------------------
      // Voice settings
      // ----------------------------------------------------

      utterance.rate = 1.05;
      utterance.pitch = 1.1;
      utterance.volume = 1;

      // ----------------------------------------------------
      // Store current utterance
      // ----------------------------------------------------

      aiSpeechRef.current = utterance;

      console.log(
        "📢 Calling speechSynthesis.speak()"
      );

      // ====================================================
      // SPEECH START
      // ====================================================

      utterance.onstart = () => {
        console.log(
          "🔊 AI SPEECH STARTED"
        );

        if (
          aiSpeechRef.current !== utterance
        ) {
          console.log(
            "⚠️ Speech started but utterance is no longer active."
          );

          return;
        }

        setAiSpeaking(true);
      };

      // ====================================================
      // SPEECH FINISHED
      // ====================================================

      utterance.onend = () => {
        console.log(
          "✅ AI SPEECH ENDED"
        );

        if (
          aiSpeechRef.current !== utterance
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

        // IMPORTANT:
        // App.jsx will start the question timer
        // only after this callback.
        if (onSpeechComplete) {
          onSpeechComplete();
        }
      };

      // ====================================================
      // SPEECH ERROR
      // ====================================================

      utterance.onerror = (event) => {
        console.error(
          "❌ AI SPEECH ERROR:",
          event?.error
        );

        console.error(
          "Speech error event:",
          event
        );

        if (
          aiSpeechRef.current !== utterance
        ) {
          return;
        }

        aiSpeechRef.current = null;

        setAiSpeaking(false);

        // If browser gives a speech error,
        // continue the interview instead of
        // getting stuck.
        if (onSpeechComplete) {
          console.log(
            "⏱️ Speech error → calling onSpeechComplete()"
          );

          onSpeechComplete();
        }
      };

      // ====================================================
      // SPEECH SYNTHESIS
      // ====================================================

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
    },
    [aiEnabled, stopAiSpeaking]
  );

  // ========================================================
  // CLEANUP
  // ========================================================

  useEffect(() => {
    return () => {
      console.log(
        "🧹 Cleaning up AI speech"
      );

      aiSpeechRef.current = null;

      if ("speechSynthesis" in window) {
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