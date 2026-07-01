import React, { useRef, useState } from "react";
import { FaMicrophone, FaStop, FaVolumeUp } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

export default function OptionLanguageScreen() {
  const [text, setText] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [showStopButton, setShowStopButton] = useState(false);
  const [language, setLanguage] = useState("en-US");

  const recognitionRef = useRef(null);

  // Start Voice Recognition
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("Speech Recognition is not supported in this browser.");
      return;
    }

    if (!recognitionRef.current) {
      recognitionRef.current = new SpeechRecognition();

      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event) => {
        let transcript = "";

        for (
          let i = event.resultIndex;
          i < event.results.length;
          i++
        ) {
          transcript += event.results[i][0].transcript + " ";
        }

        setText((prev) => prev + transcript);
      };

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        setShowStopButton(true);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        setShowStopButton(false);
      };

      recognitionRef.current.onerror = (event) => {
        console.log("Speech Error:", event.error);
        setIsListening(false);
        setShowStopButton(false);
      };
    }

    // Update selected language every time
    recognitionRef.current.lang = language;

    recognitionRef.current.start();
  };

  // Stop Voice Recognition
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  };

  // Speak Text
  const speakText = () => {
    if (!text.trim()) {
      alert("Please enter or speak some text first.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);

    speech.lang = language;
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.speak(speech);
  };

  return (
    <div className="container mt-5">

      <div className="card shadow">

        <div className="card-header bg-primary text-white">
          <h3>Speech To Text & Text To Speech</h3>
        </div>

        <div className="card-body">

          {/* Language Dropdown */}

          <div className="mb-3">
            <label className="form-label fw-bold">
              Select Language
            </label>

            <select
              className="form-select"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
            >
              <option value="en-US">🇺🇸 English (US)</option>
              <option value="en-GB">🇬🇧 English (UK)</option>
              <option value="ur-PK">🇵🇰 Urdu</option>
              <option value="hi-IN">🇮🇳 Hindi</option>
              <option value="ar-SA">🇸🇦 Arabic</option>
              <option value="pa-IN">🇮🇳 Punjabi</option>
              <option value="bn-BD">🇧🇩 Bengali</option>
              <option value="fr-FR">🇫🇷 French</option>
              <option value="de-DE">🇩🇪 German</option>
              <option value="es-ES">🇪🇸 Spanish</option>
              <option value="it-IT">🇮🇹 Italian</option>
              <option value="pt-BR">🇧🇷 Portuguese</option>
              <option value="ru-RU">🇷🇺 Russian</option>
              <option value="zh-CN">🇨🇳 Chinese</option>
              <option value="ja-JP">🇯🇵 Japanese</option>
              <option value="ko-KR">🇰🇷 Korean</option>
              <option value="tr-TR">🇹🇷 Turkish</option>
              <option value="fa-IR">🇮🇷 Persian</option>
            </select>
          </div>

          {/* Buttons */}

          <div className="d-flex gap-2 mb-3">

            {!showStopButton ? (
              <button
                className="btn btn-success"
                onClick={startListening}
                disabled={isListening}
              >
                <FaMicrophone className="me-2" />
                Start Voice
              </button>
            ) : (
              <button
                className="btn btn-warning"
                onClick={stopListening}
              >
                <FaStop className="me-2" />
                Stop Voice
              </button>
            )}

            <button
              className="btn btn-primary"
              onClick={speakText}
            >
              <FaVolumeUp className="me-2" />
              Speak Text
            </button>

            <button
              className="btn btn-secondary"
              onClick={() => setText("")}
            >
              Clear
            </button>

          </div>

          {/* Text Area */}

          <textarea
            className="form-control"
            rows={15}
            placeholder="Speak or type here..."
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Status */}

          <div className="mt-3">
            <strong>Status:</strong>{" "}
            {isListening ? (
              <span className="text-success">
                🎤 Listening...
              </span>
            ) : (
              <span className="text-danger">
                ⏹ Not Listening
              </span>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}

