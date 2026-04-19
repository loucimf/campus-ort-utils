import { type CSSProperties, type KeyboardEvent } from "react"
import styles from "@styles/components/ClickableWrapper.module.css"

interface ClickableWrapperProps {
    children: React.ReactNode
    onClick: () => void
    disabled?: boolean
    className?: string
    style?: CSSProperties
    title?: string
    width?: CSSProperties["width"]
    height?: CSSProperties["height"]
    maxWidth?: CSSProperties["maxWidth"]
    minHeight?: CSSProperties["minHeight"]
    padding?: CSSProperties["padding"]
    display?: CSSProperties["display"]
    alignItems?: CSSProperties["alignItems"]
    justifyContent?: CSSProperties["justifyContent"]
}

export const ClickableWrapper: React.FC<ClickableWrapperProps> = ({
    children,
    onClick,
    disabled = false,
    className,
    style,
    title,
    width,
    maxWidth,
    height,
    minHeight,
    padding,
    display,
    alignItems,
    justifyContent
}) => {
    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        if (disabled) {
            return
        }
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault()
            onClick()
        }
    }

    return (
        <div
            className={[
                styles.wrapper,
                !disabled ? styles.clickable : "",
                disabled ? styles.disabled : "",
                "DSClickableWrapper",
                className
            ].filter(Boolean).join(" ")}
            role="button"
            aria-disabled={disabled}
            tabIndex={disabled ? -1 : 0}
            onClick={disabled ? undefined : onClick}
            onKeyDown={handleKeyDown}
            style={{
                width,
                height,
                minHeight,
                padding,
                display,
                alignItems,
                justifyContent,
                maxWidth,
                ...style
            }}
            title={title}
        >
            {children}
        </div>
    )
}

export default ClickableWrapper
