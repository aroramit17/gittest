'use client';

import { createContext, useContext, useReducer, useCallback } from 'react';

/* ── State shape ──────────────────────────────────── */
const initialState = {
  // Effect selection
  selectedEffect: null,     // effect object from lib/effects.js
  activeCategory: 'all',
  searchQuery: '',

  // Code flow
  inputCode: '',            // raw Zenler HTML pasted by user
  outputCode: '',           // enhanced HTML returned by AI
  status: 'idle',           // idle | processing | success | error
  error: null,

  // Preview
  previewHtml: '',          // live-rendered HTML for the iframe

  // Modal
  modalOpen: false,

  // User
  userTier: 'free',         // free | pro
  usageCount: 0,
};

/* ── Actions ──────────────────────────────────────── */
const ActionTypes = {
  SELECT_EFFECT: 'SELECT_EFFECT',
  SET_CATEGORY: 'SET_CATEGORY',
  SET_SEARCH: 'SET_SEARCH',
  SET_INPUT_CODE: 'SET_INPUT_CODE',
  START_ENHANCE: 'START_ENHANCE',
  ENHANCE_SUCCESS: 'ENHANCE_SUCCESS',
  ENHANCE_ERROR: 'ENHANCE_ERROR',
  RESET_CODE: 'RESET_CODE',
  OPEN_MODAL: 'OPEN_MODAL',
  CLOSE_MODAL: 'CLOSE_MODAL',
  SET_USER_PROFILE: 'SET_USER_PROFILE',
  INCREMENT_USAGE: 'INCREMENT_USAGE',
};

function reducer(state, action) {
  switch (action.type) {
    case ActionTypes.SELECT_EFFECT:
      return {
        ...state,
        selectedEffect: action.payload,
        inputCode: '',
        outputCode: '',
        previewHtml: '',
        status: 'idle',
        error: null,
      };
    case ActionTypes.SET_CATEGORY:
      return { ...state, activeCategory: action.payload };
    case ActionTypes.SET_SEARCH:
      return { ...state, searchQuery: action.payload };
    case ActionTypes.SET_INPUT_CODE:
      return { ...state, inputCode: action.payload, status: 'idle', error: null };
    case ActionTypes.START_ENHANCE:
      return { ...state, status: 'processing', error: null, outputCode: '', previewHtml: '' };
    case ActionTypes.ENHANCE_SUCCESS:
      return {
        ...state,
        status: 'success',
        outputCode: action.payload,
        previewHtml: action.payload,
      };
    case ActionTypes.ENHANCE_ERROR:
      return { ...state, status: 'error', error: action.payload };
    case ActionTypes.RESET_CODE:
      return {
        ...state,
        inputCode: '',
        outputCode: '',
        previewHtml: '',
        status: 'idle',
        error: null,
      };
    case ActionTypes.OPEN_MODAL:
      return { ...state, modalOpen: true };
    case ActionTypes.CLOSE_MODAL:
      return {
        ...state,
        modalOpen: false,
        selectedEffect: null,
        inputCode: '',
        outputCode: '',
        previewHtml: '',
        status: 'idle',
        error: null,
      };
    case ActionTypes.SET_USER_PROFILE:
      return {
        ...state,
        userTier: action.payload.tier || 'free',
        usageCount: action.payload.usage_count || 0,
      };
    case ActionTypes.INCREMENT_USAGE:
      return { ...state, usageCount: state.usageCount + 1 };
    default:
      return state;
  }
}

/* ── Context ──────────────────────────────────────── */
const EnhanceContext = createContext(null);

export function EnhanceProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  /* ── Action creators ── */

  const selectEffect = useCallback((effect) => {
    dispatch({ type: ActionTypes.SELECT_EFFECT, payload: effect });
    dispatch({ type: ActionTypes.OPEN_MODAL });
  }, []);

  const setCategory = useCallback((cat) => {
    dispatch({ type: ActionTypes.SET_CATEGORY, payload: cat });
  }, []);

  const setSearch = useCallback((q) => {
    dispatch({ type: ActionTypes.SET_SEARCH, payload: q });
  }, []);

  const setInputCode = useCallback((code) => {
    dispatch({ type: ActionTypes.SET_INPUT_CODE, payload: code });
  }, []);

  const closeModal = useCallback(() => {
    dispatch({ type: ActionTypes.CLOSE_MODAL });
  }, []);

  const resetCode = useCallback(() => {
    dispatch({ type: ActionTypes.RESET_CODE });
  }, []);

  const setUserProfile = useCallback((profile) => {
    dispatch({ type: ActionTypes.SET_USER_PROFILE, payload: profile });
  }, []);

  /** Call /api/enhance — the core Code → AI → Preview action */
  const enhance = useCallback(async () => {
    if (!state.selectedEffect || !state.inputCode.trim()) return;

    dispatch({ type: ActionTypes.START_ENHANCE });

    try {
      const res = await fetch('/api/enhance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          effectId: state.selectedEffect.id,
          effectName: state.selectedEffect.name,
          effectDescription: state.selectedEffect.description,
          html: state.inputCode,
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || `Request failed (${res.status})`);
      }

      const data = await res.json();
      dispatch({ type: ActionTypes.ENHANCE_SUCCESS, payload: data.html });
      dispatch({ type: ActionTypes.INCREMENT_USAGE });
    } catch (err) {
      dispatch({ type: ActionTypes.ENHANCE_ERROR, payload: err.message });
    }
  }, [state.selectedEffect, state.inputCode]);

  const value = {
    ...state,
    selectEffect,
    setCategory,
    setSearch,
    setInputCode,
    enhance,
    resetCode,
    closeModal,
    setUserProfile,
  };

  return (
    <EnhanceContext.Provider value={value}>
      {children}
    </EnhanceContext.Provider>
  );
}

export function useEnhance() {
  const ctx = useContext(EnhanceContext);
  if (!ctx) throw new Error('useEnhance must be used within <EnhanceProvider>');
  return ctx;
}
