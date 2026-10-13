import React, { useState, useEffect, useRef } from 'react';
import { useFaculty } from '../../context/FacultyContext';
import {
  Sparkles,
  X,
  Send,
  RefreshCw,
  Copy,
  Check,
  Brain,
  Layers,
  ChevronRight,
  Bot,
  User
} from 'lucide-react';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const CopilotDrawer: React.FC = () => {
  const {
    isCopilotOpen,
    setIsCopilotOpen,
    activeSection,
    copilotInitialPrompt,
    apiKey
  } = useFaculty();

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-01',
      sender: 'assistant',
      text: `Hello Professor! I am your AI Faculty Pedagogical Copilot for **${activeSection.code}: ${activeSection.title}**.

I have real-time access to your section's Bloom's cognitive taxonomy mastery, attendance curves, student risk dossiers, and grading rubrics.

How can I assist you with your curriculum, rubric design, or student retention today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isCopilotOpen]);

  // Handle external initial prompt if provided
  useEffect(() => {
    if (copilotInitialPrompt && isCopilotOpen) {
      sendMessage(copilotInitialPrompt);
    }
  }, [copilotInitialPrompt, isCopilotOpen]);

  const sendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const sectionContext = `Course: ${activeSection.title} (${activeSection.code})
Enrolled: ${activeSection.totalEnrolled} students
Average Grade: ${activeSection.averageGrade}%
Attendance Rate: ${activeSection.attendanceAvg}%
Critical Risk Students: ${activeSection.retentionRiskCount.critical}
Primary Friction Topics: ${activeSection.topics.filter(t => t.frictionScore > 60).map(t => `${t.name} (Friction ${t.frictionScore}/100)`).join(', ')}`;

      const response = await fetch('/api/gemini/copilot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-gemini-api-key': apiKey || '',
        },
        body: JSON.stringify({
          prompt: textToSend,
          context: sectionContext,
        }),
      });

      const data = await response.json();
      const assistantMsg: ChatMessage = {
        id: `ast-${Date.now()}`,
        sender: 'assistant',
        text: data.text || 'Pedagogical analysis complete.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error('Copilot query error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'I encountered an issue processing the query with the faculty engine. Please verify the Gemini API key in settings or retry.',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  if (!isCopilotOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-slate-900 border-l border-slate-800 shadow-2xl flex flex-col">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white shadow-sm shadow-indigo-600/30">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-bold text-white flex items-center gap-2">
              Faculty AI Copilot
              <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/60 font-mono">
                gemini-3.8
              </span>
            </h2>
            <p className="text-[11px] text-slate-400 truncate max-w-[260px]">
              Grounded in {activeSection.code} Telemetry
            </p>
          </div>
        </div>

        <button
          onClick={() => setIsCopilotOpen(false)}
          className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Suggested Quick Prompts */}
      <div className="p-3 bg-slate-950/60 border-b border-slate-800/80">
        <div className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-1.5">
          Suggested Faculty Prompts:
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-[11px]">
          {[
            'Active Learning for DP',
            'Midterm Review Questions',
            'Explain Drop-off in Week 5',
            'Draft Rubric for Project 2',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => sendMessage(prompt)}
              className="px-2.5 py-1 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-300 whitespace-nowrap transition-colors border border-slate-700/60"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 text-xs ${isUser ? 'justify-end' : 'justify-start'}`}
            >
              {!isUser && (
                <div className="w-7 h-7 rounded-lg bg-indigo-950 border border-indigo-800/60 flex items-center justify-center text-indigo-400 shrink-0">
                  <Bot className="w-3.5 h-3.5" />
                </div>
              )}

              <div
                className={`max-w-[85%] rounded-xl p-3.5 space-y-2 relative group leading-relaxed ${
                  isUser
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'bg-slate-950 border border-slate-800 text-slate-200'
                }`}
              >
                <div className="whitespace-pre-wrap font-sans">{msg.text}</div>

                <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-800/40">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <button
                      onClick={() => handleCopyText(msg.id, msg.text)}
                      className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
                      title="Copy message"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {isUser && (
                <div className="w-7 h-7 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300 shrink-0">
                  <User className="w-3.5 h-3.5" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-indigo-300 bg-indigo-950/30 border border-indigo-800/40 p-3 rounded-xl">
            <RefreshCw className="w-3.5 h-3.5 animate-spin text-indigo-400" />
            <span>Consulting pedagogical models & section telemetry...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage(input);
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask Copilot about teaching, grading, or students..."
            className="flex-1 bg-slate-900 border border-slate-800 focus:border-indigo-500 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors disabled:opacity-40"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
