import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { api } from "@/lib/api";
import { cn } from "@/lib/utils";

interface ChatMsg {
  role: "user" | "bot";
  text: string;
}

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: "bot", text: "Привет! 👋 Помогу рассчитать стоимость уборки или ответить на вопросы. Чем могу помочь?" },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, typing]);

  const send = async () => {
    const text = input.trim();
    if (!text) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setTyping(true);

    try {
      const context = messages.map((m) => ({ role: m.role === "bot" ? "assistant" : "user", content: m.text }));
      const data = await api.sendChat(text, context);
      setMessages((prev) => [...prev, { role: "bot", text: data.reply }]);
    } catch {
      setMessages((prev) => [...prev, { role: "bot", text: "Извините, произошла ошибка. Попробуйте позже." }]);
    } finally {
      setTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      <div
        className={cn(
          "absolute bottom-16 right-0 w-80 max-h-[500px] rounded-2xl border bg-white shadow-2xl flex-col overflow-hidden transition-all duration-300",
          open ? "flex" : "hidden"
        )}
      >
        <div className="flex items-center gap-3 p-4 border-b bg-primary text-primary-foreground">
          <div className="h-9 w-9 rounded-full bg-white/20 flex items-center justify-center font-bold text-sm">CP</div>
          <div>
            <h3 className="font-semibold text-sm">CleanPro</h3>
            <p className="text-xs opacity-80">Онлайн · Ответит за минуту</p>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[200px] max-h-[320px]">
          {messages.map((m, i) => (
            <div
              key={i}
              className={cn(
                "max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed",
                m.role === "bot"
                  ? "bg-muted self-start rounded-bl-sm"
                  : "bg-primary text-primary-foreground self-end rounded-br-sm"
              )}
            >
              {m.text}
            </div>
          ))}
          {typing && (
            <div className="bg-muted self-start rounded-xl rounded-bl-sm px-3 py-2 flex gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:0ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:150ms]" />
              <span className="h-1.5 w-1.5 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:300ms]" />
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="flex items-center gap-2 p-3 border-t">
          <input
            className="flex-1 rounded-full border bg-background px-4 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
            placeholder="Напишите сообщение..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
          />
          <button
            onClick={send}
            className="h-9 w-9 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            <Send className="h-4 w-4" />
          </button>
        </div>
      </div>

      <button
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "h-14 w-14 rounded-full bg-primary text-primary-foreground flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105",
          open && "bg-destructive"
        )}
      >
        {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </button>
    </div>
  );
}
