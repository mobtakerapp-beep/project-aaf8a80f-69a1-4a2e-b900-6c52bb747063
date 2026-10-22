import { describe, expect, it } from "vitest";
import { locks } from "@/content";
import { shuffleLock } from "@/components/museum/quiz";

describe("Habout quiz correctness", () => {
  const answers = [
    "يؤدّيه الرجال بدون مصاحبة آلات موسيقية",
    "هبوت عسير",
    "عند إنجاز عمل جماعي مثل بناء السفن وغرف المياه من الآبار",
  ];
  answers.forEach((answer, index) => {
    it(`retains supplied correct answer for lock ${index + 1} after shuffling`, () => {
      const lock = locks[index];
      expect(lock).toBeDefined();
      if (!lock) throw new Error("Missing lock");
      expect(lock.options[lock.answer]).toBe(answer);
      const shuffled = shuffleLock(lock, () => 0);
      expect(shuffled.options[shuffled.answer]).toBe(answer);
      expect(shuffled.options).not.toEqual(lock.options);
      expect(new Set(shuffled.options)).toEqual(new Set(lock.options));
    });
  });
});