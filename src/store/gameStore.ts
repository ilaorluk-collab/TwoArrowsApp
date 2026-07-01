import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type {
  AppScreen,
  User,
  GamePhase,
  Participant,
  Room,
  GameAnswer,
  SelectionInfo,
  QuestionToAnswer,
  GroupAnswer,
} from './types/game';

interface GameStore {
  // ─── Hydration ────────────────────────────────────────────────────────────
  // Флаг: true когда Zustand восстановил состояние из AsyncStorage.
  // До этого момента _layout.tsx показывает экран загрузки (без глитча).
  _hasHydrated: boolean;
  setHasHydrated: (v: boolean) => void;

  // ─── Auth ─────────────────────────────────────────────────────────────────
  currentUser: User | null;
  token: string | null;
  refreshToken: string | null;

  // ─── Navigation ───────────────────────────────────────────────────────────
  screen: AppScreen;
  setScreen: (screen: AppScreen) => void;

  // ─── Game ─────────────────────────────────────────────────────────────────
  room: Room | null;
  participants: Participant[];
  phase: GamePhase;
  round: number;
  timer: number;

  currentQuestion: { id: number; text: string; round_number: number } | null;
  questionsToAnswer: QuestionToAnswer[];
  currentAnswerIndex: number;
  answers: GameAnswer[];
  groupAnswers: GroupAnswer[];
  matches: SelectionInfo[];
  selectedUserIds: number[];
  answeredUserIds: number[];
  answeredCount: number;
  myAnswer: string | null;

  canSelect: boolean;
  canAnswer: boolean;

  lastSeenMatchId: number;
  unreadMatchesCount: number;

  // ─── Actions ──────────────────────────────────────────────────────────────
  setTokens: (access: string, refresh: string) => void;
  setCurrentUser: (user: User) => void;
  setRoom: (room: Room) => void;
  setParticipants: (participants: Participant[]) => void;
  setPhase: (phase: GamePhase) => void;
  setRound: (round: number) => void;
  setCurrentQuestion: (q: { id: number; text: string; round_number: number } | null) => void;
  setQuestionsToAnswer: (q: QuestionToAnswer[]) => void;
  setCurrentAnswerIndex: (i: number) => void;
  setAnswers: (answers: GameAnswer[]) => void;
  setGroupAnswers: (groupAnswers: GroupAnswer[]) => void;
  setMatches: (matches: SelectionInfo[]) => void;
  setSelectedUserIds: (ids: number[]) => void;
  setAnsweredUserIds: (ids: number[]) => void;
  addAnsweredUserId: (id: number) => void;
  setAnsweredCount: (count: number) => void;
  setMyAnswer: (text: string | null) => void;
  setCanSelect: (v: boolean) => void;
  setCanAnswer: (v: boolean) => void;
  tick: () => void;
  setTimer: (seconds: number) => void;
  resetTimer: () => void;
  setLastSeenMatchId: (id: number) => void;
  setUnreadMatchesCount: (count: number) => void;
  reset: () => void;
  logout: () => void;
}

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      // ─── Hydration ────────────────────────────────────────────────────────
      _hasHydrated: false,
      setHasHydrated: (v) => set({ _hasHydrated: v }),

      // ─── Auth ─────────────────────────────────────────────────────────────
      currentUser: null,
      token: null,
      refreshToken: null,

      // ─── Navigation ───────────────────────────────────────────────────────
      screen: 'AUTH',
      setScreen: (screen) => set({ screen }),

      // ─── Game ─────────────────────────────────────────────────────────────
      room: null,
      participants: [],
      phase: 'waiting',
      round: 1,
      timer: 90,

      currentQuestion: null,
      questionsToAnswer: [],
      currentAnswerIndex: 0,
      answers: [],
      groupAnswers: [],
      matches: [],
      selectedUserIds: [],
      answeredUserIds: [],
      answeredCount: 0,
      myAnswer: null,

      canSelect: false,
      canAnswer: false,

      lastSeenMatchId: 0,
      unreadMatchesCount: 0,

      // ─── Actions ──────────────────────────────────────────────────────────
      setTokens: (access, refresh) => {
        // persist сам сохранит в AsyncStorage через partialize
        set({ token: access, refreshToken: refresh });
      },
      setCurrentUser: (currentUser) => set({ currentUser }),
      setRoom: (room) => set({ room }),
      setParticipants: (participants) => set({ participants }),
      setPhase: (phase) => set({ phase }),
      setRound: (round) => set({ round }),
      setCurrentQuestion: (currentQuestion) => set({ currentQuestion }),
      setQuestionsToAnswer: (questionsToAnswer) => set({ questionsToAnswer }),
      setCurrentAnswerIndex: (currentAnswerIndex) => set({ currentAnswerIndex }),
      setAnswers: (answers) => set({ answers }),
      setGroupAnswers: (groupAnswers) => set({ groupAnswers }),
      setMatches: (matches) => set({ matches }),
      setSelectedUserIds: (selectedUserIds) => set({ selectedUserIds }),
      setAnsweredUserIds: (answeredUserIds) => set({ answeredUserIds }),
      addAnsweredUserId: (id) =>
        set((s) => ({
          answeredUserIds: s.answeredUserIds.includes(id)
            ? s.answeredUserIds
            : [...s.answeredUserIds, id],
        })),
      setAnsweredCount: (answeredCount) => set({ answeredCount }),
      setMyAnswer: (myAnswer) => set({ myAnswer }),
      setCanSelect: (canSelect) => set({ canSelect }),
      setCanAnswer: (canAnswer) => set({ canAnswer }),

      tick: () => {
        const { timer } = get();
        if (timer > 0) set({ timer: timer - 1 });
      },
      setTimer: (timer) => set({ timer }),
      resetTimer: () => set({ timer: 90 }),
      setLastSeenMatchId: (id) => set({ lastSeenMatchId: id }),
      setUnreadMatchesCount: (count) => set({ unreadMatchesCount: count }),

      logout: () => {
        set({
          currentUser: null,
          token: null,
          refreshToken: null,
          screen: 'AUTH',
          room: null,
          participants: [],
          phase: 'waiting',
          round: 1,
          timer: 90,
          currentQuestion: null,
          questionsToAnswer: [],
          currentAnswerIndex: 0,
          answers: [],
          matches: [],
          selectedUserIds: [],
          answeredUserIds: [],
          answeredCount: 0,
          myAnswer: null,
          canSelect: false,
          canAnswer: false,
          lastSeenMatchId: 0,
          unreadMatchesCount: 0,
        });
      },

      reset: () =>
        set({
          room: null,
          participants: [],
          phase: 'waiting',
          round: 1,
          timer: 90,
          currentQuestion: null,
          questionsToAnswer: [],
          currentAnswerIndex: 0,
          answers: [],
          matches: [],
          selectedUserIds: [],
          answeredUserIds: [],
          answeredCount: 0,
          myAnswer: null,
          canSelect: false,
          canAnswer: false,
        }),
    }),
    {
      name: 'cupid-game-storage',
      // AsyncStorage вместо localStorage — работает в React Native
      storage: createJSONStorage(() => AsyncStorage),
      // Что персистим (токены + экран + игровые данные)
      partialize: (state) => ({
        token: state.token,
        refreshToken: state.refreshToken,
        currentUser: state.currentUser,
        screen: state.screen,
        room: state.room,
        participants: state.participants,
        phase: state.phase,
        round: state.round,
        timer: state.timer,
        currentQuestion: state.currentQuestion,
        questionsToAnswer: state.questionsToAnswer,
        currentAnswerIndex: state.currentAnswerIndex,
        answers: state.answers,
        matches: state.matches,
        selectedUserIds: state.selectedUserIds,
        answeredUserIds: state.answeredUserIds,
        answeredCount: state.answeredCount,
        myAnswer: state.myAnswer,
        canSelect: state.canSelect,
        canAnswer: state.canAnswer,
        lastSeenMatchId: state.lastSeenMatchId,
      }),
      // Вызывается когда AsyncStorage отдал данные и Zustand их применил
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
    },
  ),
);
