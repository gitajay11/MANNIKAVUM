"use client";

import { AnimatePresence } from "framer-motion";
import { useCallback, useState } from "react";
import { submitMessage, submitResponse } from "@/lib/client";
import { SILENT_TYPES, type ResponseType } from "@/lib/responses";
import Apology from "./Apology";
import BackButton from "./BackButton";
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
  // Current step plus the trail behind it, so the back arrow can retrace.
  const [nav, setNav] = useState<{ step: Step; history: Step[] }>({
    step: "landing",
    history: [],
  });
  const { step, history } = nav;
  const [choice, setChoice] = useState<ResponseType | null>(null);

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const go = useCallback((next: Step) => {
    scrollTop();
    setNav((n) => ({ step: next, history: [...n.history, n.step] }));
  }, []);

  const back = useCallback(() => {
    scrollTop();
    setNav((n) =>
      n.history.length === 0
        ? n
        : { step: n.history[n.history.length - 1], history: n.history.slice(0, -1) },
    );
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
      <AnimatePresence>
        {history.length > 0 && <BackButton key="back" onClick={back} />}
      </AnimatePresence>
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
