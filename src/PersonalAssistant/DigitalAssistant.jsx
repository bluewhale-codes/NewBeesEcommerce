import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, MicOff, Volume2 } from "lucide-react";

const DigitalAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isRecordingRef = useRef(false);

  // Check if speech recognition is supported
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
      console.error("Speech recognition not supported");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript("");
    };

    recognition.onresult = (event) => {
      let interimTranscript = "";
      let finalTranscript = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      setTranscript(finalTranscript || interimTranscript);
      
      // Reset silence timer on new speech
      if (interimTranscript.trim()) {
        resetSilenceTimer();
      }
    };

    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      if (event.error === "not-allowed") {
        setError("Microphone access denied. Please allow microphone permissions.");
      }
      stopVoiceRecognition();
    };

    recognition.onend = () => {
      setIsListening(false);
      stopAudioAnalysis();
      if (transcript.trim()) {
        setMessage(transcript);
      }
    };

    recognitionRef.current = recognition;
  }, []);

  // Initialize audio context and analyser for VAD
  const initAudioAnalysis = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: { 
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true 
        } 
      });
      
      mediaStreamRef.current = stream;
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      
      analyserRef.current.fftSize = 256;
      analyserRef.current.smoothingTimeConstant = 0.8;
      source.connect(analyserRef.current);
      
      startAudioLevelMonitoring();
    } catch (err) {
      console.error("Error accessing microphone:", err);
      setError("Could not access microphone. Please check permissions.");
    }
  };

  // Monitor audio levels for VAD
  const startAudioLevelMonitoring = () => {
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkAudioLevel = () => {
      if (!analyserRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);
      
      setAudioLevel(normalizedLevel);
      
      // VAD Logic
      if (normalizedLevel > 0.15) {
        // Speech detected - reset silence timer
        resetSilenceTimer();
      } else if (isRecordingRef.current) {
        // Silence detected - start/continue silence timer
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
            // Stop recording after 1.5 seconds of silence
            stopVoiceRecognition();
          }, 1500);
        }
      }
      
      if (isRecordingRef.current) {
        requestAnimationFrame(checkAudioLevel);
      }
    };
    
    checkAudioLevel();
  };

  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  const stopAudioAnalysis = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    resetSilenceTimer();
  };

  const startVoiceRecognition = async () => {
    if (!isSpeechSupported) {
      setError("Speech recognition is not supported in your browser.");
      return;
    }

    if (!recognitionRef.current) {
      setError("Speech recognition not initialized.");
      return;
    }

    try {
      isRecordingRef.current = true;
      await initAudioAnalysis();
      recognitionRef.current.start();
    } catch (err) {
      console.error("Error starting voice recognition:", err);
      stopVoiceRecognition();
    }
  };

  const stopVoiceRecognition = () => {
    isRecordingRef.current = false;
    resetSilenceTimer();
    
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    
    stopAudioAnalysis();
    setAudioLevel(0);
    
    // Use the transcript if it exists
    if (transcript.trim()) {
      setMessage(transcript);
    }
  };

  // Automatic voice activation on long press
  const handleVoicePressStart = () => {
    startVoiceRecognition();
  };

  const handleVoicePressEnd = () => {
    stopVoiceRecognition();
  };

  // Toggle voice input with click
  const toggleVoiceInput = () => {
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  // Auto-send after voice input with 2 seconds delay
  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const timer = setTimeout(() => {
        if (transcript.trim() && !loading) {
          handleSubmitVoice(transcript);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, loading]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(message);
  };

  const handleSubmitVoice = async (voiceText) => {
    await sendMessage(voiceText);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userText = text.trim();

    // Add user message
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: userText,
      isVoice: true,
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setError("");
    setTranscript(""); // Clear transcript after sending

    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: userText }),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();
      const answer = data.answer || data.response || 
                    (typeof data === "string" ? data : JSON.stringify(data));

      // Add assistant message
      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: answer,
      };
      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopVoiceRecognition();
    };
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/70 border border-slate-700/60 shadow-[0_20px_60px_rgba(15,23,42,0.8)] backdrop-blur-xl px-6 pt-10 pb-24 flex flex-col items-center">
        {/* Profile */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="w-24 h-24 rounded-full border-4 border-white/80 shadow-xl overflow-hidden">
            <img
              src="https://res.cloudinary.com/dycjjaxsk/image/upload/v1761127039/products/aymupxrotvirulwrvbfv.png"
              alt="Owner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mt-2 mb-3">
          <h2 className="text-xl font-semibold text-slate-50">
            Your Digital Assistant
          </h2>
          <p className="text-sm text-slate-300">
            Speak naturally - I'll listen automatically
          </p>
          
          {/* Status Indicators */}
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {!isSpeechSupported ? (
                <p className="inline-flex items-center px-4 py-1 rounded-full border border-red-600/70 bg-red-900/30 text-xs text-red-300">
                  <MicOff className="w-3 h-3 mr-1" /> Voice not supported
                </p>
              ) : isListening ? (
                <div className="flex items-center gap-2">
                  <p className="inline-flex items-center px-4 py-1 rounded-full border border-emerald-600/70 bg-emerald-900/30 text-xs text-emerald-300">
                    <Volume2 className="w-3 h-3 mr-1" /> Listening...
                  </p>
                  
                  {/* Audio Level Visualizer */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 h-${Math.floor(audioLevel * 10) > i ? '3' : '1'} rounded-full transition-all duration-100 ${
                          Math.floor(audioLevel * 10) > i 
                            ? 'bg-emerald-400' 
                            : 'bg-emerald-900'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <p className="inline-flex items-center px-4 py-1 rounded-full border border-blue-600/70 bg-blue-900/30 text-xs text-blue-300">
                  <span className="animate-pulse">Thinking...</span>
                </p>
              ) : (
                <p className="inline-flex items-center px-4 py-1 rounded-full border border-slate-600/70 bg-slate-800/70 text-xs text-slate-200">
                  Ready to listen
                </p>
              )}
            </div>
            
            {/* Live Transcript */}
            {transcript && (
              <div className="mt-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-full">
                <p className="text-xs text-slate-400 mb-1">Live transcript:</p>
                <p className="text-sm text-slate-200 truncate">{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className="w-full mb-4 flex-1 rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-slate-100 max-h-56 overflow-y-auto space-y-2">
          {messages.length === 0 && !error && (
            <p className="text-slate-400 text-xs">
              Speak or type to start the conversation.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap relative ${
                  m.role === "user"
                    ? "bg-blue-600 text-white rounded-br-sm"
                    : "bg-slate-900 text-slate-100 rounded-bl-sm"
                }`}
              >
                {m.text}
                {m.isVoice && (
                  <span className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-red-400 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full mt-auto mb-4">
          <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2">
            <input
              type="text"
              placeholder="Type or speak your question..."
              className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
              value={message}
              disabled={loading}
              onChange={(e) => setMessage(e.target.value)}
            />
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Voice Button */}
        <button
          type="button"
          onClick={toggleVoiceInput}
          onMouseDown={isSpeechSupported ? handleVoicePressStart : undefined}
          onMouseUp={isSpeechSupported ? handleVoicePressEnd : undefined}
          onMouseLeave={isListening ? handleVoicePressEnd : undefined}
          onTouchStart={isSpeechSupported ? handleVoicePressStart : undefined}
          onTouchEnd={isSpeechSupported ? handleVoicePressEnd : undefined}
          disabled={!isSpeechSupported || loading}
          className={`group absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-150 shadow-[0_15px_40px_rgba(37,99,235,0.7)]
          ${
            !isSpeechSupported
              ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed"
              : isListening
              ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 scale-95 animate-pulse"
              : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 hover:scale-105"
          }
          ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {!isSpeechSupported ? (
            <MicOff className="w-8 h-8 text-white" />
          ) : isListening ? (
            <div className="relative">
              <Mic className="w-8 h-8 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
          ) : (
            <Mic className="w-8 h-8 text-white" />
          )}
        </button>
        
        {/* Instructions */}
        <div className="mt-16 text-center">
          <p className="text-xs text-slate-500">
            {isSpeechSupported 
              ? "Hold or click the mic button to speak. I'll stop automatically when you pause."
              : "Voice input is not supported in this browser. Please use text input."}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssistant;