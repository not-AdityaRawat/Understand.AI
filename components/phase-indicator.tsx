"use client"

import { CheckCircle2, Circle, ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"
import type { ProjectPhase } from "@/lib/types/project"

interface PhaseIndicatorProps {
  currentPhase: ProjectPhase
  completedPhases: ProjectPhase[]
}

const phases = [
  { id: "requirements", label: "Requirements", description: "Understanding your project" },
  { id: "design", label: "Design", description: "System architecture" },
  { id: "tasks", label: "Tasks", description: "Implementation plan" },
] as const

export function PhaseIndicator({ currentPhase, completedPhases }: PhaseIndicatorProps) {
  const getPhaseStatus = (phaseId: string): "completed" | "current" | "upcoming" => {
    if (completedPhases.includes(phaseId as ProjectPhase)) return "completed"
    if (currentPhase === phaseId) return "current"
    return "upcoming"
  }

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      {phases.map((phase, index) => {
        const status = getPhaseStatus(phase.id)
        const isLast = index === phases.length - 1

        return (
          <div key={phase.id} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all",
                  status === "completed" && "border-green-500 bg-green-500/10",
                  status === "current" && "border-primary bg-primary/10 animate-pulse",
                  status === "upcoming" && "border-muted bg-muted"
                )}
              >
                {status === "completed" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                ) : (
                  <Circle
                    className={cn(
                      "h-5 w-5",
                      status === "current" && "text-primary fill-primary",
                      status === "upcoming" && "text-muted-foreground"
                    )}
                  />
                )}
              </div>
              <div className="text-center">
                <div
                  className={cn(
                    "text-xs font-medium",
                    status === "completed" && "text-green-600 dark:text-green-400",
                    status === "current" && "text-primary",
                    status === "upcoming" && "text-muted-foreground"
                  )}
                >
                  {phase.label}
                </div>
                <div className="text-[10px] text-muted-foreground max-w-[80px]">
                  {phase.description}
                </div>
              </div>
            </div>

            {!isLast && (
              <ArrowRight
                className={cn(
                  "h-4 w-4 mb-8",
                  status === "completed" && "text-green-500",
                  status === "current" && "text-primary",
                  status === "upcoming" && "text-muted-foreground"
                )}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
