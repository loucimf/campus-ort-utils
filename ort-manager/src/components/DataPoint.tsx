import { CardContainer, HorizontalContainer, VerticalContainer } from "@src/design/system/containers"
import { SystemIcon } from "@src/design/system/SystemIcon"
import { ComponentProps } from "react";
import { SmallText, Subtitle } from "./Texts";
import { designSystem } from "@src/design/system/designSystem";


interface DataPointProps {
    value?: string | number;
    label?: string;
    iconType: ComponentProps<typeof SystemIcon>["type"];
    iconColor?: string;
    backColor?: string;
}

export const DataPoint: React.FC<DataPointProps> = ({ value = "1", label = "some label", iconType, iconColor = "black", backColor = "lightgray" }) => {
    return (
        <CardContainer
            width={designSystem.sizes.twentyFive}
            boxShadow={designSystem.shadows.sm}
        >
            <HorizontalContainer
                align="center"
            >
                <div
                    style={{
                        borderRadius: "50%",
                        backgroundColor: backColor,
                        width: designSystem.units.xxl,
                        height: designSystem.units.xxl,
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                    }}
                >
                    <SystemIcon type={iconType} size="medium" color={iconColor}/>
                </div>
                <VerticalContainer 
                    gap={0}
                    height={designSystem.sizes.hundred}
                    justify="center"
                    width={designSystem.sizes.fifty}
                >
                    <Subtitle text={value.toString()}/>
                    <SmallText text={label}/>
                </VerticalContainer>
            </HorizontalContainer>
        </CardContainer>
    )
}