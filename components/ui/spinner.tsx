import { Loader } from "lucide-react"

import { cn } from "@/lib/utils"

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
    return (
        <Loader
            role="status"
            aria-label="Loading"
            className={cn("size-4 animate-spin", className)}
            {...props}
        />
    )
}

export { Spinner }


export function SpinnerCustom() {
    return (
        <div className="flex items-center justify-center gap-4 min-h-screen">
            <Spinner className="size-6" />
        </div>
    )
}