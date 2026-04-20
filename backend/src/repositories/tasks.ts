import { getSql } from "../db/client.js";
import type { TaskStatus, UserTaskWithDetails } from "../models/database.js";

interface UserTaskRow {
  id: number;
  user_id: number;
  task_id: number;
  status: TaskStatus;
  title: string;
  description: string | null;
  deliver_date: string;
  subject_id: number;
  subject_name: string;
  subject_code: string;
}

function mapUserTask(row: UserTaskRow): UserTaskWithDetails {
  return {
    id: row.id,
    userId: row.user_id,
    taskId: row.task_id,
    status: row.status,
    title: row.title,
    description: row.description,
    deliverDate: row.deliver_date,
    subjectId: row.subject_id,
    subjectName: row.subject_name,
    subjectCode: row.subject_code,
  };
}

export async function getUserTasks(userId: number) {
  const sql = getSql();
  const rows = await sql`
    select
      user_tasks.id,
      user_tasks.user_id,
      user_tasks.task_id,
      user_tasks.status,
      tasks.title,
      tasks.description,
      tasks.deliver_date,
      school_subjects.id as subject_id,
      school_subjects.name as subject_name,
      school_subjects.code as subject_code
    from user_tasks
    inner join tasks on tasks.id = user_tasks.task_id
    inner join school_subjects on school_subjects.id = tasks.subject_id
    where user_tasks.user_id = ${userId}
    order by tasks.deliver_date asc, tasks.id asc
  `;

  return (rows as UserTaskRow[]).map(mapUserTask);
}

export async function updateUserTaskStatus(userTaskId: number, status: TaskStatus) {
  const sql = getSql();
  const rows = await sql`
    update user_tasks
    set status = ${status}
    from tasks
    inner join school_subjects on school_subjects.id = tasks.subject_id
    where user_tasks.id = ${userTaskId}
      and tasks.id = user_tasks.task_id
    returning
      user_tasks.id,
      user_tasks.user_id,
      user_tasks.task_id,
      user_tasks.status,
      tasks.title,
      tasks.description,
      tasks.deliver_date,
      school_subjects.id as subject_id,
      school_subjects.name as subject_name,
      school_subjects.code as subject_code
  `;

  const typedRows = rows as UserTaskRow[];
  return typedRows[0] ? mapUserTask(typedRows[0]) : null;
}

export async function deleteUserTask(userTaskId: number) {
  const sql = getSql();
  const rows = await sql`
    delete from user_tasks
    where id = ${userTaskId}
    returning id
  `;

  return (rows as { id: number }[])[0] ?? null;
}
