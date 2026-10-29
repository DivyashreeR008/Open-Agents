import { useState, useEffect, useRef, useCallback } from "react";
import { recordAnalyticsRun } from "../lib/useAnalytics";
import { useNavigate, Link } from "react-router-dom";
import * as Icons from "lucide-react";
import CustomSelect from "./CustomSelect";
import {
  Loader2,
  RotateCcw,
  Clock,
  Zap,
  StopCircle,
  ChevronDown,
  ChevronRight,
  Sparkles,
  RotateCw,
  GitBranch,
  Trash2,
  CalendarClock,
  Layers,
  History,
} from "lucide-react";
import ApiKeyBar from "./ApiKeyBar";
import ApiKeyInfo from "./ApiKeyInfo";
import OutputRenderer from "./OutputRenderer";
import ErrorCard from "./ErrorCard";
import CharCounter from "./CharCounter";
import TokenCounter from "./TokenCounter";
import CostEstimator from "./CostEstimator";
import { useSessionSpend } from "../lib/useSessionSpend";
import VoiceInput from "./VoiceInput";
import SuggestedChainPills from "./SuggestedChainPills";
import RunRating from "./RunRating";
import BatchModeRunner from "./BatchModeRunner";
import ErrorBoundary from "./ErrorBoundary";
import AgentPreviewPanel from "./AgentPreviewPanel";
import PromptHistoryPanel from "./PromptHistoryPanel";
import { usePromptHistory } from "../lib/usePromptHistory";
import ScheduleAgentModal from "./ScheduleAgentModal";
import { useScheduler } from "../lib/useScheduler";
import { useApiKey } from "../lib/useApiKey";
import { streamAgent } from "../lib/llmAdapter";
import { analyseModels } from "../lib/modelAnalyser";
import { useHistory } from "../lib/useHistory";
import { resolveAgentModel, MODEL_MAP, MODELS, } from "../lib/resolveAgentModel";
import { useKeyboardShortcuts } from "../hooks/useKeyboardShortcuts";

const providerLabels = {
  openai: "OpenAI",
  anthropic: "Anthropic",
  gemini: "Gemini",
  openrouter: "OpenRouter",
  any: "Any",
};


const LOADING_MESSAGES = [
  "Working on your request...",
  "Consulting the model...",
  "Processing your inputs...",
  "Generating output...",
  "Refining the response...",
  "Almost done, hold tight...",
  "Finalizing output...",
  "Wrapping up...",
];

const MAX_CHAR_LIMIT = 4000; // Character cap configuration
export default function AgentRunner({ agent }) {
  const {
    provider,
    setProvider,
    apiKey,
    setApiKey,
    saveForSession,
    setSaveForSession,
  } = useApiKey();

  const { saveRun } = useHistory();
  const navigate = useNavigate();

  const [inputs, setInputs] = useState({});
  const [output, setOutput] = useState(null);
  const [streamingOutput, setStreamingOutput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [duration, setDuration] = useState(null);
  const [selectedModel, setSelectedModel] = useState(
    MODEL_MAP[provider] || MODEL_MAP.openai,
  );
  const [versionHistory, setVersionHistory] = useState([]);
  const [playgroundOpen, setPlaygroundOpen] = useState(false);
  const [customPrompt, setCustomPrompt] = useState(agent.systemPrompt);
  const [lastRunSystemPrompt, setLastRunSystemPrompt] = useState("");
  const [lastRunUserMessage, setLastRunUserMessage] = useState("");
  const [msgIndex, setMsgIndex] = useState(0);
  const [analyserOpen, setAnalyserOpen] = useState(false);
  const [modelRecommendation, setModelRecommendation] = useState(null);
  const [analyserLoading, setAnalyserLoading] = useState(false);
  const [scheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [batchMode, setBatchMode] = useState(false);
  const [showModelSwitcher, setShowModelSwitcher] = useState(false);
  const [historyPanelOpen, setHistoryPanelOpen] = useState(false);
  const [viewMode, setViewMode] = useState("code");
  const { savePrompt } = usePromptHistory();
  const { addJob } = useScheduler({ autoRun: false });
  const { addRun } = useSessionSpend();

  const isPromptModified = customPrompt !== agent.systemPrompt;
  const abortControllerRef = useRef(null);
  // Identifies the current run. streamAgent() resolves (rather than rejects)
  // when aborted, so a cancelled run's continuation looks identical to a
  // finished one. Every run captures the id it started with and must discard
  // its results if the id has since changed (cleared, superseded, unmounted).
  const runIdRef = useRef(0);
  const textareaRefs = useRef({});

  // Abort the in-flight request AND invalidate the run that owns it.
  const cancelActiveRun = () => {
    runIdRef.current += 1;
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
  };

  // Leaving the page mid-stream must stop the (billed) request and must not
  // write history/analytics for a run the user walked away from.
  useEffect(() => cancelActiveRun, []);


  useKeyboardShortcuts({
  'Control+Enter': () => {
    if (batchMode) return;
    if (canRun() && !loading) handleRun();
  },
    'Escape': () => {
      handleClear();
      setPlaygroundOpen(false);
    },
  });

  useEffect(() => {
    setSelectedModel(MODEL_MAP[provider] || MODEL_MAP.openai);
  }, [provider]);

  useEffect(() => {
    cancelActiveRun();
    setLoading(false);
    setOutput(null);
    setStreamingOutput("");
    setIsStreaming(false);
    setError(null);
    setDuration(null);
    setCustomPrompt(agent.systemPrompt);
    setPlaygroundOpen(false);
    setBatchMode(false);

    const defaults = {};
    agent.inputs.forEach((input) => {
      if (input.defaultValue !== undefined) {
        defaults[input.id] = input.defaultValue;
      } else if (input.type === "multiselect") {
        defaults[input.id] = [];
      } else {
        defaults[input.id] = "";
      }
    });
    setInputs(defaults);

    if (agent.provider !== "any") {
      setProvider(agent.provider);
    } else if (agent.defaultProvider) {
      setProvider(agent.defaultProvider);
    }
  }, [agent.id]);

  useEffect(() => {
    if (!loading || isStreaming) return;
    const interval = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % LOADING_MESSAGES.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [loading, isStreaming]);

  const updateInput = (id, value) => {
    setInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Finds the first free-text style input (textarea/text/code) with content,
  // used as the "prompt" for saving to / reusing from Prompt History.
  const getPrimaryPromptInput = () => {
    return agent.inputs.find(
      (i) => ["textarea", "text", "code"].includes(i.type) && (inputs[i.id] || "").trim()
    );
  };

  const handleSavePrompt = () => {
    const primary = getPrimaryPromptInput();
    if (!primary) return;
    savePrompt({
      text: inputs[primary.id],
      agentId: agent.id,
      agentName: agent.name,
    });
  };

  const handleUsePrompt = (text) => {
    const primary = agent.inputs.find((i) => ["textarea", "text", "code"].includes(i.type));
    if (!primary) return;
    updateInput(primary.id, text);
  };

  const getWordCount = (text) => {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
};

const getTokenCount = (text) => {
  if (!text) return 0;
  // A rough but highly accurate standard estimate: 1 token ≈ 4 characters
  return Math.ceil(text.length / 4);
};

  const toggleMultiselect = (id, option) => {
    setInputs((prev) => {
      const current = prev[id] || [];
      return {
        ...prev,
        [id]: current.includes(option)
          ? current.filter((o) => o !== option)
          : [...current, option],
      };
    });
  };

  const buildUserMessage = () => {
    const parts = [];
    agent.inputs.forEach((input) => {
      const val = inputs[input.id];
      if (!val || (Array.isArray(val) && val.length === 0)) return;

      const sanitizedVal = typeof val === "string" ? val.trim() : val;
      if (sanitizedVal === "") return;

      parts.push(
        Array.isArray(sanitizedVal)
          ? `${input.label}: ${sanitizedVal.join(", ")}`
          : `${input.label}: ${sanitizedVal}`,
      );
    });

    return parts
      .join("\n\n")
      .trim()
      .replace(/\n{3,}/g, "\n\n");
  };

  const canRun = () => {
    if (!apiKey) return false;
    return hasRequiredInputs();
  };

  const hasRequiredInputs = () => {
    return agent.inputs
      .filter((i) => i.required)
      .every((i) => {
        const v = inputs[i.id];
        if (Array.isArray(v)) return v.length > 0;
        return v && v.trim() !== "";
      });
  };

  const hasInputContent = () => {
    if (output || streamingOutput || error) return true;
    return agent.inputs.some((input) => {
      const v = inputs[input.id];
      if (Array.isArray(v)) return v.length > 0;
      return v && v !== (input.defaultValue ?? "");
    });
  };

  const handleChunk = useCallback((chunk) => {
    setStreamingOutput((prev) => prev + chunk);
    setIsStreaming(true);
  }, []);

const handleRun = async () => {
    setLoading(true);
    setError(null);
    setOutput(null);
    setStreamingOutput("");
    setIsStreaming(false);
    setDuration(null);
    setMsgIndex(0);

    setVersionHistory((prevHistory) => [
      {
        versionNumber: prevHistory.length + 1,
        timestamp: new Date().toLocaleTimeString(),
        configSnapshot: { ...inputs },
      },
      ...prevHistory,
    ]);

    setLastRunSystemPrompt(customPrompt);
    setLastRunUserMessage(buildUserMessage());

    // Supersede any run still winding down (e.g. one that was just stopped)
    // and give this run an identity so stale completions can be recognised.
    cancelActiveRun();
    const runId = runIdRef.current;
    const isCurrentRun = () => runIdRef.current === runId;

    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const actualProvider =
        agent.provider === "any" ? provider : agent.provider;
      const model = resolveAgentModel(agent, actualProvider, selectedModel);

      const result = await streamAgent({
        provider: actualProvider,
        model,
        apiKey,
        systemPrompt: customPrompt,
        userMessage: buildUserMessage(),
        onChunk: (chunk) => {
          if (isCurrentRun()) handleChunk(chunk);
        },
        signal: controller.signal,
      });

      // Cleared / superseded / unmounted while streaming: discard everything.
      // (Stop is different: it doesn't invalidate the run, so its partial
      // output is committed below exactly as before.)
      if (!isCurrentRun()) return;

      setOutput(result.content);
      setStreamingOutput("");
      setIsStreaming(false);
      setDuration(result.duration);

      const inputTokenEstimate = Math.max(
        1,
        Math.round((customPrompt.length + buildUserMessage().length) / 4),
      );
      const outputTokenEstimate = Math.max(1, Math.round(result.content.length / 4));

      addRun({
        model,
        inputTokens: inputTokenEstimate,
        outputTokens: outputTokenEstimate,
        inputCost: null,
        outputCost: null,
      });

      const runId = `${agent.id}_${Date.now()}`;

      saveRun({
        runId,
        agentId: agent.id,
        agentName: agent.name,
        inputs: { ...inputs },
        output: result.content,
        provider: actualProvider,
      });

      recordAnalyticsRun({
        runId,
        agentId: agent.id,
        agentName: agent.name,
        category: agent.category,
        provider: actualProvider,
        model,
        duration: result.duration,
      });
   } catch (err) {
  if (!isCurrentRun()) return;
  if (err.name !== "AbortError") {
    if (err && err.type === "invalid_api_key") {
      setError(err);
    } else {
      setError({ type: "generic", message: err.message });
    }
  }
} finally {
      // Only the owning run may touch shared state; a stale run's late
      // cleanup must not null the controller / loading flag of a newer run.
      if (isCurrentRun()) {
        setLoading(false);
        abortControllerRef.current = null;
      }
    }
  };

  const handleStop = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setOutput(streamingOutput);
    setStreamingOutput("");
    setIsStreaming(false);
    setLoading(false);
  };

  const handleClear = () => {
    // Cancel *and invalidate* the in-flight run so its late completion cannot
    // resurrect the output we are about to discard.
    cancelActiveRun();
    setLoading(false);
    setOutput(null);
    setStreamingOutput("");
    setIsStreaming(false);
    setError(null);
    setDuration(null);

    const defaults = {};
    agent.inputs.forEach((input) => {
      if (input.defaultValue !== undefined) {
        defaults[input.id] = input.defaultValue;
      } else if (input.type === "multiselect") {
        defaults[input.id] = [];
      } else {
        defaults[input.id] = "";
      }
    });
    setInputs(defaults);
  };

  const handleFillExample = () => {
    if (!agent.exampleInputs) return;
    setInputs((prev) => ({ ...prev, ...agent.exampleInputs }));
  };

  const handleAnalyseModels = async () => {
    if (!apiKey) return;
    setAnalyserLoading(true);
    setModelRecommendation(null);
    try {
      const result = await analyseModels(agent, apiKey, provider);
      setModelRecommendation(result);
    } catch (err) {
      setModelRecommendation("Failed to analyse models. Please try again.");
    } finally {
      setAnalyserLoading(false);
    }
  };

  const handleSendToWorkflow = () => {
    navigate("/workflows/build", {
      state: {
        preselectedAgents: [agent.id],
        preFilledOutput: output,
      },
    });
  };

  const IconComponent = Icons[agent.icon] || Icons.Bot;
  const supportsBatchMode = agent.inputs.some((i) =>
    ["text", "textarea", "code"].includes(i.type)
  );

 return (
    <div className="max-w-3xl mx-auto animate-fade-in">
      {/* Breadcrumb */}
      <Link
        to="/agents"
        className="inline-flex items-center gap-2 mb-5 h-8 px-3 bg-zinc-50 dark:bg-zinc-500/10 border border-zinc-200 dark:border-zinc-500/25 text-sm font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-500/20 transition-colors duration-200"
      >
        ← All Agents
      </Link>

      <div className="mt-2 mb-6 p-4 border bg-gray-50 dark:bg-zinc-900 dark:border-zinc-800 text-gray-900 dark:text-gray-100">
        <h3 className="text-xl font-bold tracking-tight mb-3 text-zinc-900 dark:text-white">
          Version History
          </h3>
        {versionHistory.length === 0 ? (
          <p className="text-gray-500 text-sm dark:text-gray-400">No versions saved yet. Click "Run" to create one.</p>
        ) : (
          <ul className="space-y-2">
            {versionHistory.map((v) => (
              <li key={v.versionNumber} className="flex justify-between items-center p-2 bg-white dark:bg-zinc-800 text-sm">
                <div>
                  <span className="font-medium text-zinc-600 dark:text-zinc-400">Version {v.versionNumber}</span>
                  <span className="text-gray-400 dark:text-gray-500 text-xs ml-2">({v.timestamp})</span>
                </div>
                <button
                  onClick={() => setInputs(v.configSnapshot)}
                  className="px-2 py-1 text-xs bg-gray-200 dark:bg-zinc-700 hover:bg-zinc-600 dark:hover:bg-zinc-500 hover:text-black transition"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Agent Header */}
      <div className="flex items-start gap-4 mb-5">
        <div className="w-12 h-12 bg-zinc-500/10 flex items-center justify-center flex-shrink-0">
          <IconComponent size={24} className="text-zinc-900 dark:text-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h1 className="font-display text-[17px] font-semibold tracking-[-0.02em] text-zinc-900 dark:text-text-primary">
              {agent.name}
            </h1>
            <span
              className="text-[10px] font-medium px-2 py-0.5 dark:bg-surface-input dark:text-text-muted dark:border-border bg-gray-100 text-gray-500 border border-gray-200"
            >
              {agent.category}
            </span>
            <span className="text-[10px] font-medium px-2 py-0.5 bg-zinc-500/10 text-zinc-900 dark:text-white border border-zinc-500/20">
              {providerLabels[agent.provider] || agent.provider}
            </span>
          </div>
          <p className="text-xs dark:text-text-secondary text-gray-500">
            {agent.description}
          </p>
        </div>
        <button
          onClick={() => setHistoryPanelOpen(true)}
          title="Prompt History & Favorites"
          className="p-2 dark:text-text-muted text-gray-500 hover:text-black dark:hover:text-white hover:bg-zinc-500/10 transition-colors"
        >
          <History size={18} />
        </button>
        <button
          onClick={handleClear}
          disabled={!hasInputContent()}
          title="Clear Chat"
          className="p-2 dark:text-text-muted text-gray-500 hover:text-zinc-500 hover:bg-zinc-50 dark:hover:bg-zinc-500/10 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Trash2 size={18} />
        </button>
      </div>

      {/* Code / Preview Toggle */}
      <div className="flex items-center gap-1 mb-4 p-1 w-fit dark:bg-surface-input bg-gray-100 border dark:border-border border-gray-200">
        <button
          onClick={() => setViewMode("code")}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
            viewMode === "code"
              ? "bg-black dark:bg-white text-white dark:text-black "
              : "dark:text-text-secondary text-gray-500 hover:dark:text-text-primary hover:text-gray-900"
          }`}
        >
          Code
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`px-3 py-1.5 text-xs font-semibold transition-colors ${
            viewMode === "preview"
              ? "bg-black dark:bg-white text-white dark:text-black "
              : "dark:text-text-secondary text-gray-500 hover:dark:text-text-primary hover:text-gray-900"
          }`}
        >
          Preview
        </button>
      </div>

      {viewMode === "preview" ? (
        <AgentPreviewPanel agent={agent} />
      ) : (
        <>
      {/* API Key Bar */}
      <ApiKeyBar
        provider={provider}
        setProvider={setProvider}
        apiKey={apiKey}
        setApiKey={setApiKey}
        saveForSession={saveForSession}
        setSaveForSession={setSaveForSession}
        agentProvider={agent.provider}
        model={selectedModel}
        setModel={setSelectedModel}
      />

      {supportsBatchMode && (
        <div className="flex items-center gap-2 mb-4">
          <button
            onClick={() => setBatchMode((prev) => !prev)}
            title="Run this agent across multiple inputs at once"
            className={`flex items-center gap-2 h-8 px-3 text-sm font-semibold
              transition-colors duration-200
              ${
                batchMode
                  ? "bg-zinc-400 text-black hover:bg-zinc-300 shadow-panel border border-zinc-500/30"
                  : "bg-white dark:bg-surface-card border border-gray-200 dark:border-border text-gray-700 dark:text-text-primary hover:border-zinc-400 dark:hover:border-zinc-500"
              }`}
          >
            <Layers size={16} />
            {batchMode ? "Exit Batch Mode" : "Batch Mode"}
          </button>
        </div>
      )}

      {batchMode ? (
        <div className="mb-6">
          <BatchModeRunner
            agent={agent}
            provider={agent.provider === "any" ? provider : agent.provider}
            apiKey={apiKey}
            selectedModel={selectedModel}
            systemPrompt={customPrompt}
          />
        </div>
      ) : (
        <>
      {/* Input Form */}
      <div className="space-y-3 mb-4">
        {agent.inputs.map((input) => (
          <div key={input.id}>
            <label className="block text-xs font-medium dark:text-text-secondary text-gray-600 mb-1.5">
              {input.label}
              {input.required && <span className="text-zinc-900 dark:text-white ml-0.5">*</span>}
            </label>

            {input.type === "text" && (
              <div className="relative">
                <input
                  type="text"
                  value={inputs[input.id] || ""}
                  onChange={(e) => updateInput(input.id, e.target.value)}
                  placeholder={input.placeholder}
                  className="w-full h-9 pl-3 pr-10 text-sm transition-colors dark:bg-surface-input dark:border-border dark:text-text-primary dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-900 placeholder:dark:text-text-muted text-gray-500 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                />
                <VoiceInput
                  value={inputs[input.id] || ""}
                  onChange={(v) => updateInput(input.id, v)}
                  className="top-1/2 -translate-y-1/2 right-1.5"
                />
              </div>
            )}

            {input.type === "textarea" && (
              <div className="relative flex flex-col gap-1">
                <textarea
  ref={(el) => {
    textareaRefs.current[input.id] = el;
  }}
                  value={inputs[input.id] || ""}
                  onChange={(e) => {
  if (e.target.value.length <= MAX_CHAR_LIMIT) {
    updateInput(input.id, e.target.value);

    e.target.style.height = "auto";
    e.target.style.height = `${e.target.scrollHeight}px`;
  }
}}
                  placeholder={input.placeholder}
                  rows={4}
                  className="w-full pl-3 pr-10 py-2 text-sm transition-colors resize-none overflow-hidden dark:bg-surface-input dark:border-border dark:text-text-primary dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                />
                <VoiceInput
                  value={inputs[input.id] || ""}
                  onChange={(v) => {
                    if (v.length <= MAX_CHAR_LIMIT) updateInput(input.id, v);
                  }}
                  className="top-2 right-2"
                />

                {/* Dynamic Live Counter Metric Footer Grid */}
                <div className="flex justify-between items-center px-1 text-[11px] text-gray-400 dark:text-text-muted mt-1.5 w-full">
                  <div className="flex gap-2 font-medium">
                    <span>📝 Words: {getWordCount(inputs[input.id])}</span>
                    <span>🪙 Est. Tokens: {getTokenCount(inputs[input.id])}</span>
                  </div>
                  <span className={`self-end ${inputs[input.id]?.length >= MAX_CHAR_LIMIT ? "text-zinc-500 font-semibold" : ""}`}>
                    {inputs[input.id]?.length || 0} / {MAX_CHAR_LIMIT} characters
                  </span>
                </div>

                <TokenCounter
                  value={inputs[input.id] || ""}
                  modelId={selectedModel}
                />
              </div>
            )}

            {input.type === "code" && (
              <div className="relative">
                <textarea
                  value={inputs[input.id] || ""}
                  onChange={(e) => updateInput(input.id, e.target.value)}
                  placeholder={input.placeholder}
                  rows={8}
                  className="w-full pl-3 pr-10 py-2 text-xs font-mono transition-colors resize-y leading-relaxed dark:bg-[#0A0A0A] dark:border-border dark:text-zinc-300 dark:placeholder:text-text-muted bg-gray-900 border border-gray-700 text-zinc-400 placeholder:text-gray-500 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                  spellCheck={false}
                />
                <VoiceInput
                  value={inputs[input.id] || ""}
                  onChange={(v) => updateInput(input.id, v)}
                  className="top-2 right-2"
                />
                <div className="flex items-center gap-3 mt-1">
                  <CharCounter
                    value={inputs[input.id] || ""}
                    maxLength={5000}
                  />
                  <TokenCounter
                    value={inputs[input.id] || ""}
                    modelId={selectedModel}
                  />
                </div>
              </div>
            )}

            {input.type === "select" && (
              <CustomSelect
                value={inputs[input.id] || input.defaultValue || ""}
                onChange={(val) => updateInput(input.id, val)}
                options={input.options || []}
                className="w-full sm:w-64"
                triggerClassName="h-9"
              />
            )}

            {input.type === "multiselect" && (
              <div className="flex flex-wrap gap-2">
                {input.options?.map((opt) => {
                  const selected = (inputs[input.id] || []).includes(opt);
                  return (
                    <button
                      key={opt}
                      onClick={() => toggleMultiselect(input.id, opt)}
                      className={`px-3 py-1.5 text-xs font-medium transition-colors border
                        ${
                          selected
                            ? "bg-zinc-900/10 text-zinc-900 border-zinc-900 dark:bg-white/10 dark:text-white dark:border-white"
                            : "dark:bg-surface-input dark:text-text-secondary dark:border-border dark:hover:border-zinc-400 bg-gray-50 text-gray-500 border-gray-200 hover:border-zinc-400/60"
                        }`}
                    >
                      {selected && "✓ "}
                      {opt}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Suggested workflow chain pills */}
      <SuggestedChainPills agent={agent} />

<div className="mb-4 flex items-center gap-2 flex-wrap">
  <button
    onClick={handleFillExample}
    className="inline-flex items-center gap-2 px-3 py-1.5 bg-zinc-500/10 text-zinc-900 dark:text-white font-semibold border border-zinc-500/20 hover:bg-zinc-500/20 hover:border-zinc-400 dark:hover:border-zinc-400 hover:gap-3 transition-all duration-200"
  >
    Try an example
  </button>
  <button
    onClick={handleSavePrompt}
    disabled={!getPrimaryPromptInput()}
    title="Save this prompt to your Prompt History"
    aria-describedby={!getPrimaryPromptInput() ? "save-prompt-reason" : undefined}
    className="inline-flex items-center gap-2 px-3 py-1.5 dark:bg-surface-input bg-gray-100 dark:text-text-secondary text-gray-600 font-semibold border dark:border-border border-gray-200 hover:border-zinc-400 dark:hover:border-zinc-400 hover:text-black dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-colors duration-200"
  >
    <History size={14} />
    Save Prompt
  </button>
  {!getPrimaryPromptInput() && (
    <span id="save-prompt-reason" className="text-[11px] dark:text-text-muted text-gray-500">
      Enter a prompt to save it.
    </span>
  )}
</div>

      {/* Prompt Playground */}
      <div
        className="mb-4 border transition-colors duration-200 dark:bg-surface-card dark:border-border bg-white border-gray-200"
      >
        <button
          onClick={() => setPlaygroundOpen(!playgroundOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left group"
        >
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-zinc-500 dark:text-zinc-400" />
            <span className="text-xs font-semibold dark:text-text-primary text-gray-700">
              Prompt Playground
            </span>
            {isPromptModified && (
              <span
                className="text-[10px] font-medium px-1.5 py-0.5 bg-zinc-400/10 text-zinc-500 border border-zinc-400/20"
              >
                Modified
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] dark:text-text-muted text-gray-400">
              {playgroundOpen ? "Collapse" : "Edit system prompt"}
            </span>
            {playgroundOpen ? (
              <ChevronDown
                size={14}
                className="dark:text-text-muted text-gray-400 transition-transform"
              />
            ) : (
              <ChevronRight
                size={14}
                className="dark:text-text-muted text-gray-400 transition-transform"
              />
            )}
          </div>
        </button>

        {playgroundOpen && (
          <div className="px-4 pb-4 animate-fade-in">
            <div className="mb-2 flex items-center justify-between">
              <label className="text-[11px] font-medium dark:text-text-secondary text-gray-500">
                System Prompt
              </label>
              <div className="flex items-center gap-2">
                <TokenCounter
                  value={customPrompt}
                  modelId={selectedModel}
                />
                <CharCounter
                  value={customPrompt}
                  maxLength={5000}
                />
                {isPromptModified && (
                  <button
                    onClick={() => setCustomPrompt(agent.systemPrompt)}
                    className="flex items-center gap-1 text-[10px] font-medium text-zinc-900 dark:text-white hover:text-zinc-700 dark:hover:text-zinc-200 transition-colors"
                    title="Reset to default prompt"
                  >
                    <RotateCw size={10} />
                    Reset
                  </button>
                )}
              </div>
            </div>
            <div className="relative">
              <textarea
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                rows={10}
                spellCheck={false}
                className="w-full pl-3 pr-10 py-2.5 text-xs font-mono leading-relaxed transition-colors resize-y dark:bg-[#0A0A0A] dark:border-border dark:text-text-secondary text-gray-600 dark:placeholder:text-text-muted bg-gray-50 border border-gray-200 text-gray-700 placeholder:text-gray-400 focus:ring-1 focus:ring-zinc-500/40 focus:border-zinc-500 outline-none"
                placeholder="Enter your custom system prompt..."
              />
              <VoiceInput
                value={customPrompt}
                onChange={(v) => setCustomPrompt(v)}
                className="top-2 right-2"
              />
            </div>
            {isPromptModified && (
              <p className="mt-2 text-[10px] dark:text-zinc-400/80 text-zinc-600 flex items-center gap-1">
                <Sparkles size={10} />
                You're using a custom prompt. This won't affect other users.
              </p>
            )}
          </div>
        )}
      </div>

      {/* Model Analyser Panel */}
      <div className="mb-4 border transition-colors duration-200 dark:bg-surface-card dark:border-border bg-white border-gray-200">
        <button
          onClick={() => setAnalyserOpen(!analyserOpen)}
          className="w-full flex items-center justify-between px-4 py-3 text-left group"
        >
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-zinc-900 dark:text-white" />
            <span className="text-xs font-semibold dark:text-text-primary text-gray-700">
              Model Analyser
            </span>
            <span className="text-[10px] font-medium px-1.5 py-0.5 bg-zinc-500/10 text-zinc-900 dark:text-white border border-zinc-500/20">
              Beta
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] dark:text-text-muted text-gray-400">
              {analyserOpen ? "Collapse" : "Find the best model for this agent"}
            </span>
            {analyserOpen ? (
              <ChevronDown size={14} className="dark:text-text-muted text-gray-400" />
            ) : (
              <ChevronRight size={14} className="dark:text-text-muted text-gray-400" />
            )}
          </div>
        </button>

        {analyserOpen && (
          <div className="px-4 pb-4 animate-fade-in">
            {!apiKey && (
              <p className="text-xs dark:text-text-muted text-gray-400 mb-3">
                Add an API key above to analyse models.
              </p>
            )}
            {apiKey && !modelRecommendation && !analyserLoading && (
              <button
                onClick={handleAnalyseModels}
                className="flex items-center gap-2 h-8 px-3 font-semibold text-white bg-zinc-600 hover:bg-zinc-500 transition-colors duration-200"
              >
                <Zap size={12} />
                Analyse Models
              </button>
            )}
            {analyserLoading && (
              <div className="flex items-center gap-2 text-xs text-zinc-900 dark:text-white">
                <Loader2 size={14} className="animate-spin" />
                Analysing best models for this agent...
              </div>
            )}
            {modelRecommendation && (
              <div className="mt-2">
                <OutputRenderer
                  content={modelRecommendation}
                  outputType="markdown"
                  agentName="Model Analyser"
                  systemPrompt=""
                />
                <button
                  onClick={() => setModelRecommendation(null)}
                  className="mt-2 text-[10px] text-zinc-900 dark:text-white hover:underline"
                >
                  ↺ Re-analyse
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 mb-6">
        {loading ? (
          <button
            onClick={handleStop}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold text-white bg-zinc-500 hover:bg-zinc-600 transition-all duration-200 active:scale-[0.98]"
          >
            <StopCircle size={16} />
            Stop
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={!canRun()}
            className="flex items-center gap-2 px-5 py-2 text-sm font-semibold bg-black text-white hover:bg-zinc-800 dark:bg-white dark:text-black dark:hover:bg-zinc-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200 active:scale-[0.98]"
          >
            <Zap size={16} />
            Run Agent
          </button>
        )}

        <button
          onClick={handleClear}
          disabled={!hasInputContent()}
          aria-describedby={!hasInputContent() ? "clear-reason" : undefined}
          className="flex items-center gap-1.5 h-8 px-3 text-sm font-medium transition-colors dark:text-text-secondary dark:hover:text-text-primary dark:hover:bg-surface-hover text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
        >
          <RotateCcw size={14} />
          Clear
        </button>
        {!hasInputContent() && (
          <span id="clear-reason" className="sr-only">
            Nothing to clear yet.
          </span>
        )}

        {/* Schedule button */}
        <button
          onClick={() => setScheduleModalOpen(true)}
          disabled={!hasRequiredInputs()}
          aria-describedby={!hasRequiredInputs() ? "schedule-reason" : undefined}
          title={
            hasRequiredInputs()
              ? "Schedule this agent to run automatically"
              : "Fill required inputs before scheduling"
          }
          className="flex items-center gap-1.5 h-8 px-3 text-sm font-medium transition-colors dark:text-text-secondary dark:hover:text-text-primary dark:hover:bg-surface-hover text-gray-500 hover:text-gray-900 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent dark:disabled:hover:bg-transparent"
        >
          <CalendarClock size={14} />
          Schedule
        </button>
        {!hasRequiredInputs() && (
          <span id="schedule-reason" className="text-[11px] dark:text-text-muted text-gray-500">
            Fill required inputs before scheduling.
          </span>
        )}

        {duration && (
          <div className="flex items-center gap-1 text-[11px] dark:text-text-muted text-gray-400 ml-auto">
            <Clock size={11} />
            {(duration / 1000).toFixed(1)}s
          </div>
        )}
      </div>

      <div className="mb-4">
        <CostEstimator
          inputText={buildUserMessage()}
          systemPrompt={customPrompt}
          modelId={selectedModel}
        />
      </div>

      {error && error.type === "invalid_api_key" ? (
        <ErrorCard message={
          <>
            <strong>
              {error.provider === "openai" && "Your OpenAI API key is invalid or expired."}
              {error.provider === "anthropic" && "Your Anthropic API key is invalid or expired."}
              {error.provider === "gemini" && "Your Google Gemini API key is invalid or expired."}
              {!["openai", "anthropic", "gemini"].includes(error.provider) && "Your API key is invalid or expired."}
            </strong>
            <br />
            Please check and update your API key.<br />
            <button
              className="underline text-zinc-900 dark:text-white"
              onClick={() => window.dispatchEvent(new CustomEvent("open-api-key-bar"))}
            >
              Update API Key
            </button>
            <span> or </span>
            <button
              className="underline text-zinc-900 dark:text-white"
              onClick={() => window.location.reload()}
            >
              Reloads page after an invalid API key error
            </button>
            {error.detail && (
              <>
                <br /><br />
                <span className="text-xs text-gray-400">Details: {error.detail}</span>
              </>
            )}
          </>
        } />
      ) : (
        error && <ErrorCard message={error.message || error} />
      )}

      {loading && !isStreaming && (
        <div className=" border p-6 dark:bg-surface-card dark:border-border bg-white border-gray-200 text-center animate-fade-in">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Loader2 size={16} className="animate-spin text-zinc-900 dark:text-white" />
            <span className="text-xs font-medium text-zinc-900 dark:text-white">
              Connecting to API...
            </span>
          </div>
          <p className="text-sm dark:text-text-secondary text-gray-500 transition-colors duration-500">
            {LOADING_MESSAGES[msgIndex]}
          </p>
        </div>
      )}

      {isStreaming && streamingOutput && (
        <div className="animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <span className="eyebrow">
              Output
            </span>
            <span className="flex items-center gap-1.5 text-[11px] font-medium text-zinc-900 dark:text-white">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full bg-zinc-400 dark:bg-white opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 bg-zinc-600 dark:bg-white"></span>
              </span>
              Streaming....
            </span>
          </div>
          <div className=" border p-4 dark:bg-surface-card dark:border-border bg-white border-gray-200">
            <div className="markdown-output text-sm dark:text-text-primary text-gray-900">
              <pre className="whitespace-pre-wrap font-sans leading-relaxed">
                {streamingOutput}
                <span className="inline-block w-[2px] h-[1em] bg-zinc-900 dark:bg-white animate-blink ml-0.5 align-middle" />
              </pre>
            </div>
          </div>
        </div>
      )}

      {output && !isStreaming && (
        <div className="space-y-4">
          <ErrorBoundary>
            <OutputRenderer
              content={output}
              outputType={agent.outputType}
              agentName={agent.name}
              systemPrompt={lastRunSystemPrompt}
              userMessage={lastRunUserMessage}
            />
            <div className="flex items-center gap-2 mt-3">
  <button
    onClick={() => setShowModelSwitcher(!showModelSwitcher)}
    className="flex items-center gap-2 h-8 px-3 text-sm bg-zinc-500/10 hover:bg-zinc-500/20 text-zinc-900 dark:text-white"
  >
    <RotateCw size={14} />
    Try Different Model
  </button>

  <span className="text-xs text-gray-500">
    Current: {selectedModel}
  </span>
</div>
{showModelSwitcher && (
  <div className="mt-3 p-4 border flex flex-wrap gap-3 items-center">
<CustomSelect
      value={provider}
      onChange={setProvider}
      options={[
        { value: "openai", label: "OpenAI" },
        { value: "anthropic", label: "Anthropic" },
        { value: "gemini", label: "Gemini" },
        { value: "openrouter", label: "OpenRouter" },
      ]}
    />

    <CustomSelect
      value={selectedModel}
      onChange={setSelectedModel}
      options={MODELS[provider] || []}
    />

    <button
      onClick={async () => {
        setShowModelSwitcher(false);
        await handleRun();
      }}
      className="h-8 px-3 bg-black dark:bg-white text-white dark:text-black hover:bg-zinc-800 dark:hover:bg-zinc-200"
    >
      Run Again
    </button>

  </div>
)}
          </ErrorBoundary>
          <div className="mt-4">
            <RunRating agentId={agent.id} />
            <button
              onClick={handleSendToWorkflow}
              className="flex items-center gap-2 h-8 px-3 text-sm font-semibold text-zinc-900 dark:text-white bg-zinc-500/10 hover:bg-zinc-500/20 transition-colors border border-zinc-500/20"
            >
              <GitBranch size={16} />
              Send output to Workflow Builder →
            </button>
          </div>
        </div>
      )}

      </>
      )}

      {/* Prompt History Panel */}
      <PromptHistoryPanel
        open={historyPanelOpen}
        onClose={() => setHistoryPanelOpen(false)}
        onUsePrompt={handleUsePrompt}
      />

      {/* Schedule Agent Modal */}
      {scheduleModalOpen && (
        <ScheduleAgentModal
          agent={agent}
          inputs={inputs}
          provider={provider}
          apiKey={apiKey}
          onSchedule={(scheduleData) => {
            addJob({
              agentId: agent.id,
              agentName: agent.name,
              agentDefinition: agent,
              inputs: { ...inputs },
              ...scheduleData,
            })
          }}
          onClose={() => setScheduleModalOpen(false)}
        />
      )}
      </>
      )}
    </div>
  );
}






