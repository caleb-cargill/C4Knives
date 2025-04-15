import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { contactService } from '../../utils/api';

const MessagesPage = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await contactService.getMessages();
        setMessages(response.data);
      } catch (err) {
        console.error('Error fetching messages:', err);
        setError('Failed to load messages. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="loader"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Contact Messages</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Messages List */}
        <div className="lg:col-span-2">
          <div className="bg-secondary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">All Messages</h2>
            {messages.length === 0 ? (
              <p className="text-muted">No messages found.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <motion.div
                    key={message._id}
                    className={`p-4 rounded-lg cursor-pointer transition-colors ${
                      selectedMessage?._id === message._id
                        ? 'bg-primary bg-opacity-20'
                        : 'bg-background hover:bg-primary hover:bg-opacity-10'
                    }`}
                    onClick={() => setSelectedMessage(message)}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{message.name}</h3>
                        <p className="text-sm text-muted">{message.email}</p>
                      </div>
                      <span className="text-sm text-muted">
                        {formatDate(message.createdAt)}
                      </span>
                    </div>
                    <p className="mt-2 line-clamp-2">{message.message}</p>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Details */}
        <div className="lg:col-span-1">
          <div className="bg-secondary rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold mb-4">Message Details</h2>
            {selectedMessage ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <div className="mb-4">
                  <h3 className="font-semibold text-lg">{selectedMessage.name}</h3>
                  <p className="text-muted">{selectedMessage.email}</p>
                  <p className="text-sm text-muted mt-1">
                    {formatDate(selectedMessage.createdAt)}
                  </p>
                </div>
                <div className="bg-background rounded-lg p-4">
                  <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                </div>
                <div className="mt-4">
                  <a
                    href={`mailto:${selectedMessage.email}`}
                    className="bg-primary hover:bg-complement text-white font-semibold py-2 px-4 rounded-lg transition-colors inline-block"
                  >
                    Reply via Email
                  </a>
                </div>
              </motion.div>
            ) : (
              <p className="text-muted">Select a message to view details</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage; 