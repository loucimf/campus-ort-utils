import { CSSProperties } from "react";
import { designSystem } from "./designSystem";
import "@styles/library.css"


interface BaseContainerProps {
    children: React.ReactNode;
    width?: CSSProperties["width"];
    height?: CSSProperties["height"];
    padding?: CSSProperties["padding"];
    gap?: CSSProperties["gap"];
    backgroundColor?: CSSProperties["backgroundColor"];
    align?: CSSProperties["alignItems"];
    justify?: CSSProperties["justifyContent"];
    border?: CSSProperties["border"];
    borderBottom?: CSSProperties["borderBottom"];
}


export const VerticalContainer: React.FC<BaseContainerProps> = ({
    children,
    height = "100%",
    width = "100%",
    gap = designSystem.units.md,
    backgroundColor,
    align,
    justify,
    padding,
}) => {
    return (
        <div className="column" style={{ 
            width, 
            height,
            gap, 
            backgroundColor, 
            alignItems: align, 
            justifyContent: justify, 
            padding 
        }}>
            {children}
        </div>
    )
}

export const HorizontalContainer: React.FC<BaseContainerProps> = ({
    children,
    height = "100%",
    width = "100%",
    gap = designSystem.units.md,
    backgroundColor,
    align,
    justify,
    padding,
    borderBottom,
}) => {
    return (
        <div className="row" style={{ 
            width, 
            height, 
            gap, 
            backgroundColor, 
            alignItems: align, 
            justifyContent: justify, 
            padding,
            borderBottom
        }}>
            {children}
        </div>
    )
}

interface CardContainerProps extends BaseContainerProps {
    maxWidth?: string
    backgroundColor?: string
    background?: CSSProperties["background"]
    accentColor?: string
    accentPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right"
    accentFade?: string
    borderRadius?: string
    boxShadow?: string
}

export const CardContainer: React.FC<CardContainerProps> = ({ 
    children, 
    maxWidth = '100%',
    width = '100%',
    padding = designSystem.units.sm,
    backgroundColor = designSystem.colors.contrast,
    background,
    accentColor,
    accentPosition = "top-right",
    accentFade = "60%",
    borderRadius = designSystem.units.lg,
    boxShadow = "",
    height = 'auto',
    border,
    gap = "",
}) => {
    const accentMap = {
        "top-left": "top left",
        "top-right": "top right",
        "bottom-left": "bottom left",
        "bottom-right": "bottom right"
    } as const

    const resolvedBackground =
        background ??
        (accentColor
            ? `radial-gradient(circle at ${accentMap[accentPosition]}, ${accentColor} 0%, transparent ${accentFade}), ${backgroundColor}`
            : backgroundColor)

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            width: width,
            height: height,
            maxWidth: maxWidth,
            padding: padding,
            gap: gap,
            backgroundColor: backgroundColor,
            background: resolvedBackground,
            borderRadius: borderRadius,
            boxShadow: boxShadow,
            border: border,
            fontFamily: designSystem.typography.fontFamily,
        }}>
            {children}
        </div>
    )
}
