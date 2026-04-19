import { ActionButton, SecondaryButton } from "@src/components/Buttons";
import { DataPoint } from "@src/components/DataPoint";
import { SectionTitle } from "@src/components/Texts";
import { HorizontalContainer, VerticalContainer } from "@src/design/system/containers"
import { designSystem } from "@src/design/system/designSystem";

interface DashboardProps {
    padding: string;
}

export const Dashboard: React.FC<DashboardProps> = ({
    padding,
}) => {
    return (
        <VerticalContainer
            padding={padding}
            height={designSystem.sizes.hundred}
            width={designSystem.sizes.hundred}
            gap={designSystem.units.xxl}
        >
            <Header/>
            <HorizontalContainer
                width={designSystem.sizes.hundred}
                height={designSystem.sizes.ten}
            >
                <DataPoint label="To do" iconColor={"#1c75bd"} backColor="#1c75bd3d" iconType="clock"/>
                <DataPoint label="Completed" iconColor={"#198754"} backColor="#1987544d" iconType="check"/>
                <DataPoint label="In progress" iconColor={"#ffc107"} backColor="#ffc1074d" iconType="check"/>
                <DataPoint label="Overdue" iconColor={"#d92d20"} backColor="#d92c2041" iconType="check"/>
            </HorizontalContainer>
        </VerticalContainer>
    )
}

const Header = () => {
    return (
        <HorizontalContainer
            width={designSystem.sizes.hundred}
            height={designSystem.sizes.ten}
            justify="space-between"
            align="center"
        >
            <SectionTitle>Tasks</SectionTitle>
            <Buttons/>
        </HorizontalContainer>
    )
}


const Buttons = () => {
    return (
        <HorizontalContainer
            width={designSystem.sizes.twenty}
            justify="end"
            align="center"
        >
            <SecondaryButton onClick={() => {}} label="New"/>
            <ActionButton onClick={() => {}} label="Filter"/>
        </HorizontalContainer>
    )
}   
