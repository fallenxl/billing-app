import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface processStepperProps {
    currentStep: number;
    setCurrentStep: React.Dispatch<React.SetStateAction<number>>,
    steps: Step[]
}

export interface Step {
  id: number
  name: string
  status: "complete" | "current" | "upcoming"
}

export default function ProcessStepper({ steps }: processStepperProps) {
  
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((step, stepIdx) => (
            <li
              key={step.name}
              className={cn(
                "relative flex items-center",
                stepIdx !== steps.length - 1 ? "flex-1" : ""
              )}
            >
              {stepIdx !== steps.length - 1 ? (
                <div
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-full"
                  aria-hidden="true"
                >
                  <div
                    className={cn("h-0.5 w-full", {
                      "bg-primary": step.status === "complete",
                      "bg-gray-200": step.status !== "complete",
                    })}
                  />
                </div>
              ) : null}
              <div className="relative flex items-center justify-center">
                <span className="relative flex items-center justify-center">
                  {step.status === "complete" ? (
                    <span className="h-8 w-8 rounded-full bg-primary flex items-center justify-center relative z-10">
                      <Check className="w-5 h-5 text-primary-foreground" />
                      <span className="sr-only">Complete</span>
                    </span>
                  ) : step.status === "current" ? (
                    <span className="h-8 w-8 rounded-full border-2 border-primary bg-background flex items-center justify-center relative z-10">
                      <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                      <span className="sr-only">Current</span>
                    </span>
                  ) : (
                    <span className="h-8 w-8 rounded-full border-2 border-gray-200 bg-background flex items-center justify-center relative z-10">
                      <span className="sr-only">Upcoming</span>
                    </span>
                  )}
                </span>
                <span
                  className={cn(
                    "absolute top-10 left-1/2 -translate-x-1/2 text-xs font-medium  text-center min-w-[28px]",
                    {
                      "text-primary": step.status === "complete" || step.status === "current",
                      "text-gray-500": step.status === "upcoming",
                    }
                  )}
                >
                  {step.name}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </nav>
    </div>
  )
}
