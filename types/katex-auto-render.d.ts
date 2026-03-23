// types/katex-auto-render.d.ts
declare module 'katex/dist/contrib/auto-render' {
  // We are assuming that the actual types for renderMathInElement are correctly defined
  // by the @types/katex package, but just not discoverable for the specific import path.
  // This re-exports the default export from what @types/katex *does* provide for auto-render.
  const renderMathInElement: (element: HTMLElement, options?: any) => void;
  export default renderMathInElement;
}
