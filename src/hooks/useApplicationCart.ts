"use client";
import { useState, useCallback, useEffect } from "react";
import { AIRecommendation } from "./useAIRecommendations";

export interface CartItem {
  recommendation: AIRecommendation;
  addedAt: string;
}

export const SERVICE_FEE = 199; // R199 flat — YOUR revenue per student
export const MAX_APPLICATIONS = 3;
const STORAGE_KEY = "pathfinder-application-cart";

function loadCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCart(items: CartItem[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

export function useApplicationCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setItems(loadCart());
  }, []);

  const addItem = useCallback((rec: AIRecommendation) => {
    setItems((prev) => {
      if (prev.length >= MAX_APPLICATIONS) return prev;
      if (prev.find((i) => i.recommendation.id === rec.id)) return prev;
      const next = [
        ...prev,
        { recommendation: rec, addedAt: new Date().toISOString() },
      ];
      saveCart(next);
      return next;
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.recommendation.id !== id);
      saveCart(next);
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    saveCart([]);
    setItems([]);
  }, []);

  const isInCart = useCallback(
    (id: string) => items.some((i) => i.recommendation.id === id),
    [items],
  );

  return { items, addItem, removeItem, clearCart, isInCart };
}
