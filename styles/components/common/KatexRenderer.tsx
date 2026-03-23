'use client';

import React, { useEffect, useRef } from 'react';
// import katex from 'katex';
// Import the auto-render extension
import renderMathInElement from 'katex/dist/contrib/auto-render';

// Note: KaTeX CSS is imported globally in app/globals.css

type KatexRendererProps = {
  textWithMath: string; // Prop name changed for clarity
  className?: string;
};

const KatexRenderer: React.FC<KatexRendererProps> = ({ textWithMath, className }) => {
  const containerRef = useRef<HTMLDivElement>(null); // Changed to div for better block display

  useEffect(() => {
    const currentContainer = containerRef.current;
    if (currentContainer) {
      // Set the raw text content that includes math expressions
      currentContainer.textContent = textWithMath;

      try {
        renderMathInElement(currentContainer, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false },
            { left: '\\(', right: '\\)', display: false }, // Escaped for JS string
            { left: '\\\[', right: '\\\]', display: true }  // Escaped for JS string
          ],
          throwOnError: false, // Errors will be displayed as raw LaTeX
        });
      } catch (error) {
        console.error('KaTeX auto-rendering error:', error);
        // Fallback if renderMathInElement itself throws an unexpected error
        currentContainer.textContent = `Error rendering math: ${textWithMath}`;
        currentContainer.style.color = 'red';
      }
    }
  }, [textWithMath]);

  // Using a div allows for block content and better structure for prose
  // Using a div with whitespace-pre-line preserves line breaks while wrapping text
  return <div ref={containerRef} className={`whitespace-pre-line ${className || ''}`} />;
};

export default KatexRenderer;
