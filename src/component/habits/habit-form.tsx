// src/components/habits/habit-form.tsx

"use client";

/**
 * "use client" because this form needs:
 * - useState for form state
 * - useFormStatus for loading states
 * - Interactive elements (color picker, etc.)
 */

import { useFormStatus } from "react-dom";
import { useState } from "react";
import type { Habit } from "@/lib/db/schema";

// ============================================================
// TYPES
// ============================================================

type HabitFormProps = {
  habit?: Habit; // type from DB schema
  //action is function that takes formData and returns ActionResponse
  action: (
    formData: FormData
  ) => Promise<{
    success: boolean;
    message: string;
    errors?: Record<string, string[]>;
  }>;
  onSuccess?: () => void;//callback on successful submission can be function or undefined
};

// ============================================================
// CONSTANTS
// ============================================================

/**
 * Available categories with labels and emojis
 */
const CATEGORIES = [
  { value: "health", label: "Health", emoji: "💪" },
  { value: "productivity", label: "Productivity", emoji: "⚡" },
  { value: "mindfulness", label: "Mindfulness", emoji: "🧘" },
  { value: "fitness", label: "Fitness", emoji: "🏃" },
  { value: "learning", label: "Learning", emoji: "📚" },
  { value: "other", label: "Other", emoji: "📌" },
] as const;

/**
 * Available colors for habits
 */
const COLORS = [
  "#6366f1", // Indigo
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#ef4444", // Red
  "#f97316", // Orange
  "#eab308", // Yellow
  "#22c55e", // Green
  "#14b8a6", // Teal
  "#3b82f6", // Blue
  "#6b7280", // Gray
];

/**
 * Common habit icons
 */
const ICONS = ["💪", "🏃", "📚", "🧘", "💧", "🥗", "😴", "✍️", "🎯", "⭐"];

// ============================================================
// SUBMIT BUTTON (with loading state)
// ============================================================

/**
 * Submit Button Component
 *
 * useFormStatus gives us pending state automatically!
 * No need to manage loading state manually.
 */
function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();//true if form is being submitted

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full bg-indigo-600 text-white py-3 px-4 rounded-xl font-medium
                 hover:bg-indigo-700 transition-colors disabled:opacity-50 
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

// ============================================================
// MAIN FORM COMPONENT
// ============================================================

export function HabitForm({ habit, action, onSuccess }: HabitFormProps) {
  const isEditing = !!habit; //are we editing an existing habit?

  // Form state
  const [selectedColor, setSelectedColor] = useState(habit?.color || COLORS[0]);
  const [selectedIcon, setSelectedIcon] = useState(habit?.icon || "");
  const [errors, setErrors] = useState<Record<string, string[]>>({});
  const [message, setMessage] = useState("");


  //this formData is automatically provided by the browser when the form is submitted
  async function handleSubmit(formData: FormData) {
    // Add color and icon to form data
    formData.set("color", selectedColor);//add selected color to form data
    formData.set("icon", selectedIcon);//add selected icon to form data

    // Call the provided action like createHabit or updateHabit

    const result = await action(formData);

    if (result.success) {
      setMessage(result.message);
      setErrors({});
      onSuccess?.();
    } else {
      setMessage(result.message);
      setErrors(result.errors || {});
    }
  }

  return (
    <form action={handleSubmit} className="space-y-6">
      {/* Success/Error Message */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            errors && Object.keys(errors).length > 0
              ? "bg-red-50 text-red-700 border border-red-200"
              : "bg-green-50 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      {/* Habit Name */}
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Habit Name *
        </label>
        <input
          type="text"
          id="name"
          name="name"//this mean is automatically included in formData
          defaultValue={habit?.name || ""}
          placeholder="e.g., Morning Run, Read 30 minutes"
          className={`w-full px-4 py-3 rounded-xl border ${
            errors.name ? "border-red-500" : "border-gray-200"
          } focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-500">{errors.name[0]}</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Description (optional)
        </label>
        <textarea
          id="description"
          name="description"//this mean is automatically included in formData
          defaultValue={habit?.description || ""}
          placeholder="Add details about your habit..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Category
        </label>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((category) => (
            <label key={category.value} className="cursor-pointer">
              <input
                type="radio"
                name="category"//this mean is automatically included in formData
                value={category.value}
                defaultChecked={
                  habit?.category === category.value ||
                  category.value === "other"
                }
                className="sr-only peer"
              />
              <div
                className="p-3 rounded-xl border border-gray-200 text-center 
                            peer-checked:border-indigo-500 peer-checked:bg-indigo-50
                            hover:bg-gray-50 transition-colors"
              >
                <span className="text-xl">{category.emoji}</span>
                <p className="text-sm mt-1">{category.label}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Frequency */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Frequency
        </label>
        <div className="grid grid-cols-2 gap-4">
          <label className="cursor-pointer">
            <input
              type="radio"
              name="frequency"//this mean is automatically included in formData
              value="daily"
              defaultChecked={habit?.frequency !== "weekly"}
              className="sr-only peer"
            />
            <div
              className="p-4 rounded-xl border border-gray-200 text-center
                          peer-checked:border-indigo-500 peer-checked:bg-indigo-50
                          hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📅</span>
              <p className="font-medium mt-1">Daily</p>
              <p className="text-sm text-gray-500">Every day</p>
            </div>
          </label>
          <label className="cursor-pointer">
            <input
              type="radio"
              name="frequency"//this mean is automatically included in formData
              value="weekly"
              defaultChecked={habit?.frequency === "weekly"}
              className="sr-only peer"
            />
            <div
              className="p-4 rounded-xl border border-gray-200 text-center
                          peer-checked:border-indigo-500 peer-checked:bg-indigo-50
                          hover:bg-gray-50 transition-colors"
            >
              <span className="text-2xl">📆</span>
              <p className="font-medium mt-1">Weekly</p>
              <p className="text-sm text-gray-500">Times per week</p>
            </div>
          </label>
        </div>
      </div>

      {/* Target Frequency */}
      <div>
        <label
          htmlFor="targetFrequency"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          Target (times per day/week)
        </label>
        <input
          type="number"
          id="targetFrequency"
          name="targetFrequency"
          defaultValue={habit?.targetFrequency || 1}
          min={1}
          max={10}
          className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
        />
      </div>

      {/* Color Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  ? "ring-2 ring-offset-2 ring-indigo-500 scale-110"
                  : ""
              }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Icon Picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
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
                  ? "border-indigo-500 bg-indigo-50 scale-110"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {icon}
            </button>
          ))}
        </div>
      </div>

      {/* Preview */}
      <div className="bg-gray-50 rounded-xl p-4">
        <p className="text-sm text-gray-500 mb-2">Preview</p>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
            style={{ backgroundColor: `${selectedColor}20` }}
          >
            {selectedIcon || "📌"}
          </div>
          <div>
            <p className="font-medium">
              {/* Show habit name or placeholder */}
              <span id="preview-name">Your Habit Name</span>
            </p>
            <p className="text-sm text-gray-500">🔥 0 day streak</p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <SubmitButton isEditing={isEditing} />
    </form>
  );
}
