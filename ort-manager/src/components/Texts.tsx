import type { CSSProperties, ElementType, ReactNode } from "react";
import { designSystem } from "@src/design/system/designSystem";

type TextTone = "primary" | "secondary" | "soft" | "accent" | "inverse";

interface BaseTextProps {
    children?: ReactNode;
    text?: ReactNode;
    as?: ElementType;
    id?: string;
    className?: string;
    style?: CSSProperties;
    tone?: TextTone;
    customTone?: CSSProperties["color"];
}

function resolveTone(tone: TextTone) {
    switch (tone) {
        case "secondary":
            return designSystem.colors.textSecondary;
        case "soft":
            return designSystem.colors.textSoft;
        case "accent":
            return designSystem.colors.primary;
        case "inverse":
            return designSystem.colors.textInverse;
        case "primary":
        default:
            return designSystem.colors.textPrimary;
    }
}

function TextBase({
    as: Component = "span",
    children,
    text,
    id,
    className,
    style,
    tone = "primary",
    customTone = "",
}: BaseTextProps) {
    return (
        <Component
            id={id}
            className={className}
            style={{
                margin: 0,
                color: customTone !== "" ? customTone : resolveTone(tone),
                fontFamily: designSystem.typography.fontFamily,
                ...style,
            }}
        >
            {children ?? text}
        </Component>
    );
}

export function PageTitle(props: BaseTextProps) {
    return (
        <TextBase
            as="h1"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSize2xl,
                fontWeight: designSystem.typography.fontWeightBold,
                lineHeight: designSystem.typography.lineHeightTight,
                ...props.style,
            }}
        />
    );
}

export function SectionTitle(props: BaseTextProps) {
    return (
        <TextBase
            as="h2"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeXl,
                fontWeight: designSystem.typography.fontWeightBold,
                lineHeight: designSystem.typography.lineHeightTight,
                ...props.style,
            }}
        />
    );
}

export function Subtitle(props: BaseTextProps) {
    return (
        <TextBase
            as="h3"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeLg,
                fontWeight: designSystem.typography.fontWeightSemibold,
                lineHeight: designSystem.typography.lineHeightTight,
                ...props.style,
            }}
        />
    );
}

export function Eyebrow(props: BaseTextProps) {
    return (
        <TextBase
            as="p"
            tone="accent"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeXs,
                fontWeight: designSystem.typography.fontWeightBold,
                letterSpacing: 0,
                lineHeight: designSystem.typography.lineHeightNormal,
                textTransform: "uppercase",
                ...props.style,
            }}
        />
    );
}

export function BodyText(props: BaseTextProps) {
    return (
        <TextBase
            as="p"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeMd,
                fontWeight: designSystem.typography.fontWeightRegular,
                lineHeight: designSystem.typography.lineHeightNormal,
                ...props.style,
            }}
        />
    );
}

export function SmallText(props: BaseTextProps) {
    return (
        <TextBase
            as="span"
            tone="secondary"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeSm,
                fontWeight: designSystem.typography.fontWeightRegular,
                lineHeight: designSystem.typography.lineHeightNormal,
                ...props.style,
            }}
        />
    );
}

export function LabelText(props: BaseTextProps) {
    return (
        <TextBase
            as="span"
            {...props}
            style={{
                fontSize: designSystem.typography.fontSizeSm,
                fontWeight: designSystem.typography.fontWeightMedium,
                lineHeight: designSystem.typography.lineHeightNormal,
                ...props.style,
            }}
        />
    );
}

export { BodyText as Text };
