import { motion } from "framer-motion";
import {
  ArrowUp,
  BrainCircuit,
  MessageSquareText,
  X,
} from "lucide-react";
import { useState } from "react";

interface Props {
  onClose: () => void;
}

interface Message {
  id: number;
  role: "assistant" | "user";
  content: string;
}

export default function AIAssistantPanel({
  onClose,
}: Props) {
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "I can answer questions using production context such as incidents, services, logs, metrics and deployments.",
    },
  ]);

  function sendMessage() {
    const value = input.trim();

    if (!value) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        id: Date.now(),
        role: "user",
        content: value,
      },
    ]);

    setInput("");
  }

  return (
    <motion.div
      className="workspace-overlay justify-end"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        initial={{ x: 50, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 50, opacity: 0 }}
        className="workspace-panel h-[92vh] w-full max-w-155"
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
            <div className="flex items-center gap-3">
              <div className="grid h-8 w-8 place-items-center rounded-lg border border-emerald-400/15 bg-emerald-400/5 text-emerald-300">
                <BrainCircuit size={16} />
              </div>

              <div>
                <p className="text-xs font-semibold text-white/80">
                  AI Assistant
                </p>

                <p className="text-[9px] text-white/25">
                  Production context enabled
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="grid h-8 w-8 place-items-center rounded-lg text-white/30 hover:bg-white/4 hover:text-white/70"
            >
              <X size={17} />
            </button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={
                    message.role === "user"
                      ? "ml-8 rounded-xl border border-emerald-400/10 bg-emerald-400/[0.035] p-4"
                      : "mr-8 rounded-xl border border-white/6 bg-white/1.5 p-4"
                  }
                >
                  <div className="flex gap-3">
                    {message.role === "assistant" && (
                      <MessageSquareText
                        size={15}
                        className="mt-0.5 shrink-0 text-emerald-300"
                      />
                    )}

                    <p className="text-xs leading-6 text-white/55">
                      {message.content}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/[0.07] p-4">
            <div className="flex items-end gap-2 rounded-xl border border-white/8 bg-black/20 p-2">
              <textarea
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about production..."
                rows={2}
                className="min-h-13 flex-1 resize-none bg-transparent px-2 py-1 text-xs leading-5 text-white/75 outline-none placeholder:text-white/20"
              />

              <button
                onClick={sendMessage}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-400 text-[#032118] transition hover:bg-emerald-300"
              >
                <ArrowUp size={16} />
              </button>
            </div>

            <p className="mt-2 text-center text-[9px] text-white/20">
              AI responses will be grounded in production data when the backend is connected.
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}