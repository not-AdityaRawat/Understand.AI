"use client"

import { Button } from "@/components/ui/button"
import { Download, FileText, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface DocumentDownloadProps {
  requirementsContent?: string
  designContent?: string
  tasksContent?: string
  projectName: string
}

export function DocumentDownload({
  requirementsContent,
  designContent,
  tasksContent,
  projectName,
}: DocumentDownloadProps) {
  const downloadFile = (content: string, filename: string) => {
    const blob = new Blob([content], { type: "text/markdown;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handleDownload = (type: "requirements" | "design" | "tasks") => {
    const sanitizedName = projectName.replace(/[^a-z0-9]/gi, "-").toLowerCase()
    
    switch (type) {
      case "requirements":
        if (requirementsContent) {
          downloadFile(requirementsContent, `${sanitizedName}-requirements.md`)
        }
        break
      case "design":
        if (designContent) {
          downloadFile(designContent, `${sanitizedName}-design.md`)
        }
        break
      case "tasks":
        if (tasksContent) {
          downloadFile(tasksContent, `${sanitizedName}-tasks.md`)
        }
        break
    }
  }

  const hasAnyDocument = requirementsContent || designContent || tasksContent

  if (!hasAnyDocument) {
    return null
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4">
      <div className="flex items-center gap-2">
        <FileText className="h-5 w-5 text-primary" />
        <h3 className="font-semibold text-foreground">Generated Documents</h3>
      </div>

      <div className="flex flex-col gap-2">
        {requirementsContent && (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between",
              "hover:bg-primary/5 hover:border-primary"
            )}
            onClick={() => handleDownload("requirements")}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Requirements.md
            </span>
            <Download className="h-4 w-4" />
          </Button>
        )}

        {designContent && (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between",
              "hover:bg-primary/5 hover:border-primary"
            )}
            onClick={() => handleDownload("design")}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Design.md
            </span>
            <Download className="h-4 w-4" />
          </Button>
        )}

        {tasksContent && (
          <Button
            variant="outline"
            className={cn(
              "w-full justify-between",
              "hover:bg-primary/5 hover:border-primary"
            )}
            onClick={() => handleDownload("tasks")}
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              Tasks.md
            </span>
            <Download className="h-4 w-4" />
          </Button>
        )}
      </div>

      {tasksContent && (
        <p className="text-xs text-muted-foreground">
          Download Task.md and provide it to your preferred AI agent to build your project.
        </p>
      )}
    </div>
  )
}
