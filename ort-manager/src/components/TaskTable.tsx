import { useEffect, useState } from "react";
import type { ComponentProps, CSSProperties } from "react";
import { CardContainer } from "@src/design/system/containers";
import { designSystem } from "@src/design/system/designSystem";
import { SystemIcon } from "@src/design/system/SystemIcon";
import { BodyText, LabelText, SmallText } from "./Texts";
import styles from "@styles/components/TaskTable.module.css";

type TaskStatus = "todo" | "in-progress" | "completed" | "overdue";
type TaskPriority = "low" | "medium" | "high";

export interface TaskRows {
    id: string;
    title: string;
    subject: string;
    status: TaskStatus;
    dueDate: string;
    priority: TaskPriority;
}

interface TaskTableProps {
    tasks?: TaskRows[];
    emptyMessage?: string;
    onTaskComplete?: (task: TaskRows) => void;
    onTaskDelete?: (task: TaskRows) => void;
    onTaskSelect?: (task: TaskRows) => void;
}

const defaultTasks: TaskRows[] = [
    {
        id: "math-homework",
        title: "Homework exercises",
        subject: "Mathematics",
        status: "in-progress",
        dueDate: "Tomorrow",
        priority: "high",
    },
    {
        id: "history-summary",
        title: "Chapter summary",
        subject: "History",
        status: "todo",
        dueDate: "Friday",
        priority: "medium",
    },
    {
        id: "chemistry-lab",
        title: "Lab report",
        subject: "Chemistry",
        status: "overdue",
        dueDate: "Yesterday",
        priority: "high",
    },
];

const statusMeta: Record<TaskStatus, { label: string; color: string; background: string; icon: ComponentProps<typeof SystemIcon>["type"] }> = {
    todo: {
        label: "To do",
        color: designSystem.colors.secondary,
        background: designSystem.colors.secondarySoft,
        icon: "menu",
    },
    "in-progress": {
        label: "In progress",
        color: designSystem.colors.warning,
        background: "rgba(183, 121, 31, 0.14)",
        icon: "loading",
    },
    completed: {
        label: "Completed",
        color: designSystem.colors.success,
        background: "rgba(25, 135, 84, 0.14)",
        icon: "circle-check",
    },
    overdue: {
        label: "Overdue",
        color: designSystem.colors.error,
        background: "rgba(217, 45, 32, 0.12)",
        icon: "exclamation",
    },
};

const priorityMeta: Record<TaskPriority, { label: string; color: string; background: string }> = {
    low: {
        label: "Low",
        color: designSystem.colors.textSecondary,
        background: designSystem.colors.surfaceMuted,
    },
    medium: {
        label: "Medium",
        color: designSystem.colors.secondary,
        background: designSystem.colors.secondarySoft,
    },
    high: {
        label: "High",
        color: designSystem.colors.primary,
        background: designSystem.colors.primarySoft,
    },
};

const tableStyle: CSSProperties = {
    width: designSystem.sizes.hundred,
    borderCollapse: "separate",
    borderSpacing: 0,
    tableLayout: "fixed",
};

const cellStyle: CSSProperties = {
    padding: `${designSystem.units.md} ${designSystem.units.sm}`,
    //borderBottom: `1px solid ${designSystem.colors.border}`,
    textAlign: "left",
    verticalAlign: "middle",
};

const headerCellStyle: CSSProperties = {
    ...cellStyle,
    paddingTop: designSystem.units.sm,
    paddingBottom: designSystem.units.sm,
};

export const TaskTable: React.FC<TaskTableProps> = ({
    tasks = defaultTasks,
    emptyMessage = "No tasks yet.",
    onTaskComplete,
    onTaskDelete,
    onTaskSelect,
}) => {
    const [rows, setRows] = useState(tasks);

    useEffect(() => {
        setRows(tasks);
    }, [tasks]);

    function completeTask(task: TaskRows) {
        const completedTask = { ...task, status: "completed" as const };

        setRows(currentRows =>
            currentRows.map(row => (row.id === task.id ? completedTask : row))
        );
        onTaskComplete?.(completedTask);
    }

    function deleteTask(task: TaskRows) {
        setRows(currentRows => currentRows.filter(row => row.id !== task.id));
        onTaskDelete?.(task);
    }

    return (
        <CardContainer
            padding={designSystem.units.md}
            borderRadius={designSystem.radii.lg}
            boxShadow={designSystem.shadows.sm}
            backgroundColor={designSystem.colors.surface}
        >
            <div style={{ width: designSystem.sizes.hundred, overflowX: "auto" }}>
                <table style={tableStyle}>
                    <colgroup>
                        <col style={{ width: "34%" }} />
                        <col style={{ width: "18%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                        <col style={{ width: "16%" }} />
                    </colgroup>
                    <thead>
                        <tr>
                            <HeaderCell label="Subject / topic" />
                            <HeaderCell label="Status" />
                            <HeaderCell label="Due date" />
                            <HeaderCell label="Priority" />
                            <HeaderCell label="Actions" align="right" />
                        </tr>
                    </thead>
                    <tbody>
                        {rows.length > 0 ? (
                            rows.map(task => (
                                <TaskRow
                                    key={task.id}
                                    task={task}
                                    onComplete={completeTask}
                                    onDelete={deleteTask}
                                    onSelect={onTaskSelect}
                                />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} style={{ ...cellStyle, borderBottom: 0, textAlign: "center" }}>
                                    <BodyText tone="secondary">{emptyMessage}</BodyText>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </CardContainer>
    );
};

interface HeaderCellProps {
    label: string;
    align?: CSSProperties["textAlign"];
}

function HeaderCell({ label, align = "left" }: HeaderCellProps) {
    return (
        <th style={{ ...headerCellStyle, textAlign: align }}>
            <LabelText
                tone="soft"
                style={{
                    display: "block",
                    fontSize: designSystem.typography.fontSizeXs,
                    fontWeight: designSystem.typography.fontWeightBold,
                    textTransform: "uppercase",
                }}
            >
                {label}
            </LabelText>
        </th>
    );
}

interface TaskRowProps {
    task: TaskRows;
    onComplete: (task: TaskRows) => void;
    onDelete: (task: TaskRows) => void;
    onSelect?: (task: TaskRows) => void;
}

function TaskRow({ task, onComplete, onDelete, onSelect }: TaskRowProps) {
    const status = statusMeta[task.status];
    const priority = priorityMeta[task.priority];
    const isCompleted = task.status === "completed";

    return (
        <tr
            onClick={() => onSelect?.(task)}
            style={{
                cursor: onSelect ? "pointer" : "default",
            }}
            className={styles.taskRow}
        >
            <td style={cellStyle}>
                <div style={{ display: "flex", alignItems: "center", gap: designSystem.units.sm, minWidth: 0 }}>
                    <span
                        style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: designSystem.sizes.iconLg,
                            height: designSystem.sizes.iconLg,
                            borderRadius: designSystem.radii.md,
                            color: designSystem.colors.primary,
                            backgroundColor: designSystem.colors.primarySoft,
                            flex: "0 0 auto",
                        }}
                    >
                        <SystemIcon type="notes" color="currentColor" size="small" />
                    </span>
                    <div style={{ minWidth: 0 }}>
                        <LabelText
                            style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {task.title}
                        </LabelText>
                        <SmallText
                            style={{
                                display: "block",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                whiteSpace: "nowrap",
                            }}
                        >
                            {task.subject}
                        </SmallText>
                    </div>
                </div>
            </td>
            <td style={cellStyle}>
                <Pill color={status.color} background={""} icon={status.icon}>
                    {status.label}
                </Pill>
            </td>
            <td style={cellStyle}>
                <LabelText tone="secondary">{task.dueDate}</LabelText>
            </td>
            <td style={cellStyle}>
                <Pill color={priority.color} background={priority.background}>
                    {priority.label}
                </Pill>
            </td>
            <td style={{ ...cellStyle, textAlign: "right" }}>
                <div style={{ display: "flex", justifyContent: "flex-end", gap: designSystem.units.xs }}>
                    <IconAction
                        label={`Complete ${task.title}`}
                        icon="check"
                        color={isCompleted ? designSystem.colors.textSoft : designSystem.colors.success}
                        disabled={isCompleted}
                        onClick={() => onComplete(task)}
                    />
                    <IconAction
                        label={`Delete ${task.title}`}
                        icon="delete"
                        color={designSystem.colors.error}
                        onClick={() => onDelete(task)}
                    />
                </div>
            </td>
        </tr>
    );
}

interface PillProps {
    children: string;
    color: string;
    background: string;
    icon?: ComponentProps<typeof SystemIcon>["type"];
}

function Pill({ children, color, background, icon }: PillProps) {
    return (
        <span
            style={{
                display: "inline-flex",
                alignItems: "center",
                gap: designSystem.units.xs,
                maxWidth: designSystem.sizes.hundred,
                borderRadius: designSystem.radii.pill,
                padding: `${designSystem.units.xs} ${designSystem.units.sm}`,
                color,
                background,
                whiteSpace: "nowrap",
            }}
        >
            {icon ? <SystemIcon type={icon} color="currentColor" size="small" /> : null}
            <LabelText customTone="currentColor">{children}</LabelText>
        </span>
    );
}

interface IconActionProps {
    label: string;
    icon: ComponentProps<typeof SystemIcon>["type"];
    color: string;
    disabled?: boolean;
    onClick: () => void;
}

function IconAction({ label, icon, color, disabled = false, onClick }: IconActionProps) {
    return (
        <button
            type="button"
            aria-label={label}
            disabled={disabled}
            onClick={event => {
                event.stopPropagation();
                onClick();
            }}
            style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: designSystem.units.xxl,
                height: designSystem.units.xxl,
                border: `1px solid ${designSystem.colors.border}`,
                borderRadius: designSystem.radii.md,
                color,
                background: designSystem.colors.surfaceRaised,
                cursor: disabled ? "not-allowed" : "pointer",
                opacity: disabled ? 0.45 : 1,
            }}
        >
            <SystemIcon type={icon} color="currentColor" size="medium" />
        </button>
    );
}
