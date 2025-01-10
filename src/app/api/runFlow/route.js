import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const { flowId, langflowId, inputValue, tweaks, stream } = body;

    if (!flowId || !langflowId || !inputValue || tweaks === undefined || stream === undefined) {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const applicationToken = "AstraCS:WsCEcaRaAqueEyuqZcPZsYet:3327d55debc5b359468ab7d3ba9ce5d539f012e3c04a853f0763571c29c30efc" // Use environment variable
    const baseURL = 'https://api.langflow.astra.datastax.com';

    class LangflowClient {
      constructor(baseURL, applicationToken) {
        this.baseURL = baseURL;
        this.applicationToken = applicationToken;
      }

      async post(endpoint, body, headers = { 'Content-Type': 'application/json' }) {
        headers['Authorization'] = `Bearer ${this.applicationToken}`;
        const url = `${this.baseURL}${endpoint}`;
        const response = await fetch(url, {
          method: 'POST',
          headers,
          body: JSON.stringify(body),
        });

        const responseMessage = await response.json();
        if (!response.ok) {
          throw new Error(
            `${response.status} ${response.statusText} - ${JSON.stringify(responseMessage)}`
          );
        }
        return responseMessage;
      }

      async initiateSession(flowId, langflowId, inputValue, tweaks, stream) {
        const endpoint = `/lf/${langflowId}/api/v1/run/${flowId}?stream=${stream}`;
        return this.post(endpoint, {
          input_value: inputValue,
          input_type: 'chat',
          output_type: 'chat',
          tweaks,
        });
      }
    }

    const client = new LangflowClient(baseURL, applicationToken);

    // Run the flow and return the response
    const response = await client.initiateSession(flowId, langflowId, inputValue, tweaks, stream);
    return NextResponse.json(response);
  } catch (error) {
    console.error("Error running flow:", error.message);
    return NextResponse.json({ error: "Error initiating session", details: error.message }, { status: 500 });
  }
}
