"use client";

import { cn } from "@/lib/utils";
import { type ComponentProps, memo } from "react";
import { Streamdown } from "streamdown";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { MermaidRenderer } from './MermaidRenderer';

type ResponseProps = ComponentProps<typeof Streamdown>;

export const Response = memo(
  ({ className, ...props }: ResponseProps) => (
    <Streamdown
      className={cn(
        "size-full [&>*:first-child]:mt-0 [&>*:last-child]:mb-0",
        className
      )}
      components={{
        code: ({ node, inline, className, children, ...codeProps }: any) => {
          const match = /language-(\w+)/.exec(className || '')
          const language = match ? match[1] : 'typescript'
          const codeString = String(children).replace(/\n$/, '')
          
          if (inline) {
            return (
              <code className="bg-gray-800 text-orange-400 px-1.5 py-0.5 rounded text-xs font-mono before:content-[''] after:content-['']" {...codeProps}>
                {children}
              </code>
            )
          }
          
          // Render Mermaid diagrams
          if (language === 'mermaid') {
            return (
              <div className="group/code relative my-3 rounded-lg overflow-hidden border border-gray-800">
                <div className="flex items-center justify-between bg-gray-900 px-3 py-1.5 border-b border-gray-800">
                  <span className="text-xs text-gray-400 font-mono">mermaid diagram</span>
                  <button
                    onClick={() => navigator.clipboard.writeText(codeString)}
                    className="opacity-0 group-hover/code:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded"
                    title="Copy code"
                  >
                    <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </button>
                </div>
                <MermaidRenderer chart={codeString} />
              </div>
            )
          }
          
          return (
            <div className="group/code relative my-3 rounded-lg overflow-hidden border border-gray-800">
              <div className="flex items-center justify-between bg-gray-900 px-3 py-1.5 border-b border-gray-800">
                <span className="text-xs text-gray-400 font-mono">{language}</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeString)}
                  className="opacity-0 group-hover/code:opacity-100 transition-opacity p-1 hover:bg-gray-800 rounded"
                  title="Copy code"
                >
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
              </div>
              <SyntaxHighlighter
                style={vscDarkPlus}
                language={language}
                PreTag="div"
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.75rem',
                  backgroundColor: '#0a0a0a',
                  border: 'none'
                }}
                {...codeProps}
              >
                {codeString}
              </SyntaxHighlighter>
            </div>
          )
        }
      }}
      {...props}
    />
  ),
  (prevProps, nextProps) => prevProps.children === nextProps.children
);

Response.displayName = "Response";
