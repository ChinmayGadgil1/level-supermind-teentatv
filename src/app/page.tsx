"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ModelResponse {
  text: string;
  timestamp: string;
}

export default function ModelInterface() {
  const [input, setInput] = useState<string>("");
  const [response, setResponse] = useState<ModelResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/model", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!res.ok) {
        throw new Error("Failed to get response from model");
      }

      const data = await res.json();
      setResponse({
        text: data.text,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Model Interface</h1>
          <p className="text-gray-600">Enter your prompt below to generate a response</p>
        </div>

        <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-gray-800">Generate Response</CardTitle>
            <CardDescription>
              Submit your prompt and receive an AI-generated response
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Textarea
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your prompt here..."
                  className="min-h-[120px] resize-none border-gray-200 focus:border-gray-300 focus:ring-gray-300 bg-white"
                  disabled={loading}
                />
              </div>

              <div className="flex justify-end">
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8"
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Generate Response"
                  )}
                </Button>
              </div>
            </form>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-100 text-red-600 rounded-lg text-sm">
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
                    Generated at: {new Date(response.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="bg-gray-50/50 border-t border-gray-100">
            <p className="text-xs text-gray-500">
              Responses are generated using AI and may vary in accuracy and relevance.
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}