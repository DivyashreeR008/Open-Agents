import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Swords,
  ArrowLeft,
  Key,
  Eye,
  EyeOff,
  ChevronDown,
  Search,
  AlertCircle,
} from "lucide-react";
import { useDocumentTitle } from "../lib/useDocumentTitle";
import { useAgents } from "../lib/useAgents";
import { useProgressiveList } from "../lib/useProgressiveList";

// Input validation constants - prevent LLM calls with excessively long inputs
const INPUT_LIMITS = {
  text: 2000,      // Standard text field max
  textarea: 10000, // Textarea/description max
  code: 50000,     // Code input max (allow more for actual code)
  select: 1000,    // Select option max
  multiselect: 5000, // Combined multiselect options max
};

// Validate input length based on input type
function validateInput(input, value) {
  if (!value) return { valid: true };

  const limit = INPUT_LIMITS[input.type] || 2000;
  let length = 0;

  if (Array.isArray(value)) {
    // For multiselect, sum the lengths of all selected options
    length = value.join(", ").length;
  } else {
    length = String(value).length;
  }

  if (length > limit) {
    return {
      valid: false,
      error: `${input.label || "Input"} exceeds maximum length (${length}/${limit} characters)`,
      length,
      limit,
    };
  }

  return { valid: true, length, limit };
}

const API_KEY_FIELDS = [
  {
    id: "openai",
    label: "OpenAI API Key",
    placeholder: "sk-...",
    color: "text-zinc-400",
    border: "border-zinc-400/30",
    bg: "bg-zinc-400/10",
    focusBorder: "focus:border-zinc-400/60",
  },
  {
    id: "anthropic",
    label: "Anthropic API Key",
    placeholder: "sk-ant-...",
    color: "text-zinc-400",
    border: "border-zinc-400/30",
    bg: "bg-zinc-400/10",
    focusBorder: "focus:border-zinc-400/60",
  },
  {
    id: "gemini",
    label: "Gemini API Key",
    placeholder: "AIza...",
    color: "text-zinc-400",
    border: "border-zinc-400/30",
    bg: "bg-zinc-400/10",
    focusBorder: "focus:border-zinc-400/60",
  },
  {
    id: "openrouter",
    label: "OpenRouter API Key",
    placeholder: "sk-or-...",
    color: "text-zinc-400",
    border: "border-zinc-400/30",
    bg: "bg-zinc-400/10",
    focusBorder: "focus:border-zinc-400/60",
  },
];

function InputField({ input, value, onChange }) {
  const validation = validateInput(input, value);
  const baseClass =
    "w-full dark:bg-surface-input bg-gray-50 border border-gray-700 px-3 py-2 text-sm dark:text-text-primary text-gray-900 placeholder-gray-500 outline-none focus:border-gray-500 transition-colors duration-200 resize-none";

  const borderClass = validation.valid
    ? "border-gray-700"
    : "border-zinc-500/50 focus:border-zinc-500";

  if (input.type === "select") {
    return (
      <div>
        <div className="relative">
          <select
            aria-label={input.label}
            value={value ?? input.defaultValue ?? ""}
            onChange={(e) => onChange(input.id, e.target.value)}
            className={`${baseClass} ${borderClass} appearance-none cursor-pointer`}
            style={{ background: "rgb(0 0 0 / 0.6)" }}
          >
            {input.options.map((opt) => (
              <option key={opt} value={opt} style={{ background: "#000000" }}>
                {opt}
              </option>
            ))}
          </select>
          <ChevronDown
            size={14}
            className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-500 pointer-events-none"
          />
        </div>
        {!validation.valid && (
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <AlertCircle size={12} />
            {validation.error}
          </div>
        )}
      </div>
    );
  }

  if (input.type === "multiselect") {
    const selected = Array.isArray(value)
      ? value
      : input.defaultValue ?? [];
    const toggle = (opt) => {
      const next = selected.includes(opt)
        ? selected.filter((s) => s !== opt)
        : [...selected, opt];
      onChange(input.id, next);
    };
    return (
      <div>
        <div className="flex flex-wrap gap-2">
          {input.options.map((opt) => {
            const active = selected.includes(opt);
            return (
              <button
                key={opt}
                type="button"
                onClick={() => toggle(opt)}
                className={`px-3 py-1 text-xs font-medium border transition-colors duration-150
                  ${active
                    ? "bg-zinc-400/20 border-zinc-400/60 text-zinc-300"
                    : "bg-gray-800/60 border-gray-700 dark:text-text-muted text-gray-500 hover:border-gray-500 hover:text-gray-300"
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>
        {!validation.valid && (
          <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
            <AlertCircle size={12} />
            {validation.error}
          </div>
        )}
      </div>
    );
  }

  if (input.type === "code" || input.type === "textarea") {
    return (
      <div>
        <textarea
          aria-label={input.label}
          value={value ?? ""}
          onChange={(e) => onChange(input.id, e.target.value)}
          placeholder={input.placeholder}
          rows={input.type === "code" ? 8 : 4}
          className={`${baseClass} ${borderClass} font-mono text-xs leading-relaxed`}
        />
        <div className="flex items-center justify-between mt-1 text-xs">
          <div className={validation.valid ? "text-gray-500" : "text-zinc-400 flex items-center gap-1"}>
            {!validation.valid && (
              <>
                <AlertCircle size={12} />
                {validation.error}
              </>
            )}
            {validation.valid && validation.length > 0 && (
              <span className="text-gray-500">{validation.length}/{validation.limit} characters</span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Default: text input
  return (
    <div>
      <input
        aria-label={input.label}
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(input.id, e.target.value)}
        placeholder={input.placeholder}
        className={`${baseClass} ${borderClass}`}
      />
      {!validation.valid && (
        <div className="flex items-center gap-2 mt-1 text-xs text-zinc-400">
          <AlertCircle size={12} />
          {validation.error}
        </div>
      )}
    </div>
  );
}

export default function BattleModeSetup() {
  const navigate = useNavigate();
  useDocumentTitle("Battle Setup");

  const { agents, loading: agentsLoading } = useAgents();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [inputs, setInputs] = useState({});
  const [apiKeys, setApiKeys] = useState({
    openai: "",
    anthropic: "",
    gemini: "",
    openrouter: "",
  });
  const [showKeys, setShowKeys] = useState({
    openai: false,
    anthropic: false,
    gemini: false,
    openrouter: false,
  });
  const [step, setStep] = useState(1); // 1 = pick agent, 2 = fill inputs + keys

  const filteredAgents = agents.filter((a) => {
    const q = searchQuery.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.description?.toLowerCase().includes(q) ||
      a.category?.toLowerCase().includes(q)
    );
  });

  const {
    visibleItems: visibleAgents,
    hasMore: hasMoreAgents,
    remaining: remainingAgents,
    showMore: showMoreAgents,
    total: matchingAgentCount,
  } = useProgressiveList(filteredAgents, {
    pageSize: 24,
    resetKey: searchQuery,
  });

  const handleInputChange = (id, val) => {
    setInputs((prev) => ({ ...prev, [id]: val }));
  };

  const handleSelectAgent = (agent) => {
    setSelectedAgent(agent);
    // Pre-fill defaults
    const defaults = {};
    agent.inputs?.forEach((inp) => {
      if (inp.defaultValue !== undefined) {
        defaults[inp.id] = inp.defaultValue;
      }
    });
    setInputs(defaults);
    setStep(2);
  };

  const canSubmit =
    selectedAgent &&
    Object.values(apiKeys).some((k) => k.trim()) &&
    selectedAgent.inputs?.every((inp) => {
      const val = inputs[inp.id];
      if (!inp.required) {
        // For optional fields, if there's a value, it must be valid
        if (!val || (Array.isArray(val) && val.length === 0)) return true;
        return validateInput(inp, val).valid;
      }
      // For required fields, must have value and pass validation
      if (Array.isArray(val)) return val.length > 0 && validateInput(inp, val).valid;
      const hasValue = val && String(val).trim().length > 0;
      return hasValue && validateInput(inp, val).valid;
    });

  const handleStartBattle = () => {
    if (!canSubmit) return;
    navigate("/battle/arena", {
      state: { agent: selectedAgent, inputs, apiKeys },
    });
  };

  return (
    <div className="min-h-screen dark:bg-surface bg-gray-50 text-white battle-page-transition">

      <main className="pt-20 px-4 pb-12 max-w-4xl mx-auto">
        {/* Back */}
        <button
          onClick={() =>
            step === 2 ? setStep(1) : navigate("/battle")
          }
          className="flex items-center gap-1.5 text-xs font-medium dark:text-text-muted text-gray-500 hover:text-white transition-all duration-200 hover:gap-2 mb-8"
        >
          <ArrowLeft size={14} />
          {step === 2 ? "Back to Agent Selection" : "Back to Battle Mode"}
        </button>

        {/* Header */}
        <div className="text-center mb-10 battle-fade-in">
          <h1 className="text-3xl font-extrabold tracking-wider mb-1 text-white">
            {step === 1 ? "Pick Your Agent" : "Configure Battle"}
          </h1>
          <p className="text-sm dark:text-text-muted text-gray-500">
            {step === 1
              ? "Choose an agent to battle across GPT-4o, Claude Sonnet, Gemini Flash and OpenRouter"
              : `Setting up ${selectedAgent?.name}`}
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-3 mb-10">
          {[1, 2].map((s) => (
            <div key={s} className="flex items-center gap-3">
              <div
                className={`w-7 h-7 flex items-center justify-center text-xs font-bold border transition-colors duration-200
                  ${step >= s
                    ? "bg-zinc-400/20 border-zinc-400/60 text-zinc-300"
                    : "bg-gray-800 border-gray-700 dark:text-text-muted text-gray-500"
                  }`}
              >
                {s}
              </div>
              {s < 2 && (
                <div
                  className={`h-px w-12 transition-colors duration-300 ${
                    step > s ? "bg-zinc-400/40" : "bg-gray-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* ── STEP 1: Agent Selection ── */}
        {step === 1 && (
          <div className="battle-fade-in">
            {/* Search */}
            <div className="relative mb-6">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-500"
              />
              <input
                type="text"
                placeholder="Search agents..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                aria-label="Search agents"
                className="w-full dark:bg-surface-input bg-gray-50 border border-gray-700 pl-9 pr-4 py-2.5 text-sm dark:text-text-primary text-gray-900 placeholder-gray-500 outline-none focus:border-gray-500 transition-colors duration-200"
              />
            </div>

            {agentsLoading ? (
              <div className="text-center py-16 dark:text-text-muted text-gray-500 text-sm">
                Loading agents...
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[60vh] overflow-y-auto pr-1">
                {visibleAgents.map((agent) => (
                  <button
                    key={agent.id}
                    type="button"
                    onClick={() => handleSelectAgent(agent)}
                    className="text-left p-4 border dark:border-border border-gray-200 bg-gray-900/40 hover:border-zinc-400/40 hover:bg-gray-900/70 transition-all duration-200 active:scale-[0.98] group"
                  >
                    <div className="flex items-start justify-between gap-2 mb-1.5">
                      <span className="text-sm font-semibold dark:text-text-primary text-gray-900 group-hover:text-white transition-colors">
                        {agent.name}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 bg-gray-800 dark:text-text-muted text-gray-500 border border-gray-700 shrink-0">
                        {agent.category}
                      </span>
                    </div>
                    <p className="text-xs dark:text-text-muted text-gray-500 line-clamp-2 leading-relaxed">
                      {agent.description}
                    </p>
                  </button>
                ))}
                {hasMoreAgents && (
                  <button
                    type="button"
                    onClick={showMoreAgents}
                    className="sm:col-span-2 py-2.5 text-center text-xs font-medium dark:text-text-secondary text-gray-600 border border-dashed dark:border-border border-gray-300 hover:border-zinc-400 dark:hover:text-white hover:text-black transition-colors"
                  >
                    Show {Math.min(24, remainingAgents)} more of {matchingAgentCount}
                  </button>
                )}
                {matchingAgentCount === 0 && (
                  <div className="col-span-2 text-center py-12 dark:text-text-muted text-gray-500 text-sm">
                    No agents found for "{searchQuery}"
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ── STEP 2: Inputs + API Keys ── */}
        {step === 2 && selectedAgent && (
          <div className="space-y-8 battle-fade-in">
            {/* Agent Inputs */}
            <div className=" border dark:border-border border-gray-200 bg-gray-900/40 p-6">
              <h2 className="text-sm font-bold dark:text-text-primary text-gray-900 mb-5 uppercase tracking-wider">
                Agent Inputs
              </h2>
              <div className="space-y-5">
                {selectedAgent.inputs?.map((input) => (
                  <div key={input.id}>
                    <label className="block text-xs font-semibold dark:text-text-primary text-gray-900 mb-1.5 uppercase tracking-wide">
                      {input.label}
                      {input.required && (
                        <span className="text-zinc-400 ml-1">*</span>
                      )}
                    </label>
                    <InputField
                      input={input}
                      value={inputs[input.id]}
                      onChange={handleInputChange}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* API Keys */}
            <div className=" border dark:border-border border-gray-200 bg-gray-900/40 p-6">
              <div className="flex items-center gap-2 mb-5">
                <Key size={14} className="dark:text-text-muted text-gray-500" />
                <h2 className="text-sm font-bold dark:text-text-primary text-gray-900 uppercase tracking-wider">
                  API Keys
                </h2>
              </div>
              <p className="text-xs dark:text-text-muted text-gray-500 mb-5 leading-relaxed">
                Your keys are used directly in the browser and never sent to our
                servers. Add at least one key. Providers without a key are
                skipped in the arena.
              </p>
              <div className="space-y-4">
                {API_KEY_FIELDS.map((field) => (
                  <div key={field.id}>
                    <label
                      className={`block text-xs font-semibold mb-1.5 uppercase tracking-wide ${field.color}`}
                    >
                      {field.label}
                      <span className="text-zinc-400 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        aria-label={field.label}
                        type={showKeys[field.id] ? "text" : "password"}
                        value={apiKeys[field.id]}
                        onChange={(e) =>
                          setApiKeys((prev) => ({
                            ...prev,
                            [field.id]: e.target.value,
                          }))
                        }
                        placeholder={field.placeholder}
                        className={`w-full ${field.bg} border ${field.border} px-3 py-2 pr-10
                          text-sm dark:text-text-primary text-gray-900 placeholder-gray-600 outline-none
                          ${field.focusBorder} focus:border transition-colors duration-200`}
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setShowKeys((prev) => ({
                            ...prev,
                            [field.id]: !prev[field.id],
                          }))
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 dark:text-text-muted text-gray-500 hover:text-gray-300 transition-colors"
                        aria-label={
                          showKeys[field.id] ? "Hide key" : "Show key"
                        }
                      >
                        {showKeys[field.id] ? (
                          <EyeOff size={14} />
                        ) : (
                          <Eye size={14} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <button
              onClick={handleStartBattle}
              disabled={!canSubmit}
              className={`w-full flex items-center justify-center gap-2.5 px-8 py-4 
                text-sm font-bold transition-colors duration-200 border
                ${canSubmit
                  ? "bg-zinc-500 text-white hover:bg-zinc-400 border-zinc-400/20 shadow-panel "
                  : "bg-gray-800 text-gray-500 dark:text-text-muted border-gray-700 cursor-not-allowed"
                }`}
            >
              <Swords size={18} />
              {canSubmit ? "Start Battle" : "Fill all required fields"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}