"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";

// Improved type definitions
interface ModelResponse {
  text: string;
  timestamp: string;
}

type DisplayType = 'Reel' | 'Carousel' | 'Static';

// Add error handling type
interface ApiError {
  error: string;
  details?: string;
}

export default function ModelInterface() {
  const [response, setResponse] = useState<ModelResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [displayType, setDisplayType] = useState<DisplayType>('Static');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await axios.post<ModelResponse | ApiError>('/api/runFlow', {
        flowId: process.env.NEXT_PUBLIC_FLOW_ID, // Changed to NEXT_PUBLIC prefix
        langflowId: process.env.NEXT_PUBLIC_LANG_FLOW_ID, // Changed to NEXT_PUBLIC prefix
        inputValue: displayType,
        tweaks: {},
        stream: false
      });
      console.log(res);
      // Type guard to check if response is an error
      if ('error' in res.data) {
        throw new Error(res.data.details || res.data.error);
      }

      setResponse(res.data as ModelResponse);
    } catch (err) {
      const errorMessage = err instanceof Error 
        ? err.message 
        : "An unexpected error occurred";
      setError(errorMessage);
      console.error('Error submitting form:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTimestamp = (timestamp: string) => {
    try {
      return new Date(timestamp).toLocaleString();
    } catch (error) {
      console.error('Error formatting timestamp:', error);
      return timestamp;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Model Interface</h1>
          <p className="text-gray-600">Select display type and generate response</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Generate Response</CardTitle>
            <CardDescription>
              Choose your display type and generate content
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="flex flex-col space-y-2">
                <label htmlFor="display-type" className="text-sm font-medium text-gray-700">
                  Display Type
                </label>
                <Select
                  value={displayType}
                  onValueChange={(value: DisplayType) => setDisplayType(value)}
                >
                  <SelectTrigger id="display-type" className="w-full">
                    <SelectValue placeholder="Select display type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Reel">Reel</SelectItem>
                    <SelectItem value="Carousel">Carousel</SelectItem>
                    <SelectItem value="Static">Static</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Content"
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm" role="alert">
                <p className="flex items-center">
                  <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}

            {response && (
              <div className="mt-8 space-y-4">
                <div className="border-t pt-4">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Generated Response</h2>
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-100">
                    <p className="whitespace-pre-wrap text-gray-700">{response.text}</p>
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Generated at: {formatTimestamp(response.timestamp)}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Content is generated using AI and may vary in appearance and style.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}