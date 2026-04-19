import { ComponentProps } from "react";
import { designSystem } from "../design/system/designSystem"
import { SystemIcon } from "../design/system/SystemIcon";
import ClickableWrapper from "@src/design/system/ClickableWrapper";
import { LabelText } from "./Texts";



interface BaseButtonProps {
    label: string
    icon?: ComponentProps<typeof SystemIcon>["type"];
    isActive?: boolean;
    onClick: () => void;
}

export const SidebarButton: React.FC<BaseButtonProps> = ({
    label,
    icon = "dashboard",
    isActive,
    onClick
}) => {
    return (
        <ClickableWrapper
            onClick={onClick}
            width={designSystem.sizes.hundred}
            minHeight={designSystem.sizes.buttonHeight}
            padding={`${designSystem.units.sm} ${designSystem.units.md}`}
            display="flex"
            alignItems="center"
            className={isActive ? "active" : undefined}
            style={{
                backgroundColor: isActive ? designSystem.colors.itemActiveBackground : undefined,
                color: isActive ? designSystem.colors.itemActiveText : designSystem.colors.textSecondary,
                borderRadius: designSystem.units.sm,
            }}
        >
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "start",
                    gap: designSystem.units.sm,
                    width: designSystem.sizes.hundred,
                    minWidth: 0,
                    lineHeight: 1,
                }}
            >
                <SystemIcon
                    type={icon}
                    color="currentColor"
                    size="medium"
                />
                <LabelText
                    customTone={isActive ? designSystem.colors.itemActiveText : designSystem.colors.textSecondary}
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {label}
                </LabelText>
            </span>
        </ClickableWrapper>
    )
}

export const SecondaryButton: React.FC<BaseButtonProps> = ({
    label,
    icon = "dashboard",
    isActive,
    onClick
}) => {
    return (
        <ClickableWrapper
            onClick={onClick}
            minHeight={designSystem.sizes.buttonHeight}
            padding={`${designSystem.units.sm} ${designSystem.units.md}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={isActive ? "active" : undefined}
            style={{
                backgroundColor: isActive ? designSystem.colors.itemActiveBackground : "white" ,
                color: isActive ? designSystem.colors.itemActiveText : designSystem.colors.textSecondary,
                border: "1px solid " + designSystem.colors.itemActiveText,
                borderRadius: designSystem.units.sm,
            }}
        >
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: designSystem.units.sm,
                    width: designSystem.sizes.hundred,
                    minWidth: 0,
                    lineHeight: 1,
                }}
            >
                <SystemIcon
                    type={icon}
                    color="currentColor"
                    size="medium"
                />
                <LabelText
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {label}
                </LabelText>
            </span>
        </ClickableWrapper>
    )
}

export const ActionButton: React.FC<BaseButtonProps> = ({
    label,
    icon = "dashboard",
    isActive,
    onClick
}) => {
    return (
        <ClickableWrapper
            onClick={onClick}
            minHeight={designSystem.sizes.buttonHeight}
            padding={`${designSystem.units.sm} ${designSystem.units.md}`}
            display="flex"
            alignItems="center"
            justifyContent="center"
            className={isActive ? "active" : undefined}
            style={{
                backgroundColor: isActive ? undefined : designSystem.colors.itemActiveBackground ,
                color: isActive ? designSystem.colors.itemActiveText : designSystem.colors.textSecondary,
                borderRadius: designSystem.units.sm,
            }}
        >
            <span
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: designSystem.units.sm,
                    width: designSystem.sizes.hundred,
                    minWidth: 0,
                    lineHeight: 1,
                }}
            >
                <SystemIcon
                    type={icon}
                    color="currentColor"
                    size="medium"
                />
                <LabelText
                    style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                    }}
                >
                    {label}
                </LabelText>
            </span>
        </ClickableWrapper>
    )
}        
