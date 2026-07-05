/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from "react";
import {
  Orbit,
  Globe,
  Search,
  Bot,
  Volume2,
  VolumeX,
  Radio,
  BookOpen,
  Compass,
  Cpu,
  Wand2,
  Sliders,
  Star,
  Terminal,
  X,
  Minus,
  Maximize2,
  ChevronRight,
  Sparkles,
  RefreshCw,
  Zap,
  Play,
  Square,
  User,
  Check,
  Loader2,
  Info
} from "lucide-react";
import { CELESTIAL_BODIES, SPACE_TECH } from "./data";
import { CelestialBody, OSWindow, OSWindowID, AIMessage, SpaceTechEntry, TelemetrySignal } from "./types";
import CosmosEngine from "./components/CosmosEngine";

export default function App() {
  // --- STATE ---
  const [bodies, setBodies] = useState<CelestialBody[]>(CELESTIAL_BODIES);
  const [selectedBody, setSelectedBody] = useState<CelestialBody | null>(CELESTIAL_BODIES[3]); // Default to Earth
  const [warpActive, setWarpActive] = useState<boolean>(false);
  
  // OS Windows configuration
  const [windows, setWindows] = useState<OSWindow[]>([
    { id: "scanner", title: "QUANTUM SCANNER & EXOPLANET CREATOR", isOpen: true, isMinimized: false, zIndex: 10, x: 24, y: 80, width: 440, height: 500 },
    { id: "ai_assistant", title: "AI COGNITIVE STELLAR UPLINK", isOpen: false, isMinimized: false, zIndex: 5, x: 500, y: 80, width: 460, height: 520 },
    { id: "encyclopedia", title: "COSMOS ENCYCLOPEDIA & ARCHIVES", isOpen: false, isMinimized: false, zIndex: 5, x: 200, y: 120, width: 750, height: 480 },
    { id: "control_center", title: "STARSHIP COMMAND & DIAGNOSTICS", isOpen: false, isMinimized: false, zIndex: 5, x: 300, y: 150, width: 450, height: 440 },
    { id: "favorites", title: "SECTOR BOOKMARKS", isOpen: false, isMinimized: false, zIndex: 5, x: 400, y: 200, width: 380, height: 350 },
  ]);

  // Graphics and audio settings
  const [graphicsSettings, setGraphicsSettings] = useState({
    bloom: true,
    orbits: true,
    spaceDust: true,
    highRes: true,
    ambience: false,
  });

  // AI Chat & Generator states
  const [chatMode, setChatMode] = useState<'assistant' | 'tutor' | 'tour'>('assistant');
  const [educationLevel, setEducationLevel] = useState<string>('Academic');
  const [chatMessage, setChatMessage] = useState<string>("");
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [chatHistory, setChatHistory] = useState<AIMessage[]>([
    {
      sender: "cosmos",
      text: "Stellar Cognitive Uplink engaged. Welcome to COSMOS OS. I am your integrated starship computer. How shall we navigate the cosmic lattice today?",
      timestamp: new Date().toLocaleTimeString(),
      type: "assistant"
    }
  ]);

  // Exoplanet generator states
  const [exoplanetPrompt, setExoplanetPrompt] = useState<string>("");
  const [generatingPlanet, setGeneratingPlanet] = useState<boolean>(false);

  // Search star system state
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [showSearchResults, setShowSearchResults] = useState<boolean>(false);

  // Bookmarks/Favorites state
  const [favorites, setFavorites] = useState<string[]>(["earth", "sagittarius_a"]);

  // System telemetry visual states
  const [systemLoad, setSystemLoad] = useState<number>(32);
  const [systemTemp, setSystemTemp] = useState<number>(42);
  const [activeLogs, setActiveLogs] = useState<string[]>([
    "SYS_INIT: Quantum Core loaded in sector 0x7F",
    "GRAVITY_DRIVE: Calibrating standard Higgs field metrics",
    "UPLINK: Connected to deep space telemetry feeds",
  ]);

  // Audio nodes for ambient generator
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientOscRef = useRef<OscillatorNode | null>(null);
  const ambientGainRef = useRef<GainNode | null>(null);

  // Active dragging state
  const [draggedWindow, setDraggedWindow] = useState<OSWindowID | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });

  // Voice recognition mockup
  const [isListening, setIsListening] = useState<boolean>(false);

  // --- TIME EFFECTS ---
  const [currentTime, setCurrentTime] = useState<string>(new Date().toUTCString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toUTCString());
      // Randomly fluctuation of system diagnostics
      setSystemLoad(prev => Math.max(10, Math.min(95, prev + Math.floor(Math.random() * 7) - 3)));
      setSystemTemp(prev => Math.max(30, Math.min(80, prev + Math.floor(Math.random() * 3) - 1)));
      
      // Randomly log diagnostic alerts
      if (Math.random() < 0.08) {
        const diagnosticAlerts = [
          "TELEMETRY: Micro-meteoroid stream detected in quadrant 4",
          "CORE: Tachyon emission rate within safe thermal thresholds",
          "SCANNER: Radiometric shift noticed in local star dust",
          "GRAVITY: Gravitational shear from center blackhole locked",
          "OS_LINK: Synaptic memory registers synchronized",
        ];
        const newAlert = diagnosticAlerts[Math.floor(Math.random() * diagnosticAlerts.length)];
        setActiveLogs(prev => [newAlert, ...prev.slice(0, 18)]);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // --- AMBIENT SOUND GENERATOR ---
  useEffect(() => {
    if (graphicsSettings.ambience) {
      try {
        if (!audioCtxRef.current) {
          audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        const ctx = audioCtxRef.current;
        if (ctx.state === 'suspended') {
          ctx.resume();
        }

        // Deep space complex drone: 2 low frequencies + bandpass filter + slow LFO
        const osc1 = ctx.createOscillator();
        const osc2 = ctx.createOscillator();
        const lfo = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const mainGain = ctx.createGain();
        const lfoGain = ctx.createGain();

        osc1.type = 'sawtooth';
        osc1.frequency.setValueAtTime(55, ctx.currentTime); // Low A

        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(55.4, ctx.currentTime); // Thick chorus offset

        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(140, ctx.currentTime);
        filter.Q.setValueAtTime(5, ctx.currentTime);

        // LFO sweeps the filter cut-off for cosmic movement
        lfo.frequency.setValueAtTime(0.08, ctx.currentTime); // very slow sweep
        lfoGain.gain.setValueAtTime(60, ctx.currentTime);

        mainGain.gain.setValueAtTime(0.06, ctx.currentTime);

        // Connections
        lfo.connect(lfoGain);
        lfoGain.connect(filter.frequency);

        osc1.connect(filter);
        osc2.connect(filter);
        filter.connect(mainGain);
        mainGain.connect(ctx.destination);

        osc1.start();
        osc2.start();
        lfo.start();

        ambientOscRef.current = osc1; // Store reference to close
        ambientGainRef.current = mainGain;
      } catch (err) {
        console.warn("Could not initiate cosmic web audio synthesizers.", err);
      }
    } else {
      if (ambientGainRef.current) {
        try {
          ambientGainRef.current.gain.linearRampToValueAtTime(0, audioCtxRef.current?.currentTime || 0 + 0.5);
          setTimeout(() => {
            ambientOscRef.current?.stop();
            ambientOscRef.current = null;
            ambientGainRef.current = null;
          }, 600);
        } catch (e) {}
      }
    }
  }, [graphicsSettings.ambience]);

  // --- WINDOW CONTROLS ---
  const bringToFront = (id: OSWindowID) => {
    setWindows(prev => {
      const maxZ = Math.max(...prev.map(w => w.zIndex), 0);
      return prev.map(w => {
        if (w.id === id) {
          return { ...w, zIndex: maxZ + 1, isMinimized: false, isOpen: true };
        }
        return w;
      });
    });
  };

  const toggleWindow = (id: OSWindowID) => {
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        const isOpen = !w.isOpen;
        // If opening, bring it to the front
        const maxZ = Math.max(...prev.map(win => win.zIndex), 0);
        return { 
          ...w, 
          isOpen, 
          isMinimized: false,
          zIndex: isOpen ? maxZ + 1 : w.zIndex 
        };
      }
      return w;
    }));
  };

  const minimizeWindow = (id: OSWindowID, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isMinimized: true };
      }
      return w;
    }));
  };

  const closeWindow = (id: OSWindowID, e: React.MouseEvent) => {
    e.stopPropagation();
    setWindows(prev => prev.map(w => {
      if (w.id === id) {
        return { ...w, isOpen: false };
      }
      return w;
    }));
  };

  // Drag listeners
  const startDrag = (id: OSWindowID, e: React.MouseEvent<HTMLDivElement>) => {
    const win = windows.find(w => w.id === id);
    if (!win) return;
    bringToFront(id);
    setDraggedWindow(id);
    dragOffset.current = {
      x: e.clientX - win.x,
      y: e.clientY - win.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!draggedWindow) return;
      setWindows(prev => prev.map(w => {
        if (w.id === draggedWindow) {
          return {
            ...w,
            x: Math.max(10, Math.min(window.innerWidth - 100, e.clientX - dragOffset.current.x)),
            y: Math.max(40, Math.min(window.innerHeight - 80, e.clientY - dragOffset.current.y))
          };
        }
        return w;
      }));
    };

    const handleMouseUp = () => {
      setDraggedWindow(null);
    };

    if (draggedWindow) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [draggedWindow]);

  // --- ACTIONS ---
  const handleWarpTo = (body: CelestialBody) => {
    setSelectedBody(body);
    setWarpActive(true);
  };

  // Add exoplanet procedural generation
  const handleGenerateExoplanet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!exoplanetPrompt.trim()) return;

    setGeneratingPlanet(true);
    try {
      const response = await fetch("/api/cosmos/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mode: "generate_exoplanet",
          message: exoplanetPrompt
        })
      });
      const resData = await response.json();
      
      if (resData.data && resData.data.name) {
        const data = resData.data;
        // Build new celestial body object
        const newId = `exo_${Date.now()}`;
        const newBody: CelestialBody = {
          id: newId,
          name: data.name,
          type: "exoplanet",
          classification: data.classification,
          mass: data.mass,
          temperature: data.temperature,
          atmosphere: data.atmosphere,
          distance: data.distance,
          habitable: data.habitable,
          description: data.description,
          colors: data.colors && data.colors.length >= 2 ? [data.colors[0], data.colors[1], "#03001e"] : ["#ff007f", "#7f00ff", "#03001e"],
          radius: 12 + Math.floor(Math.random() * 8),
          orbitRadius: 180 + Math.floor(Math.random() * 240),
          orbitSpeed: data.orbitSpeed || 0.015,
          moonsCount: Math.floor(Math.random() * 4),
        };

        // Add to state and set as active target
        setBodies(prev => [...prev, newBody]);
        setSelectedBody(newBody);
        setExoplanetPrompt("");
        
        // Push cognitive alert
        setActiveLogs(prev => [`COSMIC_SCANNER: Successfully isolated exoplanet signature ${data.name}!`, ...prev]);

        // Toggle chat pane with exoplanet information
        setChatHistory(prev => [
          ...prev,
          {
            sender: "cosmos",
            text: `Procedural quantum synth mapping complete. Identified custom exoplanet: **${newBody.name}** orbiting in local coordinates. Classification: ${newBody.classification}. Atmospheric envelope contains rich ${newBody.atmosphere}.`,
            timestamp: new Date().toLocaleTimeString(),
            type: "scanned_exoplanet",
            planetData: newBody
          }
        ]);
        bringToFront("ai_assistant");
        if (!windows.find(w => w.id === "ai_assistant")?.isOpen) {
          toggleWindow("ai_assistant");
        }
      }
    } catch (err) {
      console.error("Exoplanet creation failure", err);
    } finally {
      setGeneratingPlanet(false);
    }
  };

  // AI Chat handler
  const handleSendChatMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg: AIMessage = {
      sender: "user",
      text: chatMessage,
      timestamp: new Date().toLocaleTimeString()
    };

    setChatHistory(prev => [...prev, userMsg]);
    setChatMessage("");
    setAiLoading(true);

    try {
      const payload = {
        mode: chatMode,
        message: chatMessage,
        context: chatMode === 'tutor' ? { educationLevel } : undefined
      };

      const response = await fetch("/api/cosmos/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const resData = await response.json();

      setChatHistory(prev => [
        ...prev,
        {
          sender: "cosmos",
          text: resData.text || "Synchronizing with spatial beacons. Signal weak.",
          timestamp: new Date().toLocaleTimeString(),
          type: chatMode
        }
      ]);
    } catch (err) {
      console.error("AI Assistant transmission error", err);
      setChatHistory(prev => [
        ...prev,
        {
          sender: "cosmos",
          text: "STATION TELEMETRY FAILURE: Transmissions to quantum center interrupted. Fallback operating system buffers activated.",
          timestamp: new Date().toLocaleTimeString()
        }
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  // Mock voice control input
  const triggerVoiceCommand = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }
    setIsListening(true);
    setActiveLogs(prev => ["SYS_AUDIO: Activating acoustic voice navigation matrix", ...prev]);
    
    // Simulate speech detection
    const speechPhrases = [
      { phrase: "warp to black hole", act: () => handleWarpTo(bodies.find(b => b.type === "blackhole")!) },
      { phrase: "open stellar encyclopedia", act: () => { if(!windows.find(w=>w.id==='encyclopedia')?.isOpen) toggleWindow('encyclopedia'); bringToFront('encyclopedia'); } },
      { phrase: "scan solar core", act: () => handleWarpTo(bodies.find(b => b.id === "sun")!) },
      { phrase: "engage warp drive to mars", act: () => handleWarpTo(bodies.find(b => b.id === "mars")!) }
    ];

    setTimeout(() => {
      const selected = speechPhrases[Math.floor(Math.random() * speechPhrases.length)];
      setActiveLogs(prev => [`Acoustic command recognized: "${selected.phrase.toUpperCase()}"`, ...prev]);
      selected.act();
      setIsListening(false);
    }, 2800);
  };

  // Toggle favorite / bookmark
  const toggleFavorite = (id: string) => {
    setFavorites(prev => 
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );
  };

  // Deep space search
  const filteredBodies = bodies.filter(b => 
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.classification.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative w-screen h-screen overflow-hidden text-slate-100 font-sans bg-[#020205] select-none">
      
      {/* 3D WEBGL/CANVAS SPACE VIEWPORT */}
      <CosmosEngine
        celestialBodies={bodies}
        selectedBody={selectedBody}
        onSelectBody={setSelectedBody}
        warpActive={warpActive}
        onWarpComplete={() => setWarpActive(false)}
        graphicsSettings={graphicsSettings}
        navigationMode="orbit"
      />

      {/* AMBIENT FUTURISTIC SPACE OVERLAY Huds */}
      <div className="absolute inset-0 pointer-events-none z-1 flex flex-col justify-between p-4">
        {/* Reticle / Crosshair HUD in the direct center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center opacity-25">
          <div className="w-16 h-16 border border-[#00f0ff] rounded-full flex items-center justify-center">
            <div className="w-2 h-2 bg-[#ff007f] rounded-full" />
          </div>
          <div className="absolute w-24 h-[1px] bg-[#00f0ff]" />
          <div className="absolute h-24 w-[1px] bg-[#00f0ff]" />
        </div>

        {/* Diagnostic log waterfall (Bottom Right) */}
        <div className="absolute bottom-24 right-4 max-w-sm max-h-48 overflow-hidden flex flex-col justify-end text-[10px] text-cyan-400/60 font-mono space-y-1 leading-normal text-right">
          {activeLogs.slice(0, 8).map((log, index) => (
            <div key={index} className="transition-all duration-300 hover:text-cyan-200">
              {log}
            </div>
          ))}
        </div>

        {/* Telemetry status cards (Top Right) */}
        <div className="absolute top-16 right-4 flex flex-col space-y-2 pointer-events-auto">
          <div className="backdrop-blur-md bg-slate-950/40 border border-slate-800/60 rounded px-3 py-2 text-xs flex items-center space-x-3 shadow-xl">
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono uppercase text-[9px]">Gravitational Anchor</span>
              <span className="text-emerald-400 font-semibold font-mono tracking-wider">SECURE (1.00g)</span>
            </div>
            <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
          </div>
          <div className="backdrop-blur-md bg-slate-950/40 border border-slate-800/60 rounded px-3 py-2 text-xs flex items-center justify-between space-x-4 shadow-xl">
            <div className="flex flex-col">
              <span className="text-slate-400 font-mono uppercase text-[9px]">Warp Drive Charge</span>
              <div className="flex items-center space-x-2 mt-0.5">
                <div className="w-20 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full ${warpActive ? 'bg-cyan-400 animate-pulse' : 'bg-pink-500'} transition-all`} 
                    style={{ width: warpActive ? "100%" : "85%" }}
                  />
                </div>
                <span className="text-[10px] font-mono">{warpActive ? "100%" : "85%"}</span>
              </div>
            </div>
            <Zap className={`w-3.5 h-3.5 ${warpActive ? 'text-cyan-400 animate-spin' : 'text-pink-500'}`} />
          </div>
        </div>
      </div>

      {/* TOP SYSTEM MENU BAR */}
      <header className="absolute top-0 left-0 w-full z-30 flex items-center justify-between px-6 py-2.5 backdrop-blur-xl bg-slate-950/40 border-b border-slate-900/60 text-slate-300 text-xs shadow-2xl">
        <div className="flex items-center space-x-6">
          {/* OS brand logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => bringToFront('control_center')}>
            <div className="p-1 rounded-md bg-gradient-to-br from-cyan-500 to-indigo-600 shadow-md">
              <Orbit className="w-4 h-4 text-white animate-spin" style={{ animationDuration: '8s' }} />
            </div>
            <span className="font-bold tracking-[0.2em] bg-clip-text text-transparent bg-gradient-to-r from-cyan-200 via-white to-purple-300">
              COSMOS OS
            </span>
          </div>

          {/* Quick Stats Grid */}
          <div className="hidden md:flex items-center space-x-4 border-l border-slate-800/80 pl-6 font-mono text-[10px] text-slate-400">
            <div>
              SECTOR: <span className="text-cyan-400">MILKYWAY.ALPHA_9</span>
            </div>
            <div>
              CORE LOAD: <span className="text-indigo-400">{systemLoad}%</span>
            </div>
            <div>
              TEMP: <span className="text-pink-400">{systemTemp}°C</span>
            </div>
          </div>
        </div>

        {/* Global Deep Space Target Search */}
        <div className="relative max-w-sm w-full mx-4 pointer-events-auto">
          <div className="flex items-center bg-slate-900/60 border border-slate-800/80 rounded-full px-3 py-1">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2" />
            <input
              type="text"
              placeholder="Search star systems, galaxies, exoplanets..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchResults(true);
              }}
              onFocus={() => setShowSearchResults(true)}
              className="bg-transparent border-none outline-none text-xs w-full text-slate-200 placeholder-slate-500"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-slate-500 hover:text-slate-300">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Search results modal */}
          {showSearchResults && searchQuery && (
            <div className="absolute top-full left-0 mt-1 w-full max-h-60 overflow-y-auto backdrop-blur-xl bg-slate-950/90 border border-slate-800 rounded-lg py-1 text-slate-300 shadow-2xl z-50">
              <div className="px-3 py-1 text-[9px] font-semibold text-slate-500 uppercase tracking-wider border-b border-slate-900">
                Scanning Database ({filteredBodies.length} found)
              </div>
              {filteredBodies.length === 0 ? (
                <div className="px-3 py-3 text-xs text-slate-500 text-center font-mono">
                  No stellar structures found in known sector catalogs.
                </div>
              ) : (
                filteredBodies.map(body => (
                  <button
                    key={body.id}
                    onClick={() => {
                      setSelectedBody(body);
                      setShowSearchResults(false);
                      setSearchQuery("");
                    }}
                    className="w-full text-left px-3 py-2 text-xs hover:bg-slate-900/80 hover:text-[#00f0ff] flex items-center justify-between border-b border-slate-950"
                  >
                    <div className="flex items-center space-x-2">
                      <Globe className="w-3 h-3 text-slate-400" />
                      <span>{body.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500 uppercase">{body.classification}</span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Global Action Tools */}
        <div className="flex items-center space-x-4">
          <button
            onClick={triggerVoiceCommand}
            className={`flex items-center space-x-1.5 px-2.5 py-1 rounded border ${isListening ? 'bg-pink-950/40 border-pink-500 text-pink-400' : 'bg-slate-900/40 border-slate-800 text-slate-300 hover:border-slate-700'}`}
          >
            <Radio className={`w-3.5 h-3.5 ${isListening ? 'animate-pulse text-pink-500' : ''}`} />
            <span className="text-[11px] font-medium">{isListening ? "Listening..." : "Voice Comm"}</span>
          </button>

          {/* Digital UTC Clock */}
          <div className="hidden lg:block font-mono text-cyan-400 tracking-widest bg-slate-900/50 px-3 py-1 rounded border border-slate-850/80">
            {currentTime}
          </div>
        </div>
      </header>

      {/* INTERACTIVE FLOATING GLASSMORPHIC OS WINDOWS */}
      <div className="absolute inset-0 pt-14 pb-20 pointer-events-none z-10 overflow-hidden">
        {windows.map((win) => {
          if (!win.isOpen || win.isMinimized) return null;

          return (
            <div
              key={win.id}
              className="absolute pointer-events-auto flex flex-col backdrop-blur-2xl bg-slate-950/70 border border-slate-800/80 rounded-xl shadow-2xl overflow-hidden transition-shadow duration-300 hover:shadow-cyan-950/20"
              style={{
                top: win.y,
                left: win.x,
                width: win.width,
                height: win.height,
                zIndex: win.zIndex,
              }}
              onClick={() => bringToFront(win.id)}
            >
              {/* Window Header */}
              <div
                onMouseDown={(e) => startDrag(win.id, e)}
                className="flex items-center justify-between px-4 py-3 bg-slate-900/60 border-b border-slate-800/60 cursor-grab active:cursor-grabbing text-slate-300"
              >
                <div className="flex items-center space-x-2">
                  <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase text-slate-200">
                    {win.title}
                  </span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={(e) => minimizeWindow(win.id, e)}
                    className="p-1 rounded hover:bg-slate-800/60 text-slate-400 hover:text-slate-200 transition"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={(e) => closeWindow(win.id, e)}
                    className="p-1 rounded hover:bg-red-950/80 text-slate-400 hover:text-red-400 transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Window Content */}
              <div className="flex-1 overflow-y-auto p-4 text-sm scrollbar-thin">
                
                {/* 1. QUANTUM SCANNER & EXOPLANET GENERATOR */}
                {win.id === "scanner" && (
                  <div className="space-y-4">
                    {/* Selected Celestial Body scan parameters */}
                    {selectedBody ? (
                      <div className="backdrop-blur-md bg-slate-900/40 border border-slate-800/80 rounded-lg p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2.5">
                            <div 
                              className="w-3 h-3 rounded-full shadow-lg" 
                              style={{ background: `linear-gradient(135deg, ${selectedBody.colors[0]}, ${selectedBody.colors[1] || '#000'})` }} 
                            />
                            <h3 className="text-base font-bold text-white tracking-wide">{selectedBody.name}</h3>
                          </div>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-cyan-950/80 text-cyan-400 rounded-full border border-cyan-800/40 uppercase">
                            {selectedBody.type}
                          </span>
                        </div>

                        <p className="text-xs text-slate-300 leading-relaxed font-sans">{selectedBody.description}</p>

                        <div className="grid grid-cols-2 gap-2 text-[11px] font-mono border-t border-slate-800/60 pt-3">
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">CLASSIFICATION</span>
                            <span className="text-slate-300 font-medium">{selectedBody.classification}</span>
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">MASS / MASSINDEX</span>
                            <span className="text-slate-300 font-medium">{selectedBody.mass}</span>
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">SURFACE TEMPERATURE</span>
                            <span className="text-slate-300 font-medium">{selectedBody.temperature}</span>
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">ATMOSPHERIC GRID</span>
                            <span className="text-slate-300 font-medium truncate">{selectedBody.atmosphere}</span>
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">DISTANCE TO SECTOR HUB</span>
                            <span className="text-slate-300 font-medium truncate">{selectedBody.distance}</span>
                          </div>
                          <div className="flex flex-col space-y-0.5">
                            <span className="text-slate-500">HABITABLE RATING</span>
                            <span className={selectedBody.habitable ? "text-emerald-400 font-bold" : "text-rose-400 font-bold"}>
                              {selectedBody.habitable ? "POSSIBLE (BIOSPHERE LOCKED)" : "EXTREME (UNINHABITABLE)"}
                            </span>
                          </div>
                        </div>

                        <div className="flex space-x-2 pt-2">
                          <button
                            onClick={() => handleWarpTo(selectedBody)}
                            className="flex-1 py-1.5 bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold font-mono tracking-widest rounded-md flex items-center justify-center space-x-2 shadow-lg hover:shadow-cyan-900/40 active:scale-95 transition"
                          >
                            <Zap className="w-3.5 h-3.5" />
                            <span>WARP TO COORDINATES</span>
                          </button>
                          <button
                            onClick={() => toggleFavorite(selectedBody.id)}
                            className={`p-1.5 rounded-md border ${favorites.includes(selectedBody.id) ? 'bg-pink-950/40 border-pink-500 text-pink-400' : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'} transition`}
                            title="Add to sector favorites"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 text-center text-slate-500 text-xs font-mono">
                        Awaiting system scanning target coordinate locks...
                      </div>
                    )}

                    {/* Exoplanet generation controls */}
                    <div className="border-t border-slate-800/80 pt-4 space-y-3">
                      <div className="flex items-center space-x-1.5">
                        <Wand2 className="w-4 h-4 text-purple-400" />
                        <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300">
                          GENAI PROCE-SYNTH SPECTROSCOPY
                        </h4>
                      </div>

                      <p className="text-[11px] text-slate-400 leading-normal">
                        Utilize artificial synaptic algorithms to procedurally map and generate exoplanets anywhere in the galaxy index. Just type its environmental parameters!
                      </p>

                      <form onSubmit={handleGenerateExoplanet} className="space-y-2">
                        <textarea
                          rows={2}
                          value={exoplanetPrompt}
                          onChange={(e) => setExoplanetPrompt(e.target.value)}
                          placeholder="E.g. A crystalline ice world with emerald oceans orbiting a dying red supergiant..."
                          className="w-full text-xs p-2 rounded-lg bg-slate-900/80 border border-slate-800/80 text-slate-200 outline-none focus:border-purple-500/80 placeholder-slate-600 resize-none"
                        />
                        <button
                          type="submit"
                          disabled={generatingPlanet || !exoplanetPrompt.trim()}
                          className="w-full py-2 bg-gradient-to-r from-purple-600 via-indigo-600 to-cyan-600 hover:from-purple-500 hover:via-indigo-500 hover:to-cyan-500 disabled:opacity-50 text-white text-xs font-bold font-mono tracking-widest rounded-md flex items-center justify-center space-x-2 shadow-lg transition"
                        >
                          {generatingPlanet ? (
                            <>
                              <Loader2 className="w-3.5 h-3.5 animate-spin" />
                              <span>ALIGNED TO ACCRETION STREAM...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-3.5 h-3.5 text-purple-200" />
                              <span>SYNTHESIZE PROCEDURAL PLANET</span>
                            </>
                          )}
                        </button>
                      </form>
                    </div>
                  </div>
                )}

                {/* 2. AI COGNITIVE STELLAR UPLINK */}
                {win.id === "ai_assistant" && (
                  <div className="flex flex-col h-full space-y-3">
                    {/* Chat mode navigation toggles */}
                    <div className="flex rounded-md bg-slate-900/80 border border-slate-800/60 p-0.5 text-xs font-mono">
                      <button
                        onClick={() => setChatMode('assistant')}
                        className={`flex-1 py-1 rounded text-center transition ${chatMode === 'assistant' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        OS CORE
                      </button>
                      <button
                        onClick={() => setChatMode('tutor')}
                        className={`flex-1 py-1 rounded text-center transition ${chatMode === 'tutor' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        PHYSICS TUTOR
                      </button>
                      <button
                        onClick={() => setChatMode('tour')}
                        className={`flex-1 py-1 rounded text-center transition ${chatMode === 'tour' ? 'bg-indigo-600 text-white font-medium shadow' : 'text-slate-400 hover:text-slate-200'}`}
                      >
                        STAR TOUR
                      </button>
                    </div>

                    {/* Physics tutor sub-selector settings */}
                    {chatMode === 'tutor' && (
                      <div className="flex items-center justify-between px-2.5 py-1.5 bg-slate-900/40 border border-slate-800/60 rounded-md text-xs font-mono">
                        <span className="text-slate-500">COGNITION LEVEL</span>
                        <select
                          value={educationLevel}
                          onChange={(e) => setEducationLevel(e.target.value)}
                          className="bg-transparent text-cyan-400 border-none outline-none font-medium cursor-pointer"
                        >
                          <option value="Novice Space-cadet" className="bg-slate-950 text-slate-200">Novice</option>
                          <option value="Academic" className="bg-slate-950 text-slate-200">Academic</option>
                          <option value="Quantum physicist" className="bg-slate-950 text-slate-200">Quantum Theorist</option>
                        </select>
                      </div>
                    )}

                    {/* Conversation history waterfall */}
                    <div className="flex-1 min-h-[220px] max-h-[300px] overflow-y-auto space-y-3 p-2 bg-slate-950/40 rounded-lg border border-slate-900/60 scrollbar-thin">
                      {chatHistory.map((msg, index) => (
                        <div
                          key={index}
                          className={`flex flex-col space-y-1 ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                        >
                          <div className="flex items-center space-x-1.5 text-[10px] text-slate-500 font-mono">
                            {msg.sender === 'user' ? (
                              <>
                                <span>PILOT UPLINK</span>
                                <User className="w-3 h-3 text-slate-400" />
                              </>
                            ) : (
                              <>
                                <Bot className="w-3 h-3 text-cyan-400" />
                                <span className="uppercase">{msg.type || "OS COMPUTER"}</span>
                              </>
                            )}
                          </div>
                          <div
                            className={`max-w-[85%] rounded-lg px-3 py-2 text-xs leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-indigo-600/90 text-white rounded-tr-none'
                                : 'bg-slate-900/80 text-slate-200 rounded-tl-none border border-slate-800/50'
                            }`}
                          >
                            <p className="whitespace-pre-line">{msg.text}</p>
                            
                            {/* Render exoplanet action targets directly inside messages if they are synthesized */}
                            {msg.planetData && (
                              <div className="mt-2.5 pt-2 border-t border-slate-800 flex justify-between items-center text-[10px] font-mono">
                                <span className="text-cyan-400">COORDINATE BEACON ENGAGED</span>
                                <button
                                  onClick={() => handleWarpTo(msg.planetData as CelestialBody)}
                                  className="px-2.5 py-1 bg-cyan-600/40 hover:bg-cyan-500 text-white rounded font-bold transition flex items-center space-x-1"
                                >
                                  <Zap className="w-3 h-3 text-white" />
                                  <span>WARP INITIATE</span>
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                      {aiLoading && (
                        <div className="flex items-center space-x-2 text-xs text-indigo-400 font-mono p-2">
                          <Loader2 className="w-3.5 h-3.5 animate-spin text-indigo-500" />
                          <span>SYNCHRONIZING WITH DEEP SPACE ACCRETION CHANNELS...</span>
                        </div>
                      )}
                    </div>

                    {/* Chat Input form */}
                    <form onSubmit={handleSendChatMessage} className="flex space-x-2">
                      <input
                        type="text"
                        value={chatMessage}
                        onChange={(e) => setChatMessage(e.target.value)}
                        placeholder={
                          chatMode === 'assistant' 
                            ? "Query star systems, request navigation logs..." 
                            : chatMode === 'tutor' 
                              ? "Ask about General Relativity, Black holes, Hawking radiation..."
                              : "Enter destination of tour (e.g. Sagittarius A* black hole)..."
                        }
                        className="flex-1 bg-slate-900/80 border border-slate-850/80 text-xs text-slate-200 px-3 py-2 rounded-lg outline-none focus:border-indigo-500 placeholder-slate-600"
                      />
                      <button
                        type="submit"
                        disabled={aiLoading || !chatMessage.trim()}
                        className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-lg text-xs font-bold font-mono tracking-wider transition"
                      >
                        TRANSMIT
                      </button>
                    </form>
                  </div>
                )}

                {/* 3. COSMOS ENCYCLOPEDIA & ARCHIVES */}
                {win.id === "encyclopedia" && (
                  <div className="space-y-4">
                    {/* Catalog tabs */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      
                      {/* Left: Celestial Database */}
                      <div className="lg:col-span-2 space-y-2">
                        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center space-x-1.5 border-b border-slate-900 pb-1.5">
                          <Globe className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Galaxy Star System Catalog</span>
                        </h3>
                        <div className="space-y-1 max-h-[300px] overflow-y-auto pr-1">
                          {bodies.map(body => (
                            <div
                              key={body.id}
                              className={`p-2.5 rounded-md text-xs transition cursor-pointer flex items-center justify-between border ${
                                selectedBody?.id === body.id
                                  ? 'bg-cyan-950/20 border-cyan-800 text-white'
                                  : 'bg-slate-900/40 border-slate-850/80 text-slate-300 hover:bg-slate-850/60'
                              }`}
                              onClick={() => setSelectedBody(body)}
                            >
                              <div className="flex items-center space-x-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ background: `linear-gradient(135deg, ${body.colors[0]}, ${body.colors[1] || '#000'})` }} />
                                <span className="font-medium">{body.name}</span>
                              </div>
                              <div className="flex items-center space-x-1 font-mono text-[9px] text-slate-500">
                                <span>{body.classification}</span>
                                <ChevronRight className="w-3 h-3 text-slate-400" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Right: Space Technology / Theories */}
                      <div className="lg:col-span-2 space-y-2">
                        <h3 className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase flex items-center space-x-1.5 border-b border-slate-900 pb-1.5">
                          <BookOpen className="w-3.5 h-3.5 text-purple-400" />
                          <span>Space Missions & Theories</span>
                        </h3>
                        <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                          {SPACE_TECH.map(tech => (
                            <div
                              key={tech.id}
                              className="p-3 bg-slate-900/40 border border-slate-850/80 rounded-lg space-y-1.5"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-200 text-xs">{tech.title}</span>
                                <span className="text-[9px] font-mono px-1.5 py-0.5 bg-slate-800 rounded uppercase text-slate-400">
                                  {tech.category}
                                </span>
                              </div>
                              <p className="text-[11px] text-slate-400 leading-normal">{tech.description}</p>
                              <p className="text-[11px] text-slate-300 italic bg-slate-950/40 p-2 rounded leading-relaxed">
                                {tech.longText}
                              </p>
                              
                              <div className="text-[10px] font-mono border-t border-slate-900/60 pt-2 space-y-1 text-slate-400">
                                {Object.entries(tech.specs).map(([k, v]) => (
                                  <div key={k} className="flex justify-between">
                                    <span className="uppercase text-slate-500">{k}:</span>
                                    <span>{v}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                    </div>
                  </div>
                )}

                {/* 4. STARSHIP COMMAND & CONTROL CENTER */}
                {win.id === "control_center" && (
                  <div className="space-y-4">
                    {/* Core System parameters */}
                    <div className="grid grid-cols-2 gap-4 text-xs">
                      
                      <div className="backdrop-blur-md bg-slate-900/40 border border-slate-850/80 rounded-lg p-3.5 space-y-3">
                        <h4 className="font-mono font-bold text-cyan-400 tracking-wider text-[10px] uppercase">
                          RENDER ENGINE SPECS
                        </h4>
                        
                        <div className="space-y-2 font-mono">
                          <label className="flex items-center justify-between text-[11px] cursor-pointer">
                            <span>SPACE ATMOSPHERIC BLOOM</span>
                            <input
                              type="checkbox"
                              checked={graphicsSettings.bloom}
                              onChange={() => setGraphicsSettings(prev => ({ ...prev, bloom: !prev.bloom }))}
                              className="accent-cyan-400"
                            />
                          </label>
                          <label className="flex items-center justify-between text-[11px] cursor-pointer">
                            <span>ORBITAL TRACK LINES</span>
                            <input
                              type="checkbox"
                              checked={graphicsSettings.orbits}
                              onChange={() => setGraphicsSettings(prev => ({ ...prev, orbits: !prev.orbits }))}
                              className="accent-cyan-400"
                            />
                          </label>
                          <label className="flex items-center justify-between text-[11px] cursor-pointer">
                            <span>COSMIC VOLUMETRIC DUST</span>
                            <input
                              type="checkbox"
                              checked={graphicsSettings.spaceDust}
                              onChange={() => setGraphicsSettings(prev => ({ ...prev, spaceDust: !prev.spaceDust }))}
                              className="accent-cyan-400"
                            />
                          </label>
                          <label className="flex items-center justify-between text-[11px] cursor-pointer">
                            <span>HIGH FREQUENCY WEBGL RES</span>
                            <input
                              type="checkbox"
                              checked={graphicsSettings.highRes}
                              onChange={() => setGraphicsSettings(prev => ({ ...prev, highRes: !prev.highRes }))}
                              className="accent-cyan-400"
                            />
                          </label>
                        </div>
                      </div>

                      <div className="backdrop-blur-md bg-slate-900/40 border border-slate-850/80 rounded-lg p-3.5 space-y-3">
                        <h4 className="font-mono font-bold text-purple-400 tracking-wider text-[10px] uppercase">
                          SOUND SYNTHESIZERS
                        </h4>

                        <div className="space-y-2 font-mono">
                          <label className="flex items-center justify-between text-[11px] cursor-pointer">
                            <span>AMBIENT SPACE DRONE</span>
                            <button
                              onClick={() => setGraphicsSettings(prev => ({ ...prev, ambience: !prev.ambience }))}
                              className={`p-1 rounded ${graphicsSettings.ambience ? 'bg-purple-600/40 text-purple-400' : 'bg-slate-800 text-slate-400'} hover:scale-105 transition`}
                            >
                              {graphicsSettings.ambience ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                            </button>
                          </label>

                          <div className="text-[10px] text-slate-500 leading-relaxed mt-1">
                            Drone synthesizes dynamic resonant low pass frequencies with local LFO oscillators directly on server-side Web Audio matrices.
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Operational Console Output */}
                    <div className="backdrop-blur-md bg-slate-950 border border-slate-900 rounded-lg p-3 space-y-2 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-1">
                        <span className="text-slate-400 font-bold flex items-center space-x-1.5">
                          <Terminal className="w-3.5 h-3.5 text-pink-500" />
                          <span>COSMOS CORE BOOT LOG</span>
                        </span>
                        <span className="text-[10px] text-slate-500">SECURE V1.04</span>
                      </div>
                      
                      <div className="max-h-28 overflow-y-auto space-y-1 text-[10px] text-slate-300 leading-normal scrollbar-thin">
                        <div className="text-cyan-400">[OK] webgl_canvas: calibrated to viewport dimensions.</div>
                        <div className="text-cyan-400">[OK] planetary_materials: procedural shaders initiated.</div>
                        <div className="text-indigo-400">[OK] AI_core: active uplink channel secure via flash-3.5 model.</div>
                        <div className="text-purple-400">[OK] solar_mass: G2V standard gravitational anchor checked.</div>
                        <div className="text-emerald-400">[OK] system_check: zero hardware bottlenecks detected. Active FPS: 60</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 5. SECTOR BOOKMARKS */}
                {win.id === "favorites" && (
                  <div className="space-y-3">
                    <p className="text-xs text-slate-400 font-mono">
                      List of registered sector beacons and exoplanets saved in local navigational arrays:
                    </p>

                    <div className="space-y-2 max-h-[220px] overflow-y-auto">
                      {favorites.map(favId => {
                        const b = bodies.find(item => item.id === favId);
                        if (!b) return null;

                        return (
                          <div
                            key={b.id}
                            className="p-3 bg-slate-900/60 border border-slate-800/60 rounded-lg flex items-center justify-between hover:border-cyan-700 transition"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-3 h-3 rounded-full" style={{ background: `linear-gradient(135deg, ${b.colors[0]}, ${b.colors[1] || '#000'})` }} />
                              <div className="flex flex-col">
                                <span className="font-bold text-xs text-slate-200">{b.name}</span>
                                <span className="text-[9px] font-mono text-slate-500">{b.classification}</span>
                              </div>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleWarpTo(b)}
                                className="px-2.5 py-1 bg-cyan-950/80 hover:bg-cyan-500 text-cyan-400 hover:text-white rounded text-[10px] font-mono font-bold border border-cyan-800/40 transition flex items-center space-x-1"
                              >
                                <Zap className="w-3 h-3" />
                                <span>WARP</span>
                              </button>
                              <button
                                onClick={() => toggleFavorite(b.id)}
                                className="text-rose-400 hover:text-rose-300 p-1"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                      {favorites.length === 0 && (
                        <div className="text-center p-6 text-slate-500 text-xs font-mono">
                          No planetary coordinates bookmarked in this flight deck.
                        </div>
                      )}
                    </div>
                  </div>
                )}

              </div>
            </div>
          );
        })}
      </div>

      {/* FOOTER SYSTEM DOCK / LAUNCHPAD */}
      <footer className="absolute bottom-4 left-1/2 -translate-x-1/2 z-40 px-6 py-3 backdrop-blur-2xl bg-slate-950/50 border border-slate-800/60 rounded-full flex items-center space-x-5 shadow-2xl pointer-events-auto">
        {/* Navigation items / window toggles */}
        <div className="flex items-center space-x-3">
          
          {/* Scanner Toggle */}
          <button
            onClick={() => toggleWindow('scanner')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              windows.find(w => w.id === 'scanner')?.isOpen 
                ? 'bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)] border border-cyan-500/40' 
                : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Toggle Planetary Scanner"
          >
            <Compass className="w-5 h-5" />
          </button>

          {/* AI Uplink Toggle */}
          <button
            onClick={() => toggleWindow('ai_assistant')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              windows.find(w => w.id === 'ai_assistant')?.isOpen 
                ? 'bg-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.25)] border border-indigo-500/40' 
                : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Toggle AI Uplink Cog"
          >
            <Bot className="w-5 h-5" />
          </button>

          {/* Encyclopedia Toggle */}
          <button
            onClick={() => toggleWindow('encyclopedia')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              windows.find(w => w.id === 'encyclopedia')?.isOpen 
                ? 'bg-purple-500/20 text-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.25)] border border-purple-500/40' 
                : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Toggle System Encyclopedia"
          >
            <BookOpen className="w-5 h-5" />
          </button>

          {/* Favorites Toggle */}
          <button
            onClick={() => toggleWindow('favorites')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              windows.find(w => w.id === 'favorites')?.isOpen 
                ? 'bg-pink-500/20 text-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.25)] border border-pink-500/40' 
                : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Toggle Bookmarked Sectors"
          >
            <Star className="w-5 h-5" />
          </button>

          {/* Control Center Toggle */}
          <button
            onClick={() => toggleWindow('control_center')}
            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
              windows.find(w => w.id === 'control_center')?.isOpen 
                ? 'bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.25)] border border-emerald-500/40' 
                : 'bg-slate-900/40 border border-slate-800/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
            title="Toggle Diagnostics Controls"
          >
            <Sliders className="w-5 h-5" />
          </button>

        </div>

        {/* Separator */}
        <div className="h-6 w-[1px] bg-slate-800/80" />

        {/* Selected target quick link telemetry */}
        <div className="text-xs flex items-center space-x-2">
          {selectedBody ? (
            <div className="flex items-center space-x-2 bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-850/60 shadow-inner">
              <span className="text-[10px] font-mono text-slate-500 uppercase">ACTIVE LOCK:</span>
              <span className="font-bold text-slate-200">{selectedBody.name}</span>
              <button 
                onClick={() => handleWarpTo(selectedBody)}
                className="ml-1 p-0.5 rounded bg-cyan-950/40 hover:bg-cyan-500/20 text-cyan-400 transition"
                title="Warp directly"
              >
                <Zap className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <span className="text-slate-500 font-mono text-[11px]">AWAITING DESTINATION LOCK...</span>
          )}
        </div>
      </footer>

    </div>
  );
}
