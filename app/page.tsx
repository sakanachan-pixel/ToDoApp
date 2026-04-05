"use client";

import { useState, useEffect, useRef } from "react";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
  createdAt: number;
};

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "done">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // localStorageから読み込み
  useEffect(() => {
    const saved = localStorage.getItem("todos");
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        // ignore
      }
    }
  }, []);

  // localStorageへ保存
  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      {
        id: crypto.randomUUID(),
        text,
        completed: false,
        createdAt: Date.now(),
      },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") addTodo();
  };

  const filtered = todos.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "done") return t.completed;
    return true;
  });

  const activeCount = todos.filter((t) => !t.completed).length;
  const doneCount = todos.filter((t) => t.completed).length;

  return (
    <main className="min-h-screen bg-[#f8f7f4] flex items-start justify-center px-4 pt-16 pb-16">
      <div className="w-full max-w-lg">
        {/* ヘッダー */}
        <div className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">
            ToDo
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            {activeCount === 0 && doneCount === 0
              ? "タスクを追加しましょう"
              : `${activeCount}件の未完了 · ${doneCount}件の完了`}
          </p>
        </div>

        {/* 入力フォーム */}
        <div className="flex gap-2 mb-8">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="新しいタスクを入力..."
            className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 placeholder-gray-300 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 transition-all"
          />
          <button
            onClick={addTodo}
            disabled={!input.trim()}
            className="bg-gray-900 text-white rounded-xl px-5 py-3 text-sm font-medium hover:bg-gray-700 disabled:opacity-30 disabled:cursor-not-allowed transition-all active:scale-95"
          >
            追加
          </button>
        </div>

        {/* フィルター */}
        {todos.length > 0 && (
          <div className="flex gap-1 mb-5 bg-white border border-gray-100 rounded-xl p-1 w-fit">
            {(
              [
                { key: "all", label: "すべて" },
                { key: "active", label: "未完了" },
                { key: "done", label: "完了" },
              ] as const
            ).map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filter === key
                    ? "bg-gray-900 text-white shadow-sm"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        )}

        {/* タスクリスト */}
        <div className="space-y-2">
          {filtered.length === 0 ? (
            <div className="text-center py-16 text-gray-300 text-sm">
              {filter === "done"
                ? "完了したタスクはありません"
                : filter === "active"
                ? "未完了のタスクはありません"
                : "タスクがありません"}
            </div>
          ) : (
            filtered.map((todo) => (
              <div
                key={todo.id}
                className={`group flex items-center gap-3 bg-white border rounded-xl px-4 py-3.5 transition-all ${
                  todo.completed
                    ? "border-gray-100 opacity-60"
                    : "border-gray-200 hover:border-gray-300 hover:shadow-sm"
                }`}
              >
                {/* チェックボックス */}
                <button
                  onClick={() => toggleTodo(todo.id)}
                  className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                    todo.completed
                      ? "bg-gray-900 border-gray-900"
                      : "border-gray-300 hover:border-gray-500"
                  }`}
                  aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
                >
                  {todo.completed && (
                    <svg
                      className="w-2.5 h-2.5 text-white"
                      fill="none"
                      viewBox="0 0 12 12"
                    >
                      <path
                        d="M2 6l3 3 5-5"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {/* テキスト */}
                <span
                  className={`flex-1 text-sm leading-relaxed transition-all ${
                    todo.completed
                      ? "line-through text-gray-400"
                      : "text-gray-700"
                  }`}
                >
                  {todo.text}
                </span>

                {/* 削除ボタン */}
                <button
                  onClick={() => deleteTodo(todo.id)}
                  className="flex-shrink-0 opacity-0 group-hover:opacity-100 text-gray-300 hover:text-red-400 transition-all p-1 rounded-lg hover:bg-red-50"
                  aria-label="削除"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 16 16"
                  >
                    <path
                      d="M4 4l8 8M12 4l-8 8"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {/* 完了タスクをまとめて削除 */}
        {doneCount > 0 && (
          <div className="mt-6 flex justify-end">
            <button
              onClick={() =>
                setTodos((prev) => prev.filter((t) => !t.completed))
              }
              className="text-xs text-gray-400 hover:text-red-400 transition-colors"
            >
              完了済みを削除 ({doneCount}件)
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
