import { ActionButton, SecondaryButton } from "@src/components/Buttons";
import { DataPoint } from "@src/components/DataPoint";
import { NewTaskModal, type NewTaskFormValues } from "@src/components/NewTaskModal";
import { TaskTable, type TaskRows } from "@src/components/TaskTable";
import { SectionTitle } from "@src/components/Texts";
import { API_BASE_URL } from "@src/core/api";
import { TaskService } from "@src/core/services/TaskServices";
import { HorizontalContainer, VerticalContainer } from "@src/design/system/containers"
import { designSystem } from "@src/design/system/designSystem";
import type { UserTaskWithDetails } from "@src/models/database";
import { useEffect, useState } from "react";

interface DashboardProps {
    padding: string;
}

const service = new TaskService(API_BASE_URL)

function mapTaskToRow(task: UserTaskWithDetails): TaskRows {
    return {
        id: String(task.id),
        title: task.title,
        subject: task.subjectName,
        status: task.status === "Completed"
            ? "completed"
            : task.status === "Overdue"
                ? "overdue"
                : "todo",
        dueDate: task.deliverDate,
        priority: "medium",
    };
}

export const Dashboard: React.FC<DashboardProps> = ({
    padding,
}) => {
    
    const [allTasks, setAllTasks] = useState<TaskRows[]>([]);
    const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState(false);

    async function fetchTasks() {
        const tasks = await service.getTasks("1");
        return tasks.map(mapTaskToRow);
    }

    useEffect(() => {
        async function loadTasks() {
            try {
                const tasks = await fetchTasks();
                setAllTasks(tasks);
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }

        loadTasks();
    }, [])           

    const tasks: TaskRows[] = [
        {
            id: "math-homework",
            title: "test exercises",
            subject: "Mathematics",
            status: "in-progress",
            dueDate: "Tomorrow",
            priority: "high",
        },
        {
            id: "history-summary",
            title: "test summary",
            subject: "History",
            status: "todo",
            dueDate: "Friday",
            priority: "medium",
        },
        {
            id: "chemistry-lab",
            title: "test report",
            subject: "Chemistry",
            status: "overdue",
            dueDate: "Yesterday",
            priority: "high",
        },
    ];

    function handleCreateTask(task: NewTaskFormValues) {
        const nextTask: TaskRows = {
            id: `local-${crypto.randomUUID()}`,
            title: task.title,
            subject: `Subject #${task.subjectId}`,
            status: "todo",
            dueDate: task.deliverDate,
            priority: "medium",
        };

        setAllTasks(currentTasks => [nextTask, ...currentTasks]);
    }

    return (
        <VerticalContainer
            padding={padding}
            height={designSystem.sizes.hundred}
            width={designSystem.sizes.hundred}
            gap={designSystem.units.xxl}
        >
            <Header onNewTaskClick={() => setIsNewTaskModalOpen(true)} />
            <HorizontalContainer
                width={designSystem.sizes.hundred}
                height={designSystem.sizes.ten}
            >
                <DataPoint label="To do" iconColor={"#1c75bd"} backColor="#1c75bd15" iconType="menu"/>
                <DataPoint label="Completed" iconColor={"#198754"} backColor="#19875415" iconType="circle-check"/>
                <DataPoint label="In progress" iconColor={"#ffc107"} backColor="#ffc10715" iconType="loading"/>
                <DataPoint label="Overdue" iconColor={"#d92d20"} backColor="#d92c2015" iconType="exclamation"/>
            </HorizontalContainer>
            <TaskTable
                tasks={allTasks.length > 0 ? allTasks : tasks}
                onTaskComplete={task => console.log("Completed task", task)}
                onTaskDelete={task => console.log("Deleted task", task)}
                onTaskSelect={task => console.log("Selected task", task)}
            />
            <NewTaskModal
                isOpen={isNewTaskModalOpen}
                onClose={() => setIsNewTaskModalOpen(false)}
                onCreateTask={handleCreateTask}
            />
        </VerticalContainer>
    )
}

interface HeaderProps {
    onNewTaskClick: () => void;
}

const Header = ({ onNewTaskClick }: HeaderProps) => {
    return (
        <HorizontalContainer
            width={designSystem.sizes.hundred}
            height={designSystem.sizes.ten}
            justify="space-between"
            align="center"
        >
            <SectionTitle>Tasks</SectionTitle>
            <Buttons onNewTaskClick={onNewTaskClick} />
        </HorizontalContainer>
    )
}

interface ButtonsProps {
    onNewTaskClick: () => void;
}

const Buttons = ({ onNewTaskClick }: ButtonsProps) => {
    return (
        <HorizontalContainer
            width={designSystem.sizes.twenty}
            justify="end"
            align="center"
        >
            <SecondaryButton onClick={() => {}} label="Filter"/>
            <ActionButton onClick={onNewTaskClick} label="New task" icon="check"/>
        </HorizontalContainer>
    )
}   
