import { useEffect } from "react"

let hasRun = false

export function useOnMountUnsafe(effect) {
  useEffect(() => {
    if (!hasRun) {
      hasRun = true
      effect()
    }
  }, [])
}
