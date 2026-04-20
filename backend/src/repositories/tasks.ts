import { getSql } from "../db/client.js";
import type { TaskStatus, UserTaskWithDetails } from "../models/database.js";

export interface CreateUserTaskInput {
  userId: number;
  subjectId: number;
  title: string;
  description: string | null;
  deliverDate: string;
}

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

export async function createUserTask(input: CreateUserTaskInput) {
  const sql = getSql();
  const rows = await sql`
    with inserted_task as (
      insert into tasks (subject_id, title, description, deliver_date)
      values (${input.subjectId}, ${input.title}, ${input.description}, ${input.deliverDate})
      returning id, subject_id, title, description, deliver_date
    ),
    inserted_user_task as (
      insert into user_tasks (user_id, task_id)
      select ${input.userId}, inserted_task.id
      from inserted_task
      returning id, user_id, task_id, status
    )
    select
      inserted_user_task.id,
      inserted_user_task.user_id,
      inserted_user_task.task_id,
      inserted_user_task.status,
      inserted_task.title,
      inserted_task.description,
      inserted_task.deliver_date,
      school_subjects.id as subject_id,
      school_subjects.name as subject_name,
      school_subjects.code as subject_code
    from inserted_user_task
    inner join inserted_task on inserted_task.id = inserted_user_task.task_id
    inner join school_subjects on school_subjects.id = inserted_task.subject_id
  `;

  const typedRows = rows as UserTaskRow[];
  return typedRows[0] ? mapUserTask(typedRows[0]) : null;
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
