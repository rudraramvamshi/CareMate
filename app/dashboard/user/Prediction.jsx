import React, { useState, useEffect, useRef } from 'react';
import { Phone, Video, MoreVertical, Paperclip, Mic, Send, Bot, Plus, Trash2, Calendar, Clock, User, CheckCircle } from 'lucide-react';
import dayjs from 'dayjs';

export default function EnhancedAIChat() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [typing, setTyping] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [bookingDoctor, setBookingDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [booking, setBooking] = useState(false);
  const messagesEndRef = useRef(null);

  const MODEL_API = process.env.NEXT_PUBLIC_MODEL_API || 'https://42tbnklm-5000.inc1.devtunnels.ms';

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load user info
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => setCurrentUser(data))
      .catch(err => console.error('Error loading user:', err));

    // Load sessions and history
    loadSessions();
    loadHistory();
  }, []);

  const loadSessions = async () => {
    try {
      const response = await fetch(`${MODEL_API}/api/sessions`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setSessions(data.sessions);
      }
    } catch (err) {
      console.error('Error loading sessions:', err);
    }
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`${MODEL_API}/api/history`, {
        credentials: 'include'
      });
      const data = await response.json();
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
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading history:', err);
    }
  };

  const loadSession = async (sessionId) => {
    try {
      const response = await fetch(`${MODEL_API}/api/session/${sessionId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCurrentSessionId(sessionId);
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
        }));
        setMessages(formattedMessages);
      }
    } catch (err) {
      console.error('Error loading session:', err);
    }
  };

  const deleteSession = async (sessionId) => {
    if (!confirm('Are you sure you want to delete this conversation?')) return;

    try {
      const response = await fetch(`${MODEL_API}/api/session/${sessionId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        loadSessions();
        if (currentSessionId === sessionId) {
          setMessages([]);
          createNewChat();
        }
      }
    } catch (err) {
      console.error('Error deleting session:', err);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch(`${MODEL_API}/api/new-chat`, {
        method: 'POST',
        credentials: 'include'
      });
      const data = await response.json();
      if (data.success) {
        setCurrentSessionId(data.session_id);
        setMessages([]);
        loadSessions();
      }
    } catch (err) {
      console.error('Error creating new chat:', err);
    }
  };

  const handleSend = async () => {
    if (!message.trim() || loading) return;

    const userMessage = {
      id: Date.now(),
      type: 'user',
      text: message,
      time: new Date().toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      })
    };

    setMessages(prev => [...prev, userMessage]);
    setMessage('');
    setLoading(true);
    setTyping(true);

    try {
      const response = await fetch(`${MODEL_API}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ message: message })
      });

      const data = await response.json();
      setTyping(false);

      if (data.success) {
        const aiMessage = {
          id: Date.now() + 1,
          type: 'ai',
          text: data.response,
          time: data.timestamp,
          source: data.source,
          relatedDoctors: data.related_doctors
        };
        setMessages(prev => [...prev, aiMessage]);
        loadSessions();
      } else {
        alert('Failed to get response from AI');
      }
    } catch (err) {
      console.error('Error sending message:', err);
      alert('Failed to send message');
      setTyping(false);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 9; hour < 18; hour++) {
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`);
    }
    return slots;
  };

  const handleBookAppointment = async (doctor) => {
    if (!selectedDate || !selectedTime) {
      alert('Please select date and time');
      return;
    }

    setBooking(true);

    const startDateTime = dayjs(`${selectedDate} ${selectedTime}`).toISOString();
    const endDateTime = dayjs(`${selectedDate} ${selectedTime}`).add(30, 'minute').toISOString();

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          doctorId: doctor._id,
          start: startDateTime,
          end: endDateTime,
          notes: bookingNotes
        })
      });

      if (response.ok) {
        // Add confirmation message to chat
        const confirmationMessage = {
          id: Date.now() + 2,
          type: 'ai',
          text: `✅ Appointment booked successfully with Dr. ${doctor.name.first} ${doctor.name.last} on ${dayjs(startDateTime).format('MMMM DD, YYYY')} at ${dayjs(startDateTime).format('h:mm A')}. You will receive a confirmation email shortly.`,
          time: new Date().toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
          }),
          isConfirmation: true
        };

        setMessages(prev => [...prev, confirmationMessage]);
        setBookingDoctor(null);
        setSelectedDate('');
        setSelectedTime('');
        setBookingNotes('');
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to book appointment');
      }
    } catch (err) {
      console.error('Error booking appointment:', err);
      alert('Failed to book appointment');
    } finally {
      setBooking(false);
    }
  };

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
          </div>
        </div>

        {/* Messages Container */}
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
                        : msg.isConfirmation
                          ? 'bg-green-50 border border-green-200 rounded-2xl rounded-tl-none'
                          : 'bg-white rounded-2xl rounded-tl-none border border-gray-200 shadow-sm'
                      } px-4 py-3`}
                  >
                    <p className={`text-sm whitespace-pre-wrap ${msg.isConfirmation ? 'text-green-800' : ''}`}>
                      {msg.text}
                    </p>

                    {msg.source && (
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500">Source: {msg.source}</p>
                      </div>
                    )}

                    {msg.relatedDoctors?.length > 0 && (
                      <div className="mt-4 space-y-2">
                        <p className="text-sm font-semibold text-gray-900 mb-3">Recommended Specialists:</p>
                        {msg.relatedDoctors.map((doctor, idx) => (
                          <div key={idx} className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-100">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex items-start space-x-3">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                  <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-gray-900 text-sm">
                                    Dr. {doctor.name?.first} {doctor.name?.last}
                                  </h4>
                                  <p className="text-xs text-teal-600 font-semibold">{doctor.specialization}</p>
                                  <p className="text-xs text-gray-600 mt-1">
                                    {doctor.yearsExperience} years experience
                                  </p>
                                </div>
                              </div>
                            </div>

                            {/* Inline Booking Form */}
                            {bookingDoctor?._id === doctor._id ? (
                              <div className="mt-3 space-y-3 bg-white p-4 rounded-lg border border-gray-200">
                                <div className="grid grid-cols-2 gap-3">
                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      <Calendar size={12} className="inline mr-1" />
                                      Select Date
                                    </label>
                                    <input
                                      type="date"
                                      value={selectedDate}
                                      onChange={(e) => setSelectedDate(e.target.value)}
                                      min={dayjs().format('YYYY-MM-DD')}
                                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                  </div>

                                  <div>
                                    <label className="block text-xs font-medium text-gray-700 mb-1">
                                      <Clock size={12} className="inline mr-1" />
                                      Select Time
                                    </label>
                                    <select
                                      value={selectedTime}
                                      onChange={(e) => setSelectedTime(e.target.value)}
                                      className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                      <option value="">Choose time</option>
                                      {generateTimeSlots().map(slot => (
                                        <option key={slot} value={slot}>{slot}</option>
                                      ))}
                                    </select>
                                  </div>
                                </div>

                                <div>
                                  <label className="block text-xs font-medium text-gray-700 mb-1">
                                    Notes (Optional)
                                  </label>
                                  <textarea
                                    value={bookingNotes}
                                    onChange={(e) => setBookingNotes(e.target.value)}
                                    className="w-full px-3 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                    placeholder="Any specific concerns..."
                                  />
                                </div>

                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleBookAppointment(doctor)}
                                    disabled={booking || !selectedDate || !selectedTime}
                                    className="flex-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1"
                                  >
                                    {booking ? (
                                      'Booking...'
                                    ) : (
                                      <>
                                        <CheckCircle size={16} />
                                        Confirm Booking
                                      </>
                                    )}
                                  </button>
                                  <button
                                    onClick={() => {
                                      setBookingDoctor(null);
                                      setSelectedDate('');
                                      setSelectedTime('');
                                      setBookingNotes('');
                                    }}
                                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition text-sm font-medium"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setBookingDoctor(doctor)}
                                className="w-full mt-2 bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all shadow-sm flex items-center justify-center gap-2"
                              >
                                <Calendar size={16} />
                                Book Appointment
                              </button>
                            )}
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

      {/* Sidebar */}
      <div className="w-80 bg-white border-l border-gray-200 flex flex-col min-h-0 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex-shrink-0">
          <h3 className="font-semibold text-gray-900">Recent Conversations</h3>
        </div>

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
                        e.stopPropagation();
                        deleteSession(session.session_id);
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
  );
}