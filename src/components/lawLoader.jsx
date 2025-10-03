import { Scale } from "lucide-react"

const LawLoader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-50">
      <div className="flex flex-col items-center">
        <div className="animate-spin w-16 h-16 gradient-primary rounded-full flex items-center justify-center">
          <Scale className="w-8 h-8 text-primary-foreground" />
        </div>
        <p className="mt-4 text-lg font-serif font-medium text-primary-foreground">
          Loading LAW...
        </p>
      </div>
    </div>
  )
}

export default LawLoader
