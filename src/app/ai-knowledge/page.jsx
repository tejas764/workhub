"use client";

import React, { useState } from "react";
import {
  Sparkles,
  FileText,
  Search,
  UploadCloud,
  Send,
  Bot,
  User,
  Download,
} from "lucide-react";

export default function AIKnowledgePage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [query, setQuery] = useState("");
  const [chatHistory, setChatHistory] = useState([
    {
      sender: "ai",
      text: "Hello! I am your WorkHub AI Assistant. I have indexed your department's documents, faculty guidelines, and course syllabi. How can I help you today?",
    },
  ]);

  const [documents] = useState([
    { id: 1, name: "CS101_Syllabus_2026.pdf", category: "Syllabus", uploadedBy: "Dr. Aris Thorne", date: "Jul 15, 2026", size: "2.4 MB" },
    { id: 2, name: "Faculty_Leave_Policy_v2.pdf", category: "Policy", uploadedBy: "HOD Office", date: "Jun 28, 2026", size: "1.1 MB" },
    { id: 3, name: "Department_Research_Guidelines.pdf", category: "Research", uploadedBy: "Prof. Elena Rostova", date: "Jul 02, 2026", size: "3.8 MB" },
    { id: 4, name: "MidSem_Exam_Schedule.xlsx", category: "Schedule", uploadedBy: "Dept. Coordinator", date: "Jul 20, 2026", size: "850 KB" },
  ]);

  const [docSearch, setDocSearch] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    const userMsg = { sender: "user", text: query };
    const aiMsg = {
      sender: "ai",
      text: `Based on your departmental documents, here is what I found regarding "${query}": The guidelines recommend submitting all relevant review materials 5 business days prior to the deadline.`,
    };

    setChatHistory((prev) => [...prev, userMsg, aiMsg]);
    setQuery("");
  };

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(docSearch.toLowerCase()) ||
      doc.category.toLowerCase().includes(docSearch.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Tab Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Sparkles className="w-6 h-6 text-indigo-500" /> AI Knowledge Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Query indexed department documents or manage knowledge repository files.
          </p>
        </div>

        <div className="p-1 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex text-xs font-semibold self-start sm:self-auto">
          <button
            onClick={() => setActiveTab("chat")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "chat"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <Bot className="w-4 h-4" /> AI Assistant Chat
          </button>
          <button
            onClick={() => setActiveTab("documents")}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
              activeTab === "documents"
                ? "bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-200"
            }`}
          >
            <FileText className="w-4 h-4" /> Document Repository ({documents.length})
          </button>
        </div>
      </div>

      {/* TAB 1: AI CHAT */}
      {activeTab === "chat" && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm flex flex-col h-[600px] overflow-hidden">
          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {chatHistory.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-3 max-w-2xl ${
                  msg.sender === "user" ? "ml-auto flex-row-reverse" : ""
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white"
                      : "bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400"
                  }`}
                >
                  {msg.sender === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs leading-relaxed ${
                    msg.sender === "user"
                      ? "bg-indigo-600 text-white rounded-tr-none"
                      : "bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/50 rounded-tl-none"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>

          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex gap-2"
          >
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Ask AI e.g. 'What is the leave policy deadline?'..."
              className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
            />
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md shadow-indigo-600/20"
            >
              <Send className="w-3.5 h-3.5" /> Send
            </button>
          </form>
        </div>
      )}

      {/* TAB 2: DOCUMENT REPOSITORY */}
      {activeTab === "documents" && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={docSearch}
                onChange={(e) => setDocSearch(e.target.value)}
                placeholder="Search files by name or category..."
                className="w-full pl-10 pr-4 py-2 rounded-xl text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
              />
            </div>

            <button className="w-full sm:w-auto px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-md shadow-indigo-600/20">
              <UploadCloud className="w-4 h-4" /> Upload Document
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="p-4">Document Name</th>
                    <th className="p-4">Category</th>
                    <th className="p-4">Uploaded By</th>
                    <th className="p-4">Date</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                  {filteredDocs.map((doc) => (
                    <tr key={doc.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="p-4 font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
                        <FileText className="w-4 h-4 text-indigo-500 shrink-0" />
                        <div>
                          {doc.name}
                          <span className="block text-[10px] text-slate-400 font-normal">{doc.size}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                          {doc.category}
                        </span>
                      </td>
                      <td className="p-4 text-slate-600 dark:text-slate-400">{doc.uploadedBy}</td>
                      <td className="p-4 text-slate-400">{doc.date}</td>
                      <td className="p-4 text-right">
                        <button className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:text-indigo-600 dark:hover:text-indigo-400 text-slate-500 transition-colors">
                          <Download className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}