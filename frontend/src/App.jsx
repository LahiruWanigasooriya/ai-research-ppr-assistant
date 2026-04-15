import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { UploadCloud, Send, FileText, Bot, User, Loader2, Sun, Moon, Mic, Volume2 } from 'lucide-react';
import './index.css';

function App() {
  const [messages, setMessages] = useState([
    { role: 'ai', content: 'Hello! Please upload a PDF file to begin our conversation.' }
  ]);
  const [input, setInput] = useState('');
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [isListening, setIsListening] = useState(false);
  
  const bottomRef = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, [isDark]);
  
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileChange = async (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setFile(selectedFile);
    setIsUploading(true);
    
    const formData = new FormData();
    formData.append('file', selectedFile);
    
    try {
      await axios.post('http://localhost:5000/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `I've successfully received and processed "${selectedFile.name}". What would you like to know about it?`
      }]);
    } catch (error) {
       console.error(error);
       setMessages(prev => [...prev, {
        role: 'ai',
        content: `Oops, I failed to process "${selectedFile.name}". Please check the backend connection and try again.`
      }]);
    } finally {
      setIsUploading(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setIsTyping(true);
    
    try {
      const response = await axios.post('http://localhost:5000/api/chat', {
        question: userMsg
      });
      // Try to parse out the answer from typical python simple API structures
      const answer = response.data.answer || response.data.response || response.data.result || JSON.stringify(response.data);
      setMessages(prev => [...prev, {
        role: 'ai',
        content: answer
      }]);
    } catch (error) {
       setMessages(prev => [...prev, {
        role: 'ai', 
        content: 'Sorry, I ran into an error getting the answer.'
       }]);
    } finally {
      setIsTyping(false);
    }
  };

  const startListening = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Your browser does not support Speech Recognition.");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    
    recognition.onstart = () => setIsListening(true);
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript;
      setInput(transcript);
    };
    recognition.onerror = () => setIsListening(false);
    recognition.onend = () => setIsListening(false);
    
    recognition.start();
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      alert("Your browser does not support Text to Speech.");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }

  const handleGenerateSummary = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Please generate a summary of the document.' }]);
    
    try {
      const response = await axios.get('http://localhost:5000/api/summary');
      const summary = response.data.summary || 'Could not generate summary.';
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Here is the summary:\n\n${summary}`
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I ran into an error generating the summary.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Please generate a literature review of the document.' }]);
    
    try {
      const response = await axios.get('http://localhost:5000/api/review');
      const review = response.data.review || 'Could not generate review.';
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Here is the literature review:\n\n${review}`
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I ran into an error generating the literature review.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleExtractKeyPoints = async () => {
    setIsTyping(true);
    setMessages(prev => [...prev, { role: 'user', content: 'Please extract the key points from the document.' }]);
    
    try {
      const response = await axios.get('http://localhost:5000/api/keypoints');
      const keypoints = response.data.key_points || 'Could not extract key points.';
      setMessages(prev => [...prev, {
        role: 'ai',
        content: `Here are the key points:\n\n${keypoints}`
      }]);
    } catch (error) {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'Sorry, I ran into an error extracting the key points.'
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        <header className="header">
          <div className="logo-container">
            <Bot size={28} className="logo-icon" />
            <h1>Research AI</h1>
          </div>
          
          <div className="header-actions">
            <button className="theme-toggle-btn" onClick={() => setIsDark(!isDark)} title="Toggle Dark/Light Mode">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
            <div className="upload-container">
          <input 
            type="file" 
            id="file-upload" 
            accept=".pdf" 
            onChange={handleFileChange} 
            className="hidden-input"
          />
          <label htmlFor="file-upload" className={`upload-btn ${isUploading ? 'uploading' : ''}`}>
            {isUploading ? (
              <Loader2 size={18} className="spin" />
            ) : (
              <UploadCloud size={18} />
            )}
            <span>{isUploading ? 'Uploading...' : file ? file.name : 'Upload PDF'}</span>
          </label>
            </div>
          </div>
        </header>
        
        <main className="chat-container">
        <div className="messages-wrapper">
          {messages.map((msg, i) => (
            <div key={i} className={`message-row ${msg.role}`}>
              <div className={`avatar ${msg.role}`}>
                {msg.role === 'ai' ? <Bot size={20} /> : <User size={20} />}
              </div>
              <div className="message-content">
                <p>{msg.content}</p>
                {msg.role === 'ai' && (
                  <button className="speak-btn" onClick={() => speakText(msg.content)} title="Read Aloud">
                    <Volume2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
          {isTyping && (
             <div className="message-row ai typing">
              <div className="avatar ai">
                <Bot size={20} />
              </div>
              <div className="message-content typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>
      </main>

      <footer className="footer form-container">
        <div className="footer-inner">
          {file && !isUploading && (
            <div className="action-chips">
            <button 
               className="action-chip"
               onClick={handleGenerateSummary} 
               disabled={isTyping}
            >
              📄 Generate Summary
            </button>
            <button 
               className="action-chip"
               onClick={handleGenerateReview} 
               disabled={isTyping}
            >
              📚 Literature Review
            </button>
            <button 
               className="action-chip"
               onClick={handleExtractKeyPoints} 
               disabled={isTyping}
            >
              📌 Extract Key Points
            </button>
          </div>
        )}
        <div className="input-wrapper" style={{ width: '100%' }}>
          <textarea
             placeholder="Ask a question about the document..."
             value={input}
             onChange={(e) => setInput(e.target.value)}
             onKeyDown={handleKeyDown}
             rows={1}
          />
            <button 
              className={`mic-btn ${isListening ? 'listening' : ''}`} 
              onClick={startListening} 
              title="Voice Input"
            >
              <Mic size={18} />
            </button>
            <button className="send-btn" onClick={handleSend} disabled={!input.trim() || isTyping}>
              <Send size={18} />
            </button>
          </div>
        </div>
      </footer>
    </div>
    </div>
  );
}

export default App;
