
import LoadingMessage from "@/components/loading-message"

export default function Loading() {
  return (
    <div className="h-screen w-full flex items-center justify-center bg-gradient-to-b from-gray-900 to-black">
      <LoadingMessage />
    </div>
  )
}
