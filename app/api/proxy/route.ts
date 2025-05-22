import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    // Encode the text for URL
    const encodedText = encodeURIComponent(text)

    // Make the request from the server side to avoid CORS issues
    const response = await fetch(`https://gpt.navsharma.com/prompt?text=${encodedText}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`)
    }

    const data = await response.json()

    // Log the response for debugging (optional)
    console.log("API Response:", data)

    return NextResponse.json(data)
  } catch (error) {
    console.error("Proxy error:", error)
    return NextResponse.json({ error: "Failed to fetch response from API" }, { status: 500 })
  }
}
