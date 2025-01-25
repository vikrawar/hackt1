"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LuSend, LuRefreshCw } from 'react-icons/lu';
import { motion } from 'framer-motion';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'bot';
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<null | HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const newUserMessage: Message = {
      id: `user-${Date.now()}`,
      content: input,
      sender: 'user'
    };

    setMessages(prevMessages => [...prevMessages, newUserMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
       body: JSON.stringify({ "input_text": input })
      });

      const data = await response.json();
      const newBotMessage: Message = {
        id: `bot-${Date.now()}`,
        content: data.response,
        sender: 'bot'
      };

      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error sending message', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([]);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md h-[600px] flex flex-col shadow-lg rounded-lg overflow-hidden">
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4 bg-white">
          {messages.map((message) => (
            <motion.div 
              key={message.id} 
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg shadow-md ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'
                }`}
              >
                {message.content}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="max-w-[80%] p-3 rounded-lg shadow-md bg-gray-200 text-black flex items-center">
                <AiOutlineLoading3Quarters className="animate-spin mr-2" />
                Thinking...
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="border-t p-4 bg-gray-100">
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearChat}
              disabled={messages.length === 0}
              className="hover:bg-red-500 hover:text-white transition-colors"
            >
              <LuRefreshCw className="h-4 w-4" />
            </Button>
            <div className="flex-grow">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full"
                disabled={isLoading}
              />
            </div>
            <Button 
              onClick={handleSendMessage} 
              disabled={input.trim() === '' || isLoading}
              className="hover:bg-green-500 hover:text-white transition-colors"
            >
              <LuSend className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}