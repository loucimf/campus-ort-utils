import { HorizontalContainer, VerticalContainer } from "../design/system/containers"
import { designSystem } from "../design/system/designSystem";
import { PageTitle } from "@src/components/Texts";

interface MainTabProps {
    content?: React.ReactNode;
    width?: string;
}

export const MainTab: React.FC<MainTabProps> = ({ 
    width = "75%",
    content
}) => { 
    return (
        <VerticalContainer
            align="center"
            justify="center"
            width={width}
            backgroundColor={designSystem.colors.background}
        >
            <HorizontalContainer
                align="center"
                justify="center"
                width={designSystem.sizes.hundred}
                height={designSystem.sizes.hundred}
            >
                {content ? content : <PageTitle>Content</PageTitle>}
            </HorizontalContainer>
        </VerticalContainer>
    )
}
