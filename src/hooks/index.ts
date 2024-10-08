import { useAppContext, useThemeContext } from '@/providers'

export { default as useDisclosure } from './useDisclosure'
export { default as useServerAction } from './useServerAction'

export const useIsHydrated = () => useAppContext().isHydrated
export const useWorkflow = () => useAppContext().workflow
export const useTheme = () => useThemeContext().themeHandler
export * from './useRefreshServerPaths'
export * from './useRole'
export * from './useWorkflowHandler'
export * from './useChainSpecs'
