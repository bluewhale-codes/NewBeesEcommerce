import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, MicOff, Volume2, Trash2, ExternalLink, Moon, Sun, X, VolumeX, Volume1 } from "lucide-react"
const DigitalAssistant = () => {
  const [isListening, setIsListening] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [transcript, setTranscript] = useState("");
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [audioLevel, setAudioLevel] = useState(0);
  const [darkMode, setDarkMode] = useState(true);
  const [showTools, setShowTools] = useState(false);
  // Add these new states for TTS
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [ttsSupported, setTtsSupported] = useState(true);
  const [speechRate, setSpeechRate] = useState(1.0);
  const [speechPitch, setSpeechPitch] = useState(1.0);
  const [speechVolume, setSpeechVolume] = useState(1.0);
  const [ttsEnabled, setTtsEnabled] = useState(true);
  
  // Add these refs
  const speechSynthesisRef = useRef(null);
  const currentUtteranceRef = useRef(null);

  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isRecordingRef = useRef(false);

  // 🔽 For animated auto-scroll
  const messagesEndRef = useRef(null);

  // Auto-scroll down when messages change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({
        behavior: "smooth",
        block: "end"
      });
    }
  }, [messages]);

  // 🔧 Client-side Tools (logic unchanged)
  const clientTools = {
    endConversation: {
      name: "end_conversation",
      description: "End the current voice conversation",
      execute: () => {
        console.log("🛠️ Client tool: Ending conversation");
        if (isListening) {
          stopVoiceRecognition();
          addSystemMessage("Voice conversation ended.");
        }
        return { success: true, action: "ended_conversation" };
      }
    },
    openBrowserTab: {
      name: "open_browser_tab",
      description: "Open a new browser tab with specified URL",
      execute: (url) => {
        console.log(`🛠️ Client tool: Opening tab to ${url}`);
        window.open(url, "_blank", "noopener,noreferrer");
        return { success: true, url };
      }
    },
    clearConversation: {
      name: "clear_conversation",
      description: "Clear the conversation history",
      execute: () => {
        console.log("🛠️ Client tool: Clearing conversation");
        setMessages([]);
        return { success: true, cleared: true };
      }
    },
    toggleTheme: {
      name: "toggle_theme",
      description: "Toggle between dark and light mode",
      execute: () => {
        console.log(`🛠️ Client tool: Toggling theme to ${darkMode ? "light" : "dark"}`);
        setDarkMode(!darkMode);
        return { success: true, newTheme: darkMode ? "light" : "dark" };
      }
    },
    copyToClipboard: {
      name: "copy_to_clipboard",
      description: "Copy text to clipboard",
      execute: (text) => {
        console.log("🛠️ Client tool: Copying to clipboard");
        navigator.clipboard.writeText(text);
        return { success: true, copied: text.length };
      }
    },
      
  toggleTTS: {
    name: "toggle_tts",
    description: "Toggle text-to-speech on/off",
    execute: () => {
      console.log("🛠️ Client tool: Toggling TTS");
      setTtsEnabled(!ttsEnabled);
      if (isSpeaking) {
        stopSpeaking();
      }
      return { success: true, enabled: !ttsEnabled };
    }
  },
  
  adjustSpeechRate: {
    name: "adjust_speech_rate",
    description: "Adjust speech rate (0.5 to 2.0)",
    execute: (rate) => {
      const newRate = Math.min(Math.max(parseFloat(rate) || 1.0, 0.5), 2.0);
      console.log(`🛠️ Client tool: Setting speech rate to ${newRate}`);
      setSpeechRate(newRate);
      return { success: true, rate: newRate };
    }
  },
  
  adjustSpeechPitch: {
    name: "adjust_speech_pitch",
    description: "Adjust speech pitch (0.5 to 2.0)",
    execute: (pitch) => {
      const newPitch = Math.min(Math.max(parseFloat(pitch) || 1.0, 0.5), 2.0);
      console.log(`🛠️ Client tool: Setting speech pitch to ${newPitch}`);
      setSpeechPitch(newPitch);
      return { success: true, pitch: newPitch };
    }
  },
  
  stopSpeaking: {
    name: "stop_speaking",
    description: "Stop current speech",
    execute: () => {
      console.log("🛠️ Client tool: Stopping speech");
      stopSpeaking();
      return { success: true, stopped: true };
    }
  }
  };

  const executeClientTool = async (toolName, args = {}) => {
    const tool = clientTools[toolName];
    if (!tool) {
      console.error(`Client tool ${toolName} not found`);
      return null;
    }

    try {
      await fetch("https://backend-personal-digital-assistant.onrender.com/log-client-tool", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tool: toolName,
          action: "executed",
          timestamp: new Date().toISOString(),
          user: "client"
        })
      });

      const result = tool.execute(args);
      console.log(`✅ Client tool executed: ${toolName}`, result);
      return result;
    } catch (error) {
      console.error(`❌ Client tool failed: ${toolName}`, error);
      return null;
    }
  };

  const quickTools = [
    {
      name: "clear",
      icon: <Trash2 className="w-4 h-4" />,
      action: () => executeClientTool("clearConversation"),
      label: "Clear Chat"
    },
    {
      name: "theme",
      icon: darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: () => executeClientTool("toggleTheme"),
      label: "Toggle Theme"
    },
    {
      name: "github",
      icon: <ExternalLink className="w-4 h-4" />,
      action: () => executeClientTool("openBrowserTab", { url: "https://github.com" }),
      label: "Open GitHub"
    },
    {
      name: "end",
      icon: <X className="w-4 h-4" />,
      action: () => executeClientTool("endConversation"),
      label: "End Voice",
      disabled: !isListening
    },
    {
    name: "tts",
    icon: ttsEnabled ? (
      isSpeaking ? <Volume1 className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />
    ) : <VolumeX className="w-4 h-4" />,
    action: () => executeClientTool("toggleTTS"),
    label: ttsEnabled ? (isSpeaking ? "Speaking..." : "TTS On") : "TTS Off"
  },
  {
    name: "stop_speech",
    icon: <VolumeX className="w-4 h-4" />,
    action: () => executeClientTool("stopSpeaking"),
    label: "Stop Speech",
    disabled: !isSpeaking
  }
  ];

  const addSystemMessage = (text) => {
    const systemMsg = {
      id: Date.now(),
      role: "system",
      text,
      isSystem: true
    };
    setMessages((prev) => [...prev, systemMsg]);
  };

  // ===== TEXT-TO-SPEECH FUNCTIONS =====
const initializeTTS = () => {
  if ('speechSynthesis' in window) {
    speechSynthesisRef.current = window.speechSynthesis;
    setTtsSupported(true);
    
    // Get available voices
    const loadVoices = () => {
      const voices = speechSynthesisRef.current.getVoices();
      console.log("Available TTS voices:", voices.length);
    };
    
    speechSynthesisRef.current.onvoiceschanged = loadVoices;
    loadVoices();
  } else {
    setTtsSupported(false);
    console.warn("Speech synthesis not supported");
  }
};

const speakText = (text) => {
  if (!ttsEnabled || !ttsSupported || !speechSynthesisRef.current) {
    console.log("TTS not available or disabled");
    return;
  }
  
  // Stop any ongoing speech
  stopSpeaking();
  
  // Clean text - remove markdown, URLs, etc.
  const cleanText = text
    .replace(/[\[\]\(\)\{\}]/g, ' ') // Remove brackets
    .replace(/https?:\/\/\S+/g, 'link') // Replace URLs
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/`(.*?)`/g, '$1') // Remove code
    .trim();
    
  if (!cleanText) return;
  
  const utterance = new SpeechSynthesisUtterance(cleanText);
  
  // Configure speech
  utterance.rate = speechRate;
  utterance.pitch = speechPitch;
  utterance.volume = speechVolume;
  utterance.lang = 'en-US';
  
  // Select a voice (prefer female voices for better clarity)
  const voices = speechSynthesisRef.current.getVoices();
  const preferredVoice = voices.find(voice => 
    voice.lang.includes('en') && 
    voice.name.toLowerCase().includes('female')
  );
  
  if (preferredVoice) {
    utterance.voice = preferredVoice;
  }
  
  // Event handlers
  utterance.onstart = () => {
    setIsSpeaking(true);
    console.log("Started speaking:", cleanText.substring(0, 50) + "...");
  };
  
  utterance.onend = () => {
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
    console.log("Finished speaking");
  };
  
  utterance.onerror = (event) => {
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
    console.error("Speech synthesis error:", event.error);
    
    // Try to recover with a simpler voice
    if (event.error === 'interrupted') {
      setTimeout(() => {
        const fallbackUtterance = new SpeechSynthesisUtterance(
          cleanText.substring(0, 200) // Limit length
        );
        fallbackUtterance.rate = 1.0;
        fallbackUtterance.pitch = 1.0;
        fallbackUtterance.volume = 1.0;
        speechSynthesisRef.current.speak(fallbackUtterance);
      }, 100);
    }
  };
  
  currentUtteranceRef.current = utterance;
  speechSynthesisRef.current.speak(utterance);
};

const stopSpeaking = () => {
  if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
    speechSynthesisRef.current.cancel();
    setIsSpeaking(false);
    currentUtteranceRef.current = null;
  }
};

const pauseSpeaking = () => {
  if (speechSynthesisRef.current && speechSynthesisRef.current.speaking) {
    speechSynthesisRef.current.pause();
  }
};

const resumeSpeaking = () => {
  if (speechSynthesisRef.current && speechSynthesisRef.current.paused) {
    speechSynthesisRef.current.resume();
  }
};

  // ===== VOICE RECOGNITION (unchanged logic) =====
  const toggleVoiceInput = () => {
    if (!isSpeechSupported || loading) {
      setError("Voice input is not available right now");
      return;
    }
    if (isListening) {
      stopVoiceRecognition();
    } else {
      startVoiceRecognition();
    }
  };

  const handleVoicePressStart = () => {
    if (!isSpeechSupported || loading) return;
    startVoiceRecognition();
  };

  const handleVoicePressEnd = () => {
    if (!isSpeechSupported || loading) return;
    stopVoiceRecognition();
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
      try {
        recognitionRef.current.stop();
      } catch (err) {
        console.log("Recognition already stopped");
      }
    }

    stopAudioAnalysis();
    setAudioLevel(0);

    if (transcript.trim()) {
      setMessage(transcript);
    }
  };

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

  const startAudioLevelMonitoring = () => {
    if (!analyserRef.current) return;

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);

    const checkAudioLevel = () => {
      if (!analyserRef.current || !isRecordingRef.current) return;

      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) sum += dataArray[i];
      const average = sum / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);

      setAudioLevel(normalizedLevel);

      if (normalizedLevel > 0.15) {
        resetSilenceTimer();
      } else if (isRecordingRef.current) {
        if (!silenceTimeoutRef.current) {
          silenceTimeoutRef.current = setTimeout(() => {
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
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    analyserRef.current = null;
    resetSilenceTimer();
  };

  const detectToolCommands = (text) => {
    const commands = {
      "stop listening": () => executeClientTool("endConversation"),
      "clear chat": () => executeClientTool("clearConversation"),
      "open github": () => executeClientTool("openBrowserTab", { url: "https://github.com" }),
      "switch theme": () => executeClientTool("toggleTheme"),
      "dark mode": () => setDarkMode(true),
      "light mode": () => setDarkMode(false),
      "stop speaking": () => executeClientTool("stopSpeaking"),
      // TTS commands
    "pause speech": () => pauseSpeaking(),
    "resume speech": () => resumeSpeaking(),
    "faster speech": () => executeClientTool("adjustSpeechRate", 1.5),
    "slower speech": () => executeClientTool("adjustSpeechRate", 0.7),
    "turn on speech": () => setTtsEnabled(true),
    "turn off speech": () => {
      setTtsEnabled(false);
      stopSpeaking();}
    };

    Object.entries(commands).forEach(([command, action]) => {
      if (text.includes(command)) {
        console.log(`🎤 Voice command detected: ${command}`);
        action();
      }
    });
  };

  useEffect(() => {
  // ✅ ADD THIS LINE: Initialize TTS at the start
  initializeTTS();
  
  // sppech recognition setup
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    setIsSpeechSupported(false);
    // Don't return here, because TTS might still work even if speech recognition doesn't
  } else {
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
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalTranscript += t;
        else interimTranscript += t;
      }

      setTranscript(finalTranscript || interimTranscript);

      const fullText = (finalTranscript || interimTranscript).toLowerCase();
      detectToolCommands(fullText);

      if (interimTranscript.trim()) resetSilenceTimer();
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
      if (transcript.trim()) setMessage(transcript);
    };

    recognitionRef.current = recognition;
  }
  
  // ✅ ADD THIS CLEANUP FUNCTION:
  return () => {
    stopVoiceRecognition();
    stopSpeaking();
    if (speechSynthesisRef.current) {
      speechSynthesisRef.current.cancel();
    }
  };
}, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(message);
  };

  // === Your enhanced sendMessage with session ID (logic preserved) ===
  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userText = text.trim();
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: userText,
      isVoice: !!transcript
    };
    setMessages((prev) => [...prev, userMsg]);

    setLoading(true);
    setError("");
    setTranscript("");

    try {
      let sessionId = localStorage.getItem("ai_session_id");
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        localStorage.setItem("ai_session_id", sessionId);
      }

      const res = await fetch("https://backend-personal-digital-assistant.onrender.com/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Session-ID": sessionId
        },
        body: JSON.stringify({
          prompt: userText,
          sessionId: sessionId
        })
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.sessionId && data.sessionId !== sessionId) {
        localStorage.setItem("ai_session_id", data.sessionId);
        sessionId = data.sessionId;
      }

      if (data.tool_name === "send_email") {
        if (data.tool_result && data.tool_result.success) {
          addSystemMessage(
            `✅ Email sent to ${data.tool_result.to}! Message ID: ${data.tool_result.messageId}`
          );
        } else {
          addSystemMessage(
            `❌ Email failed: ${data.tool_result?.error || "Unknown error"}`
          );
        }
      }

      if (data.tool_name === "calculate" && data.tool_result) {
        console.log("🧮 Calculation result:", data.tool_result);
      }

      if (data.tool_used) {
        addSystemMessage(`Used tool: ${data.tool_name}`);
        console.log("🛠️ Server tool result:", data.tool_result);
      }

      if (data.blocked) {
        console.log("🚫 Question was blocked by hard guard");
        addSystemMessage(
          "⚠️ This question was blocked as it's not related to personal matters."
        );
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.answer,
        tool_used: data.tool_used,
        tool_name: data.tool_name,
        blocked: data.blocked || false,
        sessionId: sessionId
      };

      setMessages((prev) => [...prev, assistantMsg]);
      // Auto-speak the assistant's response
        if (data.answer && !data.blocked) {
        setTimeout(() => {
            speakText(data.answer);
        }, 500); // Small delay to ensure message is displayed
        }
    } catch (err) {
      console.error("Error sending message:", err);
      setError(`Something went wrong: ${err.message}`);

      const errorMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: `Sorry, I encountered an error: ${err.message}. Please try again.`,
        isError: true
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  useEffect(() => {
    if (!isListening && transcript.trim()) {
      const timer = setTimeout(() => {
        if (transcript.trim() && !loading) {
          sendMessage(transcript);
        }
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isListening, transcript, loading]);

  useEffect(() => {
    return () => {
        stopVoiceRecognition();
        stopSpeaking();
        if (speechSynthesisRef.current) {
        speechSynthesisRef.current.cancel();
        }
    };
    }, []);
  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-slate-950" : "bg-gray-50"
      } transition-colors duration-300 flex items-center justify-center px-3 sm:px-4`}
    >
      <div
        className={`relative w-full max-w-sm sm:max-w-md md:max-w-xl lg:max-w-2xl rounded-3xl ${
          darkMode ? "bg-slate-900/70 border-slate-700/60" : "bg-white/90 border-gray-200"
        } border shadow-2xl backdrop-blur-xl px-4 sm:px-6 md:px-8 pt-10 pb-24 flex flex-col items-center`}
      >
        {/* Profile */}
        <div className="flex justify-center -mt-16 mb-4">
          <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-white/80 shadow-xl overflow-hidden">
            <img
              src="https://res.cloudinary.com/dycjjaxsk/image/upload/v1761127039/products/aymupxrotvirulwrvbfv.png"
              alt="Owner"
              className="w-full h-full object-cover"
            />
          </div>
        </div>

        {/* Header */}
        <div className="text-center space-y-2 mt-2 mb-3">
          <h2
            className={`text-lg sm:text-xl md:text-2xl font-semibold ${
              darkMode ? "text-slate-50" : "text-gray-900"
            }`}
          >
            Your Digital Assistant
          </h2>
          <p
            className={`text-xs sm:text-sm ${
              darkMode ? "text-slate-300" : "text-gray-600"
            }`}
          >
            Speak naturally or use tools
          </p>

          {/* Tools Toggle */}
          <button
            onClick={() => setShowTools(!showTools)}
            className={`mt-2 px-3 py-1 rounded-full text-xs ${
              darkMode
                ? "bg-slate-800 text-slate-300 hover:bg-slate-700"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            } transition-colors`}
          >
            {showTools ? "Hide Tools" : "Show Tools"} ({quickTools.length})
          </button>

          {/* Quick Tools Bar */}
          {showTools && (
            <div className="mt-3 flex flex-wrap gap-2 justify-center">
              {quickTools.map((tool) => (
                <button
                  key={tool.name}
                  onClick={tool.action}
                  disabled={tool.disabled}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-[11px] sm:text-xs transition-colors ${
                    darkMode
                      ? "bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50"
                      : "bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50"
                  }`}
                  title={tool.label}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          )}

          {/* Status Indicators + transcript */}
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="flex flex-wrap items-center gap-2 justify-center">
              {!isSpeechSupported ? (
                <p
                  className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full border ${
                    darkMode
                      ? "border-red-600/70 bg-red-900/30 text-red-300"
                      : "border-red-300 bg-red-50 text-red-700"
                  } text-[11px] sm:text-xs`}
                >
                  <MicOff className="w-3 h-3 mr-1" /> Voice not supported
                </p>
              ) : isListening ? (
                <div className="flex items-center gap-2">
                  <p
                    className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full border ${
                      darkMode
                        ? "border-emerald-600/70 bg-emerald-900/30 text-emerald-300"
                        : "border-emerald-300 bg-emerald-50 text-emerald-700"
                    } text-[11px] sm:text-xs`}
                  >
                    <Volume2 className="w-3 h-3 mr-1" /> Listening...
                  </p>
                  {/* Audio Level Visualizer */}
                  <div className="flex items-end gap-1">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          Math.floor(audioLevel * 10) > i
                            ? darkMode
                              ? "bg-emerald-400"
                              : "bg-emerald-500"
                            : darkMode
                            ? "bg-emerald-900"
                            : "bg-emerald-200"
                        }`}
                        style={{
                          height:
                            Math.floor(audioLevel * 10) > i ? "14px" : "4px"
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <p
                  className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full border ${
                    darkMode
                      ? "border-blue-600/70 bg-blue-900/30 text-blue-300"
                      : "border-blue-300 bg-blue-50 text-blue-700"
                  } text-[11px] sm:text-xs`}
                >
                  <span className="animate-pulse">Thinking...</span>
                </p>
              ) : (
                <p
                  className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full border ${
                    darkMode
                      ? "border-slate-600/70 bg-slate-800/70 text-slate-200"
                      : "border-gray-300 bg-gray-100 text-gray-700"
                  } text-[11px] sm:text-xs`}
                >
                  Ready to listen
                </p>
              )}
              {/* TTS Status Indicator */}
                {ttsSupported && (
                <div className="flex items-center gap-1">
                    <p
                    className={`inline-flex items-center px-3 sm:px-4 py-1 rounded-full border text-[11px] sm:text-xs ${
                        darkMode
                        ? isSpeaking
                            ? "border-purple-600/70 bg-purple-900/30 text-purple-300"
                            : ttsEnabled
                            ? "border-green-600/70 bg-green-900/30 text-green-300"
                            : "border-gray-600/70 bg-gray-900/30 text-gray-300"
                        : isSpeaking
                        ? "border-purple-300 bg-purple-50 text-purple-700"
                        : ttsEnabled
                        ? "border-green-300 bg-green-50 text-green-700"
                        : "border-gray-300 bg-gray-100 text-gray-500"
                    }`}
                    >
                    {isSpeaking ? (
                        <>
                        <Volume2 className="w-3 h-3 mr-1 animate-pulse" />
                        Speaking...
                        </>
                    ) : ttsEnabled ? (
                        <>
                        <Volume2 className="w-3 h-3 mr-1" />
                        TTS On
                        </>
                    ) : (
                        <>
                        <VolumeX className="w-3 h-3 mr-1" />
                        TTS Off
                        </>
                    )}
                    </p>
                    
                    {/* Speech Controls */}
                    {isSpeaking && (
                    <button
                        onClick={stopSpeaking}
                        className={`p-1.5 rounded-full ${
                        darkMode
                            ? "bg-red-900/50 hover:bg-red-800/70 text-red-300"
                            : "bg-red-100 hover:bg-red-200 text-red-600"
                        }`}
                        title="Stop speaking"
                    >
                        <VolumeX className="w-3 h-3" />
                    </button>
                    )}
                </div>
                )}
            </div>

            {transcript && (
              <div
                className={`mt-2 px-3 py-2 rounded-lg max-w-full border text-xs sm:text-sm ${
                  darkMode
                    ? "bg-slate-800/50 border-slate-700/50"
                    : "bg-gray-100 border-gray-200"
                }`}
              >
                <p
                  className={`text-[11px] mb-1 ${
                    darkMode ? "text-slate-400" : "text-gray-500"
                  }`}
                >
                  Live transcript:
                </p>
                <p
                  className={`${darkMode ? "text-slate-200" : "text-gray-800"}`}
                >
                  {transcript}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div
          className={`w-full mb-4 flex-1 rounded-xl border p-3 text-xs sm:text-sm max-h-64 sm:max-h-72 md:max-h-80 overflow-y-auto space-y-2 ${
            darkMode
              ? "border-slate-700 bg-slate-800/80 text-slate-100"
              : "border-gray-300 bg-gray-50/80 text-gray-800"
          }`}
        >
          {messages.length === 0 && !error && (
            <p className={darkMode ? "text-slate-400" : "text-gray-500"}>
              Ask something or use tools to get started.
            </p>
          )}

          {messages.map((m) => (
            <div
              key={m.id}
              className={`flex ${
                m.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[88%] sm:max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap relative ${
                  m.role === "user"
                    ? `${
                        darkMode ? "bg-blue-600" : "bg-blue-500"
                      } text-white rounded-br-sm`
                    : m.role === "system"
                    ? `${
                        darkMode ? "bg-slate-700" : "bg-gray-200"
                      } ${
                        darkMode ? "text-slate-300" : "text-gray-600"
                      } rounded-xl text-[11px]`
                    : `${
                        darkMode ? "bg-slate-900" : "bg-white"
                      } ${
                        darkMode ? "text-slate-100" : "text-gray-800"
                      } rounded-bl-sm border ${
                        darkMode ? "border-slate-700" : "border-gray-200"
                      }`
                }`}
              >
                {m.text}
                {m.isVoice && (
                  <span className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <Mic className="w-3 h-3 text-white" />
                  </span>
                )}
                {m.tool_used && (
                  <span className="absolute -right-2 -top-2 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center">
                    <span className="text-[10px] text-white">🛠️</span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-[11px] mt-1">{error}</p>
          )}

          {/* Auto-scroll target */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full mt-auto mb-4">
          <div
            className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
              darkMode
                ? "border-slate-700 bg-slate-900/80"
                : "border-gray-300 bg-white/80"
            }`}
          >
            <input
              type="text"
              placeholder="Ask anything or give commands..."
              className={`w-full bg-transparent text-xs sm:text-sm focus:outline-none ${
                darkMode
                  ? "text-slate-100 placeholder:text-slate-500"
                  : "text-gray-900 placeholder:text-gray-500"
              }`}
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
          className={`group absolute -bottom-10 left-1/2 -translate-x-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg
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
            <MicOff className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          ) : isListening ? (
            <div className="relative">
              <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
            </div>
          ) : (
            <Mic className="w-7 h-7 sm:w-8 sm:h-8 text-white" />
          )}
        </button>

        {/* Instructions */}
        <div className="mt-16 text-center px-4">
          <p
            className={`text-[11px] sm:text-xs ${
              darkMode ? "text-slate-500" : "text-gray-500"
            }`}
          >
            Try saying: "What are my skills?", "Clear the chat", or "Open GitHub"
          </p>
          <p
            className={`text-[11px] sm:text-xs mt-1 ${
              darkMode ? "text-slate-600" : "text-gray-400"
            }`}
          >
            Tools available: {Object.keys(clientTools).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssistant;
