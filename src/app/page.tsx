'use client';

import { useState, useRef, useEffect } from 'react';
import { marked } from 'marked';

export default function Home() {
  const [topic, setTopic] = useState('');
  const [brand, setBrand] = useState('');
  const [aim, setAim] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [modelUsed, setModelUsed] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copyText, setCopyText] = useState('Copy to Clipboard');
  const [copySuccess, setCopySuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic || !brand || !aim) return;

    setLoading(true);
    setError(null);
    setResult(null);
    setModelUsed(null);

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic, brand, aim }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate script');
      }

      const data = await response.json();
      setResult(data.script);
      setModelUsed(data.model_used);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    
    // Create a temporary element to get the plain text if needed, 
    // but the original script.js used innerText of the result-content.
    // In React, we can just use the 'result' state or get it from a ref.
    const textToCopy = result; 
    
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopyText('Copied!');
      setCopySuccess(true);
      setTimeout(() => {
        setCopyText('Copy to Clipboard');
        setCopySuccess(false);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy', err);
    });
  };

  return (
    <>
      <div className="background-effects">
        <div className="glow-orb orb-1"></div>
        <div className="glow-orb orb-2"></div>
      </div>
      
      <div className="container">
        <header>
          <h1>Reel<span className="highlight">Gen</span></h1>
          <p>Create viral scripts in seconds.</p>
        </header>

        <main className="content-wrapper">
          <div className="glass-panel input-section">
            <h2>Configure Your Reel</h2>
            <form id="generator-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="topic">Topic / Subject</label>
                <input 
                  type="text" 
                  id="topic" 
                  placeholder="e.g. 3 Tips for Productivity" 
                  required 
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="brand">Brand / Creator Name</label>
                <input 
                  type="text" 
                  id="brand" 
                  placeholder="e.g. John Doe Tech" 
                  required 
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="aim">Aim / Goal</label>
                <input 
                  type="text" 
                  id="aim" 
                  placeholder="e.g. Get more newsletter signups" 
                  required 
                  value={aim}
                  onChange={(e) => setAim(e.target.value)}
                />
              </div>
              
              <button 
                type="submit" 
                id="generate-btn" 
                className={`primary-btn ${loading ? 'loading' : ''}`}
                disabled={loading}
              >
                <span className={`btn-text ${loading ? 'loading' : ''}`}>Generate Viral Script</span>
                <div className={`loader ${loading ? 'active' : ''}`} id="btn-loader"></div>
              </button>
            </form>
          </div>

          <div className="glass-panel output-section">
            <div className="output-header">
              <h2>Generated Script</h2>
              {modelUsed && <span id="model-badge" className="badge">{modelUsed}</span>}
            </div>
            
            <div 
              id="result-content" 
              className={`result-content ${!result && !error ? 'empty' : ''}`}
              dangerouslySetInnerHTML={{ 
                __html: result ? marked.parse(result) : (error ? `<p class="placeholder-text" style="color: #ef4444;">Error: ${error}</p>` : '<p class="placeholder-text">Your generated script will appear here...</p>')
              }}
            >
            </div>

            {result && !error && (
              <button 
                id="copy-btn" 
                className="secondary-btn"
                onClick={handleCopy}
                style={copySuccess ? {
                  background: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  borderColor: 'rgba(16, 185, 129, 0.4)'
                } : {}}
              >
                {copyText}
              </button>
            )}
          </div>
        </main>
      </div>
    </>
  );
}
