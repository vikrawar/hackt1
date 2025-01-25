"use client"

import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { LuSend, LuRefreshCw } from 'react-icons/lu';

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
      // Simulated bot response - replace with actual API call
      const botResponse = await simulateBotResponse(input);
      const newBotMessage: Message = {
        id: `bot-${Date.now()}`,
        content: botResponse,
        sender: 'bot'
      };

      setMessages(prevMessages => [...prevMessages, newBotMessage]);
    } catch (error) {
      console.error('Error sending message', error);
    } finally {
      setIsLoading(false);
    }
  };

  const simulateBotResponse = (userMessage: string): Promise<string> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(`I received: "${userMessage}"`);
      }, 1000);
    });
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
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <Card className="w-full max-w-md h-[600px] flex flex-col">
        <CardContent className="flex-grow overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${
                message.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div 
                className={`max-w-[80%] p-3 rounded-lg ${
                  message.sender === 'user' 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-black'
                }`}
              >
                {message.content}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </CardContent>
        
        <CardFooter className="border-t p-4">
          <div className="flex space-x-2 w-full">
            <Button 
              variant="outline" 
              size="icon" 
              onClick={clearChat}
              disabled={messages.length === 0}
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
            >
              <LuSend className="mr-2 h-4 w-4" /> Send
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}