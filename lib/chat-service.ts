/**
 * Service for handling chat API requests
 */

export async function sendMessage(
  text: string,
  conversationHistory: Array<{ role: string; content: string }> = [],
): Promise<string> {
  try {
    // Create a context string from previous messages to help AI stay on topic
    let contextString = ""

    if (conversationHistory.length > 0) {
      // Format the conversation history to provide context
      contextString = conversationHistory
        .map((msg) => `${msg.role === "user" ? "User" : "Assistant"}: ${msg.content}`)
        .join("\n")

      // Add the current message to the context
      contextString += `\nUser: ${text}\n\nPlease continue this conversation and stay on topic.`
    } else {
      contextString = text
    }

    // Simulate network delay for better UX with animations
    await new Promise((resolve) => setTimeout(resolve, Math.random() * 1000 + 500))

    // Use our internal API route instead of calling the external API directly
    const response = await fetch("/api/proxy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: contextString }),
    })

    const data = await response.json()

    if (!response.ok || !data) {
      console.error("API Error:", { status: response.status, data })
      return "Sorry, there was an error processing your request. Please try again."
    }

    if (!data.response) {
      console.warn("Missing response in data:", data)
      return "No response received from the API. Please try again."
    }

    return data.response
  } catch (error) {
    console.error("Error in sendMessage:", error)
    return "An unexpected error occurred. Please try again later."
  }
}
