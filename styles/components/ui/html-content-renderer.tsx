"use client";

import { useEffect, useRef, useState } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

interface HtmlContentRendererProps {
  content: string;
  className?: string;
}

export function HtmlContentRenderer({ content, className = '' }: HtmlContentRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (contentRef.current) {
      // Debug: Log the content to see what we're working with
      console.log('Rendering blog content:', content.substring(0, 500) + '...');

      // Render KaTeX for mathematical expressions
      const mathElements = contentRef.current.querySelectorAll('[data-lexical-math]');
      mathElements.forEach((element) => {
        const mathText = element.textContent || '';
        const isDisplayMode = element.hasAttribute('data-lexical-math-display');
        
        try {
          katex.render(mathText, element as HTMLElement, {
            throwOnError: false,
            displayMode: isDisplayMode,
          });
        } catch (error) {
          console.warn('KaTeX rendering error:', error);
        }
      });

      // Enhanced image handling
      const images = contentRef.current.querySelectorAll('img');
      console.log(`Found ${images.length} images in content`);
      
      images.forEach((img, index) => {
        console.log(`Image ${index + 1}:`, {
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        });

        // Add comprehensive styling
        img.classList.add(
          'max-w-full', 
          'h-auto', 
          'rounded-lg', 
          'shadow-lg',
          'mx-auto',
          'my-6',
          'block',
          'transition-transform',
          'duration-300',
          'hover:scale-105',
          'cursor-pointer'
        );

        // Add loading="lazy" for performance
        img.setAttribute('loading', 'lazy');

        // Add better error handling
        img.onerror = () => {
          console.error(`Failed to load image: ${img.src}`);
          setImageErrors(prev => new Set([...prev, img.src]));
          
          // Create a placeholder for broken images
          const placeholder = document.createElement('div');
          placeholder.className = 'flex items-center justify-center w-full h-48 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg my-6';
          placeholder.innerHTML = `
            <div class="text-center text-gray-500">
              <svg class="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <p class="text-sm">Image failed to load</p>
              <p class="text-xs text-gray-400 mt-1">Source: ${img.src.substring(0, 50)}...</p>
            </div>
          `;
          img.parentNode?.replaceChild(placeholder, img);
        };

        // Add click handler for image modal/zoom
        img.onclick = () => {
          openImageModal(img.src, img.alt || 'Blog image');
        };

        // Ensure the image has proper alt text
        if (!img.alt || img.alt.trim() === '') {
          img.alt = 'Blog content image';
        }
      });

      // Handle external links
      const links = contentRef.current.querySelectorAll('a[href^="http"]');
      links.forEach((link) => {
        link.setAttribute('target', '_blank');
        link.setAttribute('rel', 'noopener noreferrer');
        link.classList.add('text-primary', 'hover:underline', 'font-medium');
      });

      // Style code blocks
      const codeBlocks = contentRef.current.querySelectorAll('pre code');
      codeBlocks.forEach((block) => {
        block.classList.add('hljs');
        const pre = block.parentElement;
        if (pre) {
          pre.classList.add(
            'bg-gray-900',
            'text-gray-100',
            'p-4',
            'rounded-lg',
            'overflow-x-auto',
            'my-4',
            'border'
          );
        }
      });

      // Style inline code
      const inlineCodes = contentRef.current.querySelectorAll('code:not(pre code)');
      inlineCodes.forEach((code) => {
        code.classList.add(
          'bg-gray-100',
          'dark:bg-gray-800',
          'px-2',
          'py-1',
          'rounded',
          'text-sm',
          'font-mono',
          'text-gray-800',
          'dark:text-gray-200'
        );
      });

      // Style tables
      const tables = contentRef.current.querySelectorAll('table');
      tables.forEach((table) => {
        // Wrap table in a responsive container
        const wrapper = document.createElement('div');
        wrapper.className = 'overflow-x-auto my-6';
        table.parentNode?.insertBefore(wrapper, table);
        wrapper.appendChild(table);

        table.classList.add(
          'min-w-full', 
          'divide-y', 
          'divide-gray-200', 
          'dark:divide-gray-700',
          'border', 
          'border-gray-200', 
          'dark:border-gray-700', 
          'rounded-lg',
          'shadow-sm'
        );
        
        // Style headers
        const headers = table.querySelectorAll('th');
        headers.forEach((th) => {
          th.classList.add(
            'px-6', 'py-3', 'text-left', 'text-xs', 'font-medium', 
            'text-gray-500', 'dark:text-gray-400', 'uppercase', 
            'tracking-wider', 'bg-gray-50', 'dark:bg-gray-800'
          );
        });

        // Style cells
        const cells = table.querySelectorAll('td');
        cells.forEach((td) => {
          td.classList.add(
            'px-6', 'py-4', 'text-sm', 'text-gray-900', 'dark:text-gray-100'
          );
        });
      });

      // Style blockquotes
      const blockquotes = contentRef.current.querySelectorAll('blockquote');
      blockquotes.forEach((quote) => {
        quote.classList.add(
          'border-l-4', 'border-blue-500', 'pl-6', 'py-4', 'my-6',
          'bg-blue-50', 'dark:bg-blue-900/20', 'italic', 
          'text-gray-700', 'dark:text-gray-300', 'rounded-r-lg'
        );
      });

      // Style lists
      const lists = contentRef.current.querySelectorAll('ul, ol');
      lists.forEach((list) => {
        list.classList.add('space-y-2', 'ml-6', 'my-4');
        
        const listItems = list.querySelectorAll('li');
        listItems.forEach((li) => {
          li.classList.add('leading-relaxed', 'text-gray-700', 'dark:text-gray-300');
        });
      });

      // Style headings
      const headings = contentRef.current.querySelectorAll('h1, h2, h3, h4, h5, h6');
      headings.forEach((heading) => {
        heading.classList.add('font-bold', 'text-gray-900', 'dark:text-gray-100', 'mt-8', 'mb-4', 'leading-tight');
        
        // Add specific sizes
        if (heading.tagName === 'H1') {
          heading.classList.add('text-4xl');
        } else if (heading.tagName === 'H2') {
          heading.classList.add('text-3xl');
        } else if (heading.tagName === 'H3') {
          heading.classList.add('text-2xl');
        } else if (heading.tagName === 'H4') {
          heading.classList.add('text-xl');
        }
      });

      // Style paragraphs
      const paragraphs = contentRef.current.querySelectorAll('p');
      paragraphs.forEach((p) => {
        p.classList.add('leading-relaxed', 'text-gray-700', 'dark:text-gray-300', 'mb-4');
      });
    }
  }, [content]);

  // Function to open image in modal
  const openImageModal = (src: string, alt: string) => {
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4';
    modal.onclick = () => modal.remove();
    
    const img = document.createElement('img');
    img.src = src;
    img.alt = alt;
    img.className = 'max-w-full max-h-full object-contain rounded-lg shadow-2xl';
    
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '✕';
    closeButton.className = 'absolute top-4 right-4 text-white text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center hover:bg-opacity-75 transition-all';
    closeButton.onclick = (e) => {
      e.stopPropagation();
      modal.remove();
    };
    
    modal.appendChild(img);
    modal.appendChild(closeButton);
    document.body.appendChild(modal);
  };

  return (
    <div>
      {/* Debug information (remove in production) */}
      {process.env.NODE_ENV === 'development' && imageErrors.size > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <h4 className="text-red-800 font-medium mb-2">⚠️ Image Loading Issues Detected:</h4>
          <ul className="text-red-700 text-sm space-y-1">
            {Array.from(imageErrors).map((url, index) => (
              <li key={index} className="break-all">
                • {url}
              </li>
            ))}
          </ul>
          <p className="text-red-600 text-xs mt-2">
            Check if the S3 URLs are accessible and properly configured.
          </p>
        </div>
      )}

      <div
        ref={contentRef}
        className={`prose prose-lg max-w-none dark:prose-invert 
          prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-gray-100 
          prose-p:leading-relaxed prose-p:text-gray-700 dark:prose-p:text-gray-300 
          prose-a:text-primary prose-a:no-underline hover:prose-a:underline
          prose-img:rounded-xl prose-img:shadow-lg prose-img:mx-auto
          prose-code:bg-gray-100 prose-code:px-2 prose-code:py-1 prose-code:rounded
          prose-pre:bg-gray-900 prose-pre:border
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:bg-blue-50 prose-blockquote:pl-6
          ${className}`}
        dangerouslySetInnerHTML={{ __html: content }}
      />
    </div>
  );
}

export default HtmlContentRenderer;