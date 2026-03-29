import { createFileRoute } from "@tanstack/react-router"
import Sandbox from "@/components/sandbox"

export const Route = createFileRoute("/")({ component: App })

function App() {
  return <Sandbox />
}