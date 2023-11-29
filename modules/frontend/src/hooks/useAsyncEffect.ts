import { useEffect } from "react";

export function useAsyncEffect(run: (mounted: boolean) => Promise<(() => void) | void>, deps?: React.DependencyList | undefined) {
    useEffect(() => {
        let mounted = true;
        async function asyncWrapper() {
            await run(mounted)
        }
        asyncWrapper()

        return () => {
            mounted = false;
        }
    }, deps)
}