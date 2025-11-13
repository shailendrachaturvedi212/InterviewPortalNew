// global.d.ts
export { }; // this makes it a module

declare global {
  interface Window {
    loadQuestions: (questions: string[]) => void;
  }
}
