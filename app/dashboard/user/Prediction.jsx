import React, { useState, useEffect, useRef } from 'react'
import { Phone, Video, MoreVertical, Paperclip, Mic, Send, Star, Bot, Plus, Trash2 } from 'lucide-react'

export default function AIHealthChat() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState([])
  const [sessions, setSessions] = useState([])
  const [currentSessionId, setCurrentSessionId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [typing, setTyping] = useState(false)
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Load sessions
    loadSessions()
    // Load chat history
    loadHistory()
  }, [])

  const model_key = process.env.NEXT_PUBLIC_MODEL_API
  console.log(model_key)
  const loadSessions = async () => {
    try {
      const response = await fetch(`${model_key}/api/sessions`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setSessions(data.sessions)
      }
    } catch (err) {
      console.error('Error loading sessions:', err)
    }
  }

  const loadHistory = async () => {
    try {
      const response = await fetch(`${model_key}/api/history`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        const formattedMessages = data.messages.map(msg => ({
          id: msg.session_id + msg.timestamp,
          type: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          source: msg.source,
          relatedDoctors: msg.related_doctors
        }))
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error('Error loading history:', err)
    }
  }

  const loadSession = async (sessionId) => {
    try {
      const response = await fetch(`${model_key}/api/session/${sessionId}`, {
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setCurrentSessionId(sessionId)
        const formattedMessages = data.messages.map(msg => ({
          id: msg.session_id + msg.timestamp,
          type: msg.role === 'user' ? 'user' : 'ai',
          text: msg.content,
          time: new Date(msg.timestamp).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          source: msg.source,
          relatedDoctors: msg.related_doctors
        }))
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error('Error loading session:', err)
    }
  }

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return

    try {
      const response = await fetch(`${model_key}/api/session/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        loadSessions()
        if (currentSessionId === sessionId) {
          setMessages([])
          createNewChat()
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err)
    }
  }

  const createNewChat = async () => {
    try {
      const response = await fetch(`${model_key}/api/new-chat`, {
        method: 'POST',
        credentials: 'include'
      })
      const data = await response.json()
      if (data.success) {
        setCurrentSessionId(data.session_id)
        setMessages([])
        loadSessions()
      }
    } catch (err) {
      console.error('Error creating new chat:', err)
    }
  }

  const handleSend = async () => {
    if (!message.trim() || loading) return

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    }

    setMessages(prev => [...prev, userMessage])
    setMessage('')
    setLoading(true)
    setTyping(true)

    try {
      const response = await fetch(`${model_key}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: message })
      })

      const data = await response.json()
      setTyping(false)

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: data.response,
          time: data.timestamp,
          source: data.source,
          relatedDoctors: data.related_doctors
        }
        setMessages(prev => [...prev, aiMessage])
        loadSessions()
      } else {
        alert('Failed to get response from AI')
      }
    } catch (err) {
      console.error('Error sending message:', err)
      alert('Failed to send message')
      setTyping(false)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="flex h-[91vh] bg-gray-50 overflow-hidden">

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden">

        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900">AI Health Assistant</h2>
              <p className="text-xs text-gray-500">Powered by MediGenius</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={createNewChat}
              className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-sm font-medium transition-colors"
            >
              <Plus className="w-4 h-4" />
              New Chat
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Phone className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <Video className="w-5 h-5" />
            </button>
            <button className="text-gray-600 hover:text-gray-900">
              <MoreVertical className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Messages Container - Independent Scroll */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-4">
                  <Bot className="w-10 h-10 text-blue-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Welcome to AI Health Assistant</h3>
                <p className="text-gray-600 max-w-md">
                  Describe your symptoms and I'll help you understand possible conditions and recommend specialists.
                </p>
              </div>
            )}

            {messages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-3">
                {msg.type === 'ai' && (
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                )}
                <div className={`flex-1 ${msg.type === 'user' ? 'flex justify-end' : ''}`}>
                  <div
                    className={`inline-block max-w-2xl ${msg.type === 'user'
                      ? 'bg-blue-500 text-white rounded-2xl rounded-tr-none'
                      : 'bg-white rounded-2xl rounded-tl-none border border-gray-200 shadow-sm'
                      } px-4 py-3`}
                  >
                    <p className="text-sm whitespace-pre-wrap">{msg.text}</p>

                    {msg.source && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Source: {msg.source}</p>
                      </div>
                    )}

                    {msg.relatedDoctors?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Recommended Specialists:</p>
                        {msg.relatedDoctors.map((doctor, idx) => (
                          <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-start justify-between">
                              <div>
                                <h4 className="font-semibold text-gray-900 text-sm">
                                  Dr. {doctor.name?.first} {doctor.name?.last}
                                </h4>
                                <p className="text-xs text-teal-600 font-medium">{doctor.specialization}</p>
                                <p className="text-xs text-gray-600 mt-1">{doctor.yearsExperience} years experience</p>
                              </div>
                              <button className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ml-3">
                                Book Now
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {msg.time && (
                      <p className={`text-xs mt-2 ${msg.type === 'user' ? 'opacity-80' : 'text-gray-500'}`}>
                        {msg.time}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {typing && (
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot className="w-5 h-5 text-blue-600" />
                </div>
                <div className="bg-white rounded-2xl rounded-tl-none px-4 py-3 inline-block shadow-sm border border-gray-200">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input */}
        <div className="bg-white border-t border-gray-200 px-6 py-4 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button className="text-gray-600 hover:text-gray-900">
              <Paperclip className="w-5 h-5" />
            </button>
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Describe your symptoms..."
              disabled={loading}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm disabled:bg-gray-100"
            />
            <button className="text-gray-600 hover:text-gray-900">
              <Mic className="w-5 h-5" />
            </button>
            <button
              onClick={handleSend}
              disabled={loading || !message.trim()}
              className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-full transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Sidebar - Independent Scroll */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-0 overflow-hidden">

        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
        </div>

        {/* Recent Conversations List */}
        <div className="flex-1 overflow-y-auto min-h-0">
          {sessions.length === 0 ? (
            <div className="p-6 text-center text-gray-500 text-sm">
              No conversations yet. Start chatting!
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.session_id}
                className="px-6 py-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 group relative"
                onClick={() => loadSession(session.session_id)}
              >
                <div className="flex items-start justify-between mb-1">
                  <h4 className="font-medium text-gray-900 text-sm flex-1 pr-2">
                    {session.preview || 'New Conversation'}
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {new Date(session.last_active).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        deleteSession(session.session_id)
                      }}
                      className="opacity-0 group-hover:opacity-100 text-red-600 hover:text-red-700 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-500">
                  {new Date(session.last_active).toLocaleTimeString('en-US', {
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true
                  })}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}