import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "./Modal";
import { LabelText, SmallText } from "./Texts";
import styles from "@styles/components/NewTaskModal.module.css";
import type { SchoolSubject } from "@src/models/database";

export interface NewTaskFormValues {
    subjectId: number;
    title: string;
    description: string | null;
    deliverDate: string;
}

interface NewTaskModalProps {
    isOpen: boolean;
    subjects: SchoolSubject[];
    onClose: () => void;
    onCreateTask: (task: NewTaskFormValues) => Promise<void> | void;
}

const initialForm = {
    subjectId: "",
    title: "",
    description: "",
    deliverDate: "",
};

export function NewTaskModal({ isOpen, subjects, onClose, onCreateTask }: NewTaskModalProps) {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    function updateField(field: keyof typeof form, value: string) {
        setForm(currentForm => ({
            ...currentForm,
            [field]: value,
        }));
    }

    function resetAndClose() {
        setForm(initialForm);
        setError("");
        setIsSubmitting(false);
        onClose();
    }

    async function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const subjectId = Number(form.subjectId);

        if (!Number.isInteger(subjectId) || !subjects.some(subject => subject.id === subjectId)) {
            setError("Choose a valid subject.");
            return;
        }

        if (!form.title.trim()) {
            setError("Title is required.");
            return;
        }

        if (!form.deliverDate) {
            setError("Deliver date is required.");
            return;
        }

        try {
            setIsSubmitting(true);
            setError("");

            await onCreateTask({
                subjectId,
                title: form.title.trim(),
                description: form.description.trim() || null,
                deliverDate: form.deliverDate,
            });

            resetAndClose();
        } catch (error) {
            console.error("Error creating task:", error);
            setError("Could not create the task. Try again.");
            setIsSubmitting(false);
        }
    }

    return (
        <Modal
            isOpen={isOpen}
            title="New task"
            description="Create a task to keep track of."
            onClose={resetAndClose}
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <LabelText>Subject</LabelText>
                    <select
                        className={styles.input}
                        value={form.subjectId}
                        onChange={event => updateField("subjectId", event.target.value)}
                        disabled={subjects.length === 0 || isSubmitting}
                    >
                        <option value="">
                            {subjects.length === 0 ? "No subjects available" : "Choose a subject"}
                        </option>
                        {subjects.map(subject => (
                            <option key={subject.id} value={subject.id}>
                                {subject.name}
                            </option>
                        ))}
                    </select>
                </label>

                <label className={styles.field}>
                    <LabelText>Title</LabelText>
                    <input
                        className={styles.input}
                        value={form.title}
                        onChange={event => updateField("title", event.target.value)}
                        placeholder="Homework exercises"
                        disabled={isSubmitting}
                    />
                </label>

                <label className={styles.field}>
                    <LabelText>Description</LabelText>
                    <textarea
                        className={styles.textarea}
                        value={form.description}
                        onChange={event => updateField("description", event.target.value)}
                        placeholder="Optional details"
                        disabled={isSubmitting}
                    />
                </label>

                <label className={styles.field}>
                    <LabelText>Deliver date</LabelText>
                    <input
                        className={styles.input}
                        type="date"
                        value={form.deliverDate}
                        onChange={event => updateField("deliverDate", event.target.value)}
                        disabled={isSubmitting}
                    />
                </label>

                {error ? <SmallText className={styles.error}>{error}</SmallText> : null}

                <div className={styles.actions}>
                    <button className={styles.button} type="button" onClick={resetAndClose} disabled={isSubmitting}>
                        Cancel
                    </button>
                    <button className={`${styles.button} ${styles.primaryButton}`} type="submit" disabled={isSubmitting}>
                        {isSubmitting ? "Creating..." : "Create task"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
