"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { submitMessage, submitResponse } from "@/lib/client";
import { SILENT_TYPES, type ResponseType } from "@/lib/responses";
import Apology from "./Apology";
import Choice from "./Choice";
import Closing from "./Closing";
import FinalScreen from "./FinalScreen";
import Investigation from "./Investigation";
import Landing from "./Landing";
import MessageStep from "./MessageStep";
import Particles from "./Particles";
import ShouldHave from "./ShouldHave";
import SorryMeter from "./SorryMeter";

type Step =
  | "landing"
  | "investigation"
  | "apology"
  | "should-have"
  | "meter"
  | "choice"
  | "message"
  | "final"
  | "closing";

export default function Story() {
  const [step, setStep] = useState<Step>("landing");
  const [choice, setChoice] = useState<ResponseType | null>(null);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const go = useCallback((next: Step) => {
    scrollTop();
    setStep(next);
  }, []);

  // Recorded only here — after she explicitly taps a response button.
  const handleChoose = useCallback(
    async (type: ResponseType) => {
      await submitResponse(type);
      setChoice(type);
      go(SILENT_TYPES.has(type) ? "final" : "message");
    },
    [go],
  );

  const handleSend = useCallback(
    async (message: string) => {
      await submitMessage(message);
      go("final");
    },
    [go],
  );

  return (
    <main className="relative min-h-dvh">
      <Particles />
      <AnimatePresence mode="wait">
        {step === "landing" && (
          <Landing key="landing" onNext={() => go("investigation")} />
        )}
        {step === "investigation" && (
          <Investigation key="investigation" onNext={() => go("apology")} />
        )}
        {step === "apology" && (
          <Apology key="apology" onNext={() => go("should-have")} />
        )}
        {step === "should-have" && (
          <ShouldHave key="should-have" onNext={() => go("meter")} />
        )}
        {step === "meter" && (
          <SorryMeter key="meter" onNext={() => go("choice")} />
        )}
        {step === "choice" && <Choice key="choice" onChoose={handleChoose} />}
        {step === "message" && (
          <MessageStep
            key="message"
            onSend={handleSend}
            onSkip={() => go("final")}
          />
        )}
        {step === "final" && choice && (
          <FinalScreen key="final" type={choice} onNext={() => go("closing")} />
        )}
        {step === "closing" && <Closing key="closing" />}
      </AnimatePresence>
    </main>
  );
}
