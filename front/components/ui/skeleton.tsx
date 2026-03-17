import { cn } from "@/lib/utils"

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  isLoaded?: boolean
}

function Skeleton({ className, isLoaded = false, children, ...props }: Props) {
  return (
    <div
      data-loaded={isLoaded}
      className={cn(
        'group data-[loaded="false"]:animate-pulse data-[loaded="false"]:bg-muted data-[loaded="false"]:rounded-md ',
        className
      )}
      {...props}
    >
      <div className="group-data-[loaded='false']:invisible">{children}</div>
    </div>
  )
}

export { Skeleton }
