import { createSlice } from "@reduxjs/toolkit";
import AuraPoints from "../../../components/AuraPoints";
//to store current state into localStorage
const loadState = () => {
  try {
    const serializedState = localStorage.getItem("userState");
    if (serializedState) {
      return JSON.parse(serializedState);
    }
  } catch (err) {
    console.error("Failed to load state from localStorage", err);
  }
  return {
    currentUser: null,
    loading: false,
    isAuthenticated: false,
    error: null,
  };
};

const initialState = loadState();

const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem("userState", serializedState);
  } catch (err) {
    console.error("Failed to save state to localStorage", err);
  }
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    loginInStart: (state) => {
      state.currentUser = null;
      state.loading = true;
      state.error = null;
    },
    loginInSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      saveState(state);
    },
    loginInFailure: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      saveState(state);
    },
    logOut: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.loading = false;
      state.error = null;
      saveState(state);
    },
    signUpStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signUpSuccess: (state, action) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.error = null;
      state.isAuthenticated = true;
      saveState(state);
    },
    signUpFailure: (state, action) => {
      state.currentUser = null;
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
      saveState(state);
    },
    updateAuraPoints: (state, action) => {
      if (state.currentUser) {
        state.currentUser.auraPoints = action.payload;
        saveState(state);
      }
    },
  },
});

export const {
  loginInFailure,
  loginInStart,
  loginInSuccess,
  signUpStart,
  signUpSuccess,
  signUpFailure,
  logOut,
  updateAuraPoints,
} = userSlice.actions;

export default userSlice.reducer;
