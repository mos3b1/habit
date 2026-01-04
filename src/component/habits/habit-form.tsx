// src/components/habits/habit-form.tsx (THEMED VERSION)

"use client";

import { useFormStatus } from "react-dom";
import { useState } from "react";
import type { Habit } from "@/lib/db/schema";
import { toast } from "sonner";

type HabitFormProps = {
  habit?: Habit;
  action: (formData: FormData) => Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  }>;
  onSuccess?: () => void;
};

const CATEGORIES = [
  { value: "health", label: "Health", emoji: "💪" },
  { value: "productivity", label: "Productivity", emoji: "⚡" },
  { value: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { value: "fitness", label: "Fitness", emoji: "🏃" },
  { value: "learning", label: "Learning", emoji: "📚" },
  { value: "other", label: "Other", emoji: "📌" },
] as const;

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#3b82f6", "#6b7280",
];

const ICONS = ["💪", "🏃", "📚", "🧘", "💧", "🥗", "😴", "✍️", "🎯", "⭐"];

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-primary text-primary-foreground py-3 px-4 rounded-xl font-medium
                 hover:bg-primary/90 transition-colors disabled:opacity-50 
                 disabled:cursor-not-allowed flex items-center justify-center gap-2"
    >
      {pending ? (
        <>
          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
              fill="none"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          {isEditing ? "Updating..." : "Creating..."}
        </>
      ) : (
        <>{isEditing ? "Update Habit" : "Create Habit"}</>
      )}
    </button>
  );
}

export function HabitForm({ habit, action, onSuccess }: HabitFormProps) {
  const isEditing = !!habit;
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || "");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");

  async function handleSubmit(formData: FormData) {
    formData.set("color", selectedColor);
    formData.set("icon", selectedIcon);

    const result = await action(formData);

    if (result.success) {
      setMessage(result.message);
      toast.success(result.success);
      setErrors({});
      onSuccess?.();
    } else {
      setMessage(result.message);
      toast.success(result.message);
      setErrors(result.errors || {});
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6 bg-card">
      {/* Success/Error Message */}
      {/* {message && (
        <div
          className={`p-4 rounded-lg ${
            errors && Object.keys(errors).length > 0
              ? "bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-900"
              : "bg-card dark:bg-card/55 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-900"
          }`}
        >
          {message}
        </div>
      )} */}

      {/* Habit Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
          Habit Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"
          defaultValue={habit?.name || ""}
          placeholder="e.g., Morning Run, Read 30 minutes"
          className={`w-full px-4 py-3 rounded-xl border bg-background text-foreground placeholder:text-muted-foreground ${
            errors.name ? "border-red-500" : "border-border"
          } focus:ring-2 focus:ring-ring focus:border-transparent`}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"
          defaultValue={habit?.description || ""}
          placeholder="Add details about your habit..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-ring focus:border-transparent resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="cursor-pointer">
              <input
                type="radio"
                name="category"
                value={category.value}
                defaultChecked={habit?.category === category.value || category.value === "other"}
                className="sr-only peer"
              />
              <div className="p-3 rounded-xl border border-border text-center peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors">
                <span className="text-xl">{category.emoji}</span>
                <p className="text-sm mt-1 text-">{category.label}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="frequency"
              value="daily"
              defaultChecked={habit?.frequency !== "weekly"}
              className="sr-only peer"
            />
            <div className="p-4 rounded-xl border border-border text-center peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors">
              <span className="text-2xl">📅</span>
              <p className="font-medium mt-1 text-foreground">Daily</p>
              <p className="text-sm text-muted-foreground">Every day</p>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="frequency"
              value="weekly"
              defaultChecked={habit?.frequency === "weekly"}
              className="sr-only peer"
            />
            <div className="p-4 rounded-xl border border-border text-center peer-checked:border-primary peer-checked:bg-primary/10 hover:bg-muted/50 transition-colors">
              <span className="text-2xl">📆</span>
              <p className="font-medium mt-1 text-foreground">Weekly</p>
              <p className="text-sm text-muted-foreground">Times per week</p>
            </div>
          </label>
        </div>
      </div>

      {/* Target Frequency */}
      <div>
        <label htmlFor="targetFrequency" className="block text-sm font-medium text-foreground mb-2">
          Target (times per day/week)
        </label>
        <input
          type="number"
          id="targetFrequency"
          name="targetFrequency"
          defaultValue={habit?.targetFrequency || 1}
          min={1}
          max={10}
          className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Color
        </label>
        <div className="flex flex-wrap gap-2">
          {COLORS.map((color) => (
            <button
              key={color}
              type="button"
              onClick={() => setSelectedColor(color)}
              className={`w-10 h-10 rounded-xl transition-transform ${
                selectedColor === color
                  ? "ring-2 ring-offset-2 ring-offset-background ring-primary scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Icon Picker */}
      <div>
        <label className="block text-sm font-medium text-foreground mb-2">
          Icon (optional)
        </label>
        <div className="flex flex-wrap gap-2">
          {ICONS.map((icon) => (
            <button
              key={icon}
              type="button"
              onClick={() => setSelectedIcon(selectedIcon === icon ? "" : icon)}
              className={`w-12 h-12 rounded-xl text-2xl border transition-all ${
                selectedIcon === icon
                  ? "border-primary bg-primary/10 scale-110"
                  : "border-border hover:bg-muted/50"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-muted/30 rounded-xl p-4 border border-border">
        <p className="text-sm text-muted-foreground mb-2">Preview</p>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${selectedColor}20` }}
          >
            {selectedIcon || "📌"}
          </div>
          <div>
            <p className="font-medium text-foreground">
              <span id="preview-name">Your Habit Name</span>
            </p>
            <p className="text-sm text-muted-foreground">🔥 0 day streak</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton isEditing={isEditing} />
    </form>
  );
}