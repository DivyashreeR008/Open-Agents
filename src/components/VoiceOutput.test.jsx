import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, act } from "@testing-library/react";
import VoiceOutput from "./VoiceOutput";

let utteranceInstances = [];

class FakeSpeechSynthesisUtterance {
  constructor(text) {
    this.text = text;
    this.lang = "";
    this.rate = 1;
    this.pitch = 1;
    this.onstart = null;
    this.onend = null;
    this.onerror = null;
    utteranceInstances.push(this);
  }
}

class FakeSpeechSynthesis {
  constructor() {
    this.pending = null;
    this.speaking = false;
    this.paused = false;
  }

  speak(utterance) {
    this.pending = utterance;
    this.speaking = true;
    this.paused = false;
    if (utterance.onstart) utterance.onstart();
  }

  cancel() {
    if (this.pending && this.pending.onerror) {
      this.pending.onerror({ error: "canceled" });
    }
    this.pending = null;
    this.speaking = false;
    this.paused = false;
  }

  pause() {
    if (this.speaking && !this.paused) {
      this.paused = true;
    }
  }

  resume() {
    if (this.paused) {
      this.paused = false;
    }
  }

  getPendingUtterance() {
    return this.pending;
  }
}

const current = () => utteranceInstances[utteranceInstances.length - 1];

describe("VoiceOutput capability detection", () => {
  beforeEach(() => {
    utteranceInstances = [];
    delete window.speechSynthesis;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders disabled button when speechSynthesis is not supported", () => {
    render(<VoiceOutput text="Hello world" />);

    const button = screen.getByRole("button", { name: "Read response aloud" });
    expect(button).toBeDisabled();
    expect(button).toHaveAttribute("title", "Text-to-speech not supported in this browser");
  });

  it("does not trigger speak when button is disabled due to unsupported browser", () => {
    render(<VoiceOutput text="Hello world" />);

    const button = screen.getByRole("button", { name: "Read response aloud" });
    expect(button).toBeDisabled();

    // Clicking a disabled button doesn't fire onClick
    fireEvent.click(button);

    // No error alert should appear since speak() was never called
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("VoiceOutput speaking lifecycle", () => {
  let fakeSynthesis;

  beforeEach(() => {
    utteranceInstances = [];
    fakeSynthesis = new FakeSpeechSynthesis();
    window.speechSynthesis = fakeSynthesis;
    window.SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance;
  });

  afterEach(() => {
    // Let React cleanup effects run before deleting the mock
    vi.restoreAllMocks();
  });

  it("starts speaking and shows speaking state", () => {
    render(<VoiceOutput text="Hello world" />);

    const button = screen.getByRole("button", { name: "Read response aloud" });
    expect(button).not.toBeDisabled();

    fireEvent.click(button);

    expect(screen.getByRole("button", { name: "Pause reading" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stop reading" })).toBeInTheDocument();
  });

  it("pauses and resumes when toggle button is clicked", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    // Pause
    fireEvent.click(screen.getByRole("button", { name: "Pause reading" }));
    expect(screen.getByRole("button", { name: "Resume reading" })).toBeInTheDocument();
    expect(screen.getByText("paused")).toBeInTheDocument();

    // Resume
    fireEvent.click(screen.getByRole("button", { name: "Resume reading" }));
    expect(screen.getByRole("button", { name: "Pause reading" })).toBeInTheDocument();
    expect(screen.queryByText("paused")).not.toBeInTheDocument();
  });

  it("stops speaking when stop button is clicked", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));
    fireEvent.click(screen.getByRole("button", { name: "Stop reading" }));

    expect(screen.getByRole("button", { name: "Read response aloud" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Stop reading" })).not.toBeInTheDocument();
  });

  it("handles speech error and shows error state", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    act(() => utterance.onerror({ error: "network" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Speech error: network");
    expect(screen.getByRole("button", { name: "Read response aloud" })).toBeInTheDocument();
  });

  it("handles interrupted error gracefully without showing error", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    act(() => utterance.onerror({ error: "interrupted" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read response aloud" })).toBeInTheDocument();
  });

  it("handles canceled error gracefully without showing error", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    act(() => utterance.onerror({ error: "canceled" }));

    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Read response aloud" })).toBeInTheDocument();
  });

  it("returns to idle when speech ends naturally", () => {
    render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    act(() => utterance.onend());

    expect(screen.getByRole("button", { name: "Read response aloud" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Stop reading" })).not.toBeInTheDocument();
  });

  it("does not start if text is empty", () => {
    render(<VoiceOutput text="" />);

    const button = screen.getByRole("button", { name: "Read response aloud" });
    expect(button).toBeDisabled();
  });

  it("cancels previous speech when text changes while speaking", () => {
    const { rerender } = render(<VoiceOutput text="First message" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));
    const firstUtterance = current();
    const onErrorSpy = vi.fn();
    firstUtterance.onerror = onErrorSpy;

    rerender(<VoiceOutput text="Second message" />);

    expect(onErrorSpy).toHaveBeenCalledWith({ error: "canceled" });
  });

  it("strips markdown from text before speaking", () => {
    render(<VoiceOutput text="# Hello **world**" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    expect(utterance.text).toBe("Hello world");
  });
});

describe("VoiceOutput cleanup", () => {
  let fakeSynthesis;

  beforeEach(() => {
    utteranceInstances = [];
    fakeSynthesis = new FakeSpeechSynthesis();
    window.speechSynthesis = fakeSynthesis;
    window.SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("cancels speech on unmount while speaking", () => {
    const { unmount } = render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));
    expect(fakeSynthesis.speaking).toBe(true);

    unmount();

    expect(fakeSynthesis.speaking).toBe(false);
    expect(fakeSynthesis.pending).toBeNull();
  });

  it("cancels speech on unmount while paused", () => {
    const { unmount } = render(<VoiceOutput text="Hello world" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));
    fireEvent.click(screen.getByRole("button", { name: "Pause reading" }));
    expect(fakeSynthesis.paused).toBe(true);

    unmount();

    expect(fakeSynthesis.speaking).toBe(false);
    expect(fakeSynthesis.paused).toBe(false);
  });
});

describe("VoiceOutput props", () => {
  let fakeSynthesis;

  beforeEach(() => {
    utteranceInstances = [];
    fakeSynthesis = new FakeSpeechSynthesis();
    window.speechSynthesis = fakeSynthesis;
    window.SpeechSynthesisUtterance = FakeSpeechSynthesisUtterance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("uses provided lang prop", () => {
    render(<VoiceOutput text="Hello" lang="fr-FR" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    expect(utterance.lang).toBe("fr-FR");
  });

  it("falls back to navigator.language when lang not provided", () => {
    Object.defineProperty(navigator, "language", { value: "de-DE", configurable: true });
    render(<VoiceOutput text="Hello" />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    expect(utterance.lang).toBe("de-DE");
  });

  it("uses provided rate and pitch", () => {
    render(<VoiceOutput text="Hello" rate={1.5} pitch={0.8} />);

    fireEvent.click(screen.getByRole("button", { name: "Read response aloud" }));

    const utterance = current();
    expect(utterance.rate).toBe(1.5);
    expect(utterance.pitch).toBe(0.8);
  });

  it("disables button when speechSynthesis is not supported", () => {
    delete window.speechSynthesis;
    render(<VoiceOutput text="Hello" />);

    const button = screen.getByRole("button");
    expect(button).toBeDisabled();
  });
});