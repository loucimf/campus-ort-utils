import { Tab } from "@src/main";
import { SidebarButton } from "../components/Buttons"
import { Logo } from "../components/Logo"
import { HorizontalContainer, VerticalContainer } from "../design/system/containers"
import { designSystem } from "../design/system/designSystem"


interface SidebarProps  {
    width?: string;
    tabs: Tab[]
    setCurrentTab: (tab: Tab) => void;
    currentTab: Tab;
}

export const Sidebar: React.FC<SidebarProps> = ({
    width = "25%",
    tabs,
    setCurrentTab,
    currentTab,
}) => {

    const handleTabClick = (tab: Tab) => {
        console.log(`Tab ${tab.label} clicked`);
        setCurrentTab(tab);
    }

    return (
        <VerticalContainer width={width} backgroundColor={designSystem.colors.sidebar}>
            <HorizontalContainer 
                height={"10%"} 
                padding={designSystem.units.md}
                backgroundColor={designSystem.colors.sidebar}
            >
                <Logo/>
            </HorizontalContainer>
            <VerticalContainer 
                gap={designSystem.units.md}
                height={"75%"}
                align="flex-start"
                padding={designSystem.units.md}
            >
                {tabs.map(tab => (
                    <SidebarButton 
                        icon={tab.icon}
                        key={tab.id} 
                        label={tab.label} 
                        onClick={() => handleTabClick(tab)} 
                        isActive={currentTab.id === tab.id}
                    />
                ))}

            </VerticalContainer>
        </VerticalContainer>
    )
}
