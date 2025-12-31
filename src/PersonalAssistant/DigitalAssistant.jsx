// import React, { useState, useEffect, useRef } from "react";
// import { Mic, Send, MicOff, Volume2 } from "lucide-react";

// const DigitalAssistant = () => {
//   const [isListening, setIsListening] = useState(false);
//   const [message, setMessage] = useState("");
//   const [messages, setMessages] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");
//   const [transcript, setTranscript] = useState("");
//   const [isSpeechSupported, setIsSpeechSupported] = useState(true);
//   const [audioLevel, setAudioLevel] = useState(0);
  
//   const recognitionRef = useRef(null);
//   const audioContextRef = useRef(null);
//   const analyserRef = useRef(null);
//   const mediaStreamRef = useRef(null);
//   const silenceTimeoutRef = useRef(null);
//   const isRecordingRef = useRef(false);

//   // Check if speech recognition is supported
//   useEffect(() => {
//     const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
//     if (!SpeechRecognition) {
//       setIsSpeechSupported(false);
//       console.error("Speech recognition not supported");
//       return;
//     }

//     const recognition = new SpeechRecognition();
//     recognition.continuous = true;
//     recognition.interimResults = true;
//     recognition.lang = "en-US";

//     recognition.onstart = () => {
//       setIsListening(true);
//       setTranscript("");
//     };

//     recognition.onresult = (event) => {
//       let interimTranscript = "";
//       let finalTranscript = "";

//       for (let i = event.resultIndex; i < event.results.length; i++) {
//         const transcript = event.results[i][0].transcript;
//         if (event.results[i].isFinal) {
//           finalTranscript += transcript;
//         } else {
//           interimTranscript += transcript;
//         }
//       }

//       setTranscript(finalTranscript || interimTranscript);
      
//       // Reset silence timer on new speech
//       if (interimTranscript.trim()) {
//         resetSilenceTimer();
//       }
//     };

//     recognition.onerror = (event) => {
//       console.error("Speech recognition error:", event.error);
//       if (event.error === "not-allowed") {
//         setError("Microphone access denied. Please allow microphone permissions.");
//       }
//       stopVoiceRecognition();
//     };

//     recognition.onend = () => {
//       setIsListening(false);
//       stopAudioAnalysis();
//       if (transcript.trim()) {
//         setMessage(transcript);
//       }
//     };

//     recognitionRef.current = recognition;
//   }, []);

//   // Initialize audio context and analyser for VAD
//   const initAudioAnalysis = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ 
//         audio: { 
//           echoCancellation: true,
//           noiseSuppression: true,
//           autoGainControl: true 
//         } 
//       });
      
//       mediaStreamRef.current = stream;
//       audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
//       const source = audioContextRef.current.createMediaStreamSource(stream);
//       analyserRef.current = audioContextRef.current.createAnalyser();
      
//       analyserRef.current.fftSize = 256;
//       analyserRef.current.smoothingTimeConstant = 0.8;
//       source.connect(analyserRef.current);
      
//       startAudioLevelMonitoring();
//     } catch (err) {
//       console.error("Error accessing microphone:", err);
//       setError("Could not access microphone. Please check permissions.");
//     }
//   };

//   // Monitor audio levels for VAD
//   const startAudioLevelMonitoring = () => {
//     const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
//     const checkAudioLevel = () => {
//       if (!analyserRef.current) return;
      
//       analyserRef.current.getByteFrequencyData(dataArray);
//       let sum = 0;
//       for (let i = 0; i < dataArray.length; i++) {
//         sum += dataArray[i];
//       }
//       const average = sum / dataArray.length;
//       const normalizedLevel = Math.min(average / 128, 1);
      
//       setAudioLevel(normalizedLevel);
      
//       // VAD Logic
//       if (normalizedLevel > 0.15) {
//         // Speech detected - reset silence timer
//         resetSilenceTimer();
//       } else if (isRecordingRef.current) {
//         // Silence detected - start/continue silence timer
//         if (!silenceTimeoutRef.current) {
//           silenceTimeoutRef.current = setTimeout(() => {
//             // Stop recording after 1.5 seconds of silence
//             stopVoiceRecognition();
//           }, 1500);
//         }
//       }
      
//       if (isRecordingRef.current) {
//         requestAnimationFrame(checkAudioLevel);
//       }
//     };
    
//     checkAudioLevel();
//   };

//   const resetSilenceTimer = () => {
//     if (silenceTimeoutRef.current) {
//       clearTimeout(silenceTimeoutRef.current);
//       silenceTimeoutRef.current = null;
//     }
//   };

//   const stopAudioAnalysis = () => {
//     if (mediaStreamRef.current) {
//       mediaStreamRef.current.getTracks().forEach(track => track.stop());
//       mediaStreamRef.current = null;
//     }
//     if (audioContextRef.current) {
//       audioContextRef.current.close();
//       audioContextRef.current = null;
//     }
//     analyserRef.current = null;
//     resetSilenceTimer();
//   };

//   const startVoiceRecognition = async () => {
//     if (!isSpeechSupported) {
//       setError("Speech recognition is not supported in your browser.");
//       return;
//     }

//     if (!recognitionRef.current) {
//       setError("Speech recognition not initialized.");
//       return;
//     }

//     try {
//       isRecordingRef.current = true;
//       await initAudioAnalysis();
//       recognitionRef.current.start();
//     } catch (err) {
//       console.error("Error starting voice recognition:", err);
//       stopVoiceRecognition();
//     }
//   };

//   const stopVoiceRecognition = () => {
//     isRecordingRef.current = false;
//     resetSilenceTimer();
    
//     if (recognitionRef.current && isListening) {
//       recognitionRef.current.stop();
//     }
    
//     stopAudioAnalysis();
//     setAudioLevel(0);
    
//     // Use the transcript if it exists
//     if (transcript.trim()) {
//       setMessage(transcript);
//     }
//   };

//   // Automatic voice activation on long press
//   const handleVoicePressStart = () => {
//     startVoiceRecognition();
//   };

//   const handleVoicePressEnd = () => {
//     stopVoiceRecognition();
//   };

//   // Toggle voice input with click
//   const toggleVoiceInput = () => {
//     if (isListening) {
//       stopVoiceRecognition();
//     } else {
//       startVoiceRecognition();
//     }
//   };

//   // Auto-send after voice input with 2 seconds delay
//   useEffect(() => {
//     if (!isListening && transcript.trim()) {
//       const timer = setTimeout(() => {
//         if (transcript.trim() && !loading) {
//           handleSubmitVoice(transcript);
//         }
//       }, 2000);
//       return () => clearTimeout(timer);
//     }
//   }, [isListening, transcript, loading]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await sendMessage(message);
//   };

//   const handleSubmitVoice = async (voiceText) => {
//     await sendMessage(voiceText);
//   };

//   const sendMessage = async (text) => {
//     if (!text.trim() || loading) return;

//     const userText = text.trim();

//     // Add user message
//     const userMsg = {
//       id: Date.now(),
//       role: "user",
//       text: userText,
//       isVoice: true,
//     };
//     setMessages((prev) => [...prev, userMsg]);

//     setLoading(true);
//     setError("");
//     setTranscript(""); // Clear transcript after sending

//     try {
//       const res = await fetch("http://localhost:3000/ask", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ prompt: userText }),
//       });

//       if (!res.ok) {
//         throw new Error("Failed to fetch response");
//       }

//       const data = await res.json();
//       const answer = data.answer || data.response || 
//                     (typeof data === "string" ? data : JSON.stringify(data));

//       // Add assistant message
//       const assistantMsg = {
//         id: Date.now() + 1,
//         role: "assistant",
//         text: answer,
//       };
//       setMessages((prev) => [...prev, assistantMsg]);
//     } catch (err) {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setLoading(false);
//       setMessage("");
//     }
//   };

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       stopVoiceRecognition();
//     };
//   }, []);

//   return (
//     <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
//       <div className="relative w-full max-w-sm rounded-3xl bg-slate-900/70 border border-slate-700/60 shadow-[0_20px_60px_rgba(15,23,42,0.8)] backdrop-blur-xl px-6 pt-10 pb-24 flex flex-col items-center">
//         {/* Profile */}
//         <div className="flex justify-center -mt-16 mb-4">
//           <div className="w-24 h-24 rounded-full border-4 border-white/80 shadow-xl overflow-hidden">
//             <img
//               src="https://res.cloudinary.com/dycjjaxsk/image/upload/v1761127039/products/aymupxrotvirulwrvbfv.png"
//               alt="Owner"
//               className="w-full h-full object-cover"
//             />
//           </div>
//         </div>

//         {/* Header */}
//         <div className="text-center space-y-2 mt-2 mb-3">
//           <h2 className="text-xl font-semibold text-slate-50">
//             Your Digital Assistant
//           </h2>
//           <p className="text-sm text-slate-300">
//             Speak naturally - I'll listen automatically
//           </p>
          
//           {/* Status Indicators */}
//           <div className="mt-3 flex flex-col items-center gap-2">
//             <div className="flex items-center gap-2">
//               {!isSpeechSupported ? (
//                 <p className="inline-flex items-center px-4 py-1 rounded-full border border-red-600/70 bg-red-900/30 text-xs text-red-300">
//                   <MicOff className="w-3 h-3 mr-1" /> Voice not supported
//                 </p>
//               ) : isListening ? (
//                 <div className="flex items-center gap-2">
//                   <p className="inline-flex items-center px-4 py-1 rounded-full border border-emerald-600/70 bg-emerald-900/30 text-xs text-emerald-300">
//                     <Volume2 className="w-3 h-3 mr-1" /> Listening...
//                   </p>
                  
//                   {/* Audio Level Visualizer */}
//                   <div className="flex items-center gap-0.5">
//                     {[...Array(5)].map((_, i) => (
//                       <div
//                         key={i}
//                         className={`w-1 h-${Math.floor(audioLevel * 10) > i ? '3' : '1'} rounded-full transition-all duration-100 ${
//                           Math.floor(audioLevel * 10) > i 
//                             ? 'bg-emerald-400' 
//                             : 'bg-emerald-900'
//                         }`}
//                       />
//                     ))}
//                   </div>
//                 </div>
//               ) : loading ? (
//                 <p className="inline-flex items-center px-4 py-1 rounded-full border border-blue-600/70 bg-blue-900/30 text-xs text-blue-300">
//                   <span className="animate-pulse">Thinking...</span>
//                 </p>
//               ) : (
//                 <p className="inline-flex items-center px-4 py-1 rounded-full border border-slate-600/70 bg-slate-800/70 text-xs text-slate-200">
//                   Ready to listen
//                 </p>
//               )}
//             </div>
            
//             {/* Live Transcript */}
//             {transcript && (
//               <div className="mt-2 px-3 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 max-w-full">
//                 <p className="text-xs text-slate-400 mb-1">Live transcript:</p>
//                 <p className="text-sm text-slate-200 truncate">{transcript}</p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Conversation */}
//         <div className="w-full mb-4 flex-1 rounded-xl border border-slate-700 bg-slate-800/80 p-3 text-sm text-slate-100 max-h-56 overflow-y-auto space-y-2">
//           {messages.length === 0 && !error && (
//             <p className="text-slate-400 text-xs">
//               Speak or type to start the conversation.
//             </p>
//           )}

//           {messages.map((m) => (
//             <div
//               key={m.id}
//               className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}
//             >
//               <div
//                 className={`max-w-[85%] rounded-2xl px-3 py-2 whitespace-pre-wrap relative ${
//                   m.role === "user"
//                     ? "bg-blue-600 text-white rounded-br-sm"
//                     : "bg-slate-900 text-slate-100 rounded-bl-sm"
//                 }`}
//               >
//                 {m.text}
//                 {m.isVoice && (
//                   <span className="absolute -left-2 -top-2 w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
//                     <Mic className="w-3 h-3 text-white" />
//                   </span>
//                 )}
//               </div>
//             </div>
//           ))}

//           {error && (
//             <p className="text-red-400 text-xs mt-1">{error}</p>
//           )}
//         </div>

//         {/* Input */}
//         <form onSubmit={handleSubmit} className="w-full mt-auto mb-4">
//           <div className="flex items-center gap-2 rounded-2xl border border-slate-700 bg-slate-900/80 px-3 py-2">
//             <input
//               type="text"
//               placeholder="Type or speak your question..."
//               className="w-full bg-transparent text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none"
//               value={message}
//               disabled={loading}
//               onChange={(e) => setMessage(e.target.value)}
//             />
//             <button
//               type="submit"
//               disabled={loading}
//               className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 disabled:opacity-50 transition-colors"
//             >
//               <Send className="w-4 h-4" />
//             </button>
//           </div>
//         </form>

//         {/* Voice Button */}
//         <button
//           type="button"
//           onClick={toggleVoiceInput}
//           onMouseDown={isSpeechSupported ? handleVoicePressStart : undefined}
//           onMouseUp={isSpeechSupported ? handleVoicePressEnd : undefined}
//           onMouseLeave={isListening ? handleVoicePressEnd : undefined}
//           onTouchStart={isSpeechSupported ? handleVoicePressStart : undefined}
//           onTouchEnd={isSpeechSupported ? handleVoicePressEnd : undefined}
//           disabled={!isSpeechSupported || loading}
//           className={`group absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-150 shadow-[0_15px_40px_rgba(37,99,235,0.7)]
//           ${
//             !isSpeechSupported
//               ? "bg-gradient-to-br from-gray-400 to-gray-600 cursor-not-allowed"
//               : isListening
//               ? "bg-gradient-to-br from-red-400 via-red-500 to-red-600 scale-95 animate-pulse"
//               : "bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 hover:scale-105"
//           }
//           ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
//         >
//           {!isSpeechSupported ? (
//             <MicOff className="w-8 h-8 text-white" />
//           ) : isListening ? (
//             <div className="relative">
//               <Mic className="w-8 h-8 text-white" />
//               <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping" />
//             </div>
//           ) : (
//             <Mic className="w-8 h-8 text-white" />
//           )}
//         </button>
        
//         {/* Instructions */}
//         <div className="mt-16 text-center">
//           <p className="text-xs text-slate-500">
//             {isSpeechSupported 
//               ? "Hold or click the mic button to speak. I'll stop automatically when you pause."
//               : "Voice input is not supported in this browser. Please use text input."}
//           </p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DigitalAssistant;
import React, { useState, useEffect, useRef } from "react";
import { Mic, Send, MicOff, Volume2, Trash2, ExternalLink, Moon, Sun, X } from "lucide-react";

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
  
  const recognitionRef = useRef(null);
  const audioContextRef = useRef(null);
  const analyserRef = useRef(null);
  const mediaStreamRef = useRef(null);
  const silenceTimeoutRef = useRef(null);
  const isRecordingRef = useRef(false);

  // 🔧 Client-side Tools
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
        window.open(url, '_blank', 'noopener,noreferrer');
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
        console.log(`🛠️ Client tool: Toggling theme to ${darkMode ? 'light' : 'dark'}`);
        setDarkMode(!darkMode);
        return { success: true, newTheme: darkMode ? 'light' : 'dark' };
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
    }
  };

  // Execute client tool
  const executeClientTool = async (toolName, args = {}) => {
    const tool = clientTools[toolName];
    if (!tool) {
      console.error(`Client tool ${toolName} not found`);
      return null;
    }
    
    try {
      // Log to server
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

  // Quick access tools
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
    }
  ];

  // Add system message
  const addSystemMessage = (text) => {
    const systemMsg = {
      id: Date.now(),
      role: "system",
      text,
      isSystem: true
    };
    setMessages(prev => [...prev, systemMsg]);
  };

  // ========== VOICE RECOGNITION FUNCTIONS ==========

  // Toggle voice input
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

  // Handle voice press start
  const handleVoicePressStart = () => {
    if (!isSpeechSupported || loading) return;
    startVoiceRecognition();
  };

  // Handle voice press end
  const handleVoicePressEnd = () => {
    if (!isSpeechSupported || loading) return;
    stopVoiceRecognition();
  };

  // Start voice recognition
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

  // Stop voice recognition
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

  // Initialize audio analysis for VAD
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

  // Start monitoring audio levels
  const startAudioLevelMonitoring = () => {
    if (!analyserRef.current) return;
    
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
    
    const checkAudioLevel = () => {
      if (!analyserRef.current || !isRecordingRef.current) return;
      
      analyserRef.current.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const average = sum / dataArray.length;
      const normalizedLevel = Math.min(average / 128, 1);
      
      setAudioLevel(normalizedLevel);
      
      // Voice Activity Detection (VAD) Logic
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

  // Reset silence timer
  const resetSilenceTimer = () => {
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
  };

  // Stop audio analysis
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

  // ========== END VOICE RECOGNITION FUNCTIONS ==========

  // Detect tool commands in voice
  const detectToolCommands = (text) => {
    const commands = {
      "stop listening": () => executeClientTool("endConversation"),
      "clear chat": () => executeClientTool("clearConversation"),
      "open github": () => executeClientTool("openBrowserTab", { url: "https://github.com" }),
      "switch theme": () => executeClientTool("toggleTheme"),
      "dark mode": () => setDarkMode(true),
      "light mode": () => setDarkMode(false)
    };

    Object.entries(commands).forEach(([command, action]) => {
      if (text.includes(command)) {
        console.log(`🎤 Voice command detected: ${command}`);
        action();
      }
    });
  };

  // Initialize speech recognition
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSpeechSupported(false);
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
      
      // Check for client tool commands
      const fullText = (finalTranscript || interimTranscript).toLowerCase();
      detectToolCommands(fullText);
      
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

  // Handle message submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    await sendMessage(message);
  };

  const sendMessage = async (text) => {
    if (!text.trim() || loading) return;

    const userText = text.trim();
    const userMsg = {
      id: Date.now(),
      role: "user",
      text: userText,
      isVoice: !!transcript
    };
    setMessages(prev => [...prev, userMsg]);

    setLoading(true);
    setError("");
    setTranscript("");

    try {
      const res = await fetch("https://backend-personal-digital-assistant.onrender.com/ask", {
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

       // if data tool is send_email, show success or error message
       if (data.tool_name === "send_email") {
        if (data.tool_result.success) {
            addSystemMessage(`✅ Email sent to ${data.tool_result.to}! Message ID: ${data.tool_result.messageId}`);
        } else {
            addSystemMessage(`❌ Email failed: ${data.tool_result.error}`);
        }
        }
      
      // Handle tool execution
      if (data.tool_used) {
        addSystemMessage(`Used tool: ${data.tool_name}`);
        console.log(`🛠️ Server tool result:`, data.tool_result);
      }

      const assistantMsg = {
        id: Date.now() + 1,
        role: "assistant",
        text: data.answer,
        tool_used: data.tool_used,
        tool_name: data.tool_name
      };
      setMessages(prev => [...prev, assistantMsg]);
      
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setMessage("");
    }
  };

  // Auto-send after voice
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

  // Cleanup
  useEffect(() => {
    return () => {
      stopVoiceRecognition();
    };
  }, []);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-950' : 'bg-gray-50'} transition-colors duration-300 flex items-center justify-center px-4`}>
      <div className={`relative w-full max-w-sm rounded-3xl ${darkMode ? 'bg-slate-900/70 border-slate-700/60' : 'bg-white/90 border-gray-200'} border shadow-xl backdrop-blur-xl px-6 pt-10 pb-24 flex flex-col items-center`}>
        
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
          <h2 className={`text-xl font-semibold ${darkMode ? 'text-slate-50' : 'text-gray-900'}`}>
            Your Digital Assistant
          </h2>
          <p className={`text-sm ${darkMode ? 'text-slate-300' : 'text-gray-600'}`}>
            Speak naturally or use tools
          </p>
          
          {/* Tools Toggle */}
          <button
            onClick={() => setShowTools(!showTools)}
            className={`mt-2 px-3 py-1 rounded-full text-xs ${darkMode ? 'bg-slate-800 text-slate-300 hover:bg-slate-700' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors`}
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
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs transition-colors ${darkMode 
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 disabled:opacity-50' 
                    : 'bg-gray-200 hover:bg-gray-300 text-gray-700 disabled:opacity-50'}`}
                  title={tool.label}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </button>
              ))}
            </div>
          )}
          
          {/* Status Indicators */}
          <div className="mt-3 flex flex-col items-center gap-2">
            <div className="flex items-center gap-2">
              {!isSpeechSupported ? (
                <p className={`inline-flex items-center px-4 py-1 rounded-full border ${darkMode ? 'border-red-600/70 bg-red-900/30 text-red-300' : 'border-red-300 bg-red-50 text-red-700'}`}>
                  <MicOff className="w-3 h-3 mr-1" /> Voice not supported
                </p>
              ) : isListening ? (
                <div className="flex items-center gap-2">
                  <p className={`inline-flex items-center px-4 py-1 rounded-full border ${darkMode ? 'border-emerald-600/70 bg-emerald-900/30 text-emerald-300' : 'border-emerald-300 bg-emerald-50 text-emerald-700'}`}>
                    <Volume2 className="w-3 h-3 mr-1" /> Listening...
                  </p>
                  
                  {/* Audio Level Visualizer */}
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <div
                        key={i}
                        className={`w-1 rounded-full transition-all duration-100 ${
                          Math.floor(audioLevel * 10) > i 
                            ? (darkMode ? 'bg-emerald-400' : 'bg-emerald-500')
                            : (darkMode ? 'bg-emerald-900' : 'bg-emerald-200')
                        }`}
                        style={{ 
                          height: Math.floor(audioLevel * 10) > i ? '12px' : '4px' 
                        }}
                      />
                    ))}
                  </div>
                </div>
              ) : loading ? (
                <p className={`inline-flex items-center px-4 py-1 rounded-full border ${darkMode ? 'border-blue-600/70 bg-blue-900/30 text-blue-300' : 'border-blue-300 bg-blue-50 text-blue-700'}`}>
                  <span className="animate-pulse">Thinking...</span>
                </p>
              ) : (
                <p className={`inline-flex items-center px-4 py-1 rounded-full border ${darkMode ? 'border-slate-600/70 bg-slate-800/70 text-slate-200' : 'border-gray-300 bg-gray-100 text-gray-700'}`}>
                  Ready to listen
                </p>
              )}
            </div>
            
            {/* Live Transcript */}
            {transcript && (
              <div className={`mt-2 px-3 py-2 rounded-lg max-w-full ${darkMode ? 'bg-slate-800/50 border-slate-700/50' : 'bg-gray-100 border-gray-200'}`}>
                <p className={`text-xs mb-1 ${darkMode ? 'text-slate-400' : 'text-gray-500'}`}>Live transcript:</p>
                <p className={`text-sm ${darkMode ? 'text-slate-200' : 'text-gray-800'}`}>{transcript}</p>
              </div>
            )}
          </div>
        </div>

        {/* Conversation */}
        <div className={`w-full mb-4 flex-1 rounded-xl border p-3 text-sm max-h-56 overflow-y-auto space-y-2 ${darkMode ? 'border-slate-700 bg-slate-800/80 text-slate-100' : 'border-gray-300 bg-gray-50/80 text-gray-800'}`}>
          {messages.length === 0 && !error && (
            <p className={darkMode ? 'text-slate-400' : 'text-gray-500'}>
              Ask something or use tools to get started.
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
                    ? `${darkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white rounded-br-sm`
                    : m.role === "system"
                    ? `${darkMode ? 'bg-slate-700' : 'bg-gray-200'} ${darkMode ? 'text-slate-300' : 'text-gray-600'} rounded-xl text-xs`
                    : `${darkMode ? 'bg-slate-900' : 'bg-white'} ${darkMode ? 'text-slate-100' : 'text-gray-800'} rounded-bl-sm border ${darkMode ? 'border-slate-700' : 'border-gray-200'}`
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
                    <span className="text-xs text-white">🛠️</span>
                  </span>
                )}
              </div>
            </div>
          ))}

          {error && (
            <p className="text-red-500 text-xs mt-1">{error}</p>
          )}
        </div>

        {/* Input */}
        <form onSubmit={handleSubmit} className="w-full mt-auto mb-4">
          <div className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${darkMode ? 'border-slate-700 bg-slate-900/80' : 'border-gray-300 bg-white/80'}`}>
            <input
              type="text"
              placeholder="Ask anything or give commands..."
              className={`w-full bg-transparent text-sm focus:outline-none ${darkMode ? 'text-slate-100 placeholder:text-slate-500' : 'text-gray-900 placeholder:text-gray-500'}`}
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
          className={`group absolute -bottom-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-150 shadow-lg
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
          <p className={`text-xs ${darkMode ? 'text-slate-500' : 'text-gray-500'}`}>
            Try saying: "What are my skills?", "Clear the chat", or "Open GitHub"
          </p>
          <p className={`text-xs mt-1 ${darkMode ? 'text-slate-600' : 'text-gray-400'}`}>
            Tools available: {Object.keys(clientTools).join(", ")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default DigitalAssistant;