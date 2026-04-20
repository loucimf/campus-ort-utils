import { useState } from "react";
import type { FormEvent } from "react";
import { Modal } from "./Modal";
import { LabelText, SmallText } from "./Texts";
import styles from "@styles/components/NewTaskModal.module.css";

export interface NewTaskFormValues {
    subjectId: number;
    title: string;
    description: string | null;
    deliverDate: string;
}

interface NewTaskModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateTask: (task: NewTaskFormValues) => void;
}

const initialForm = {
    subjectId: "",
    title: "",
    description: "",
    deliverDate: "",
};

export function NewTaskModal({ isOpen, onClose, onCreateTask }: NewTaskModalProps) {
    const [form, setForm] = useState(initialForm);
    const [error, setError] = useState("");

    function updateField(field: keyof typeof form, value: string) {
        setForm(currentForm => ({
            ...currentForm,
            [field]: value,
        }));
    }

    function resetAndClose() {
        setForm(initialForm);
        setError("");
        onClose();
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const subjectId = Number(form.subjectId);

        if (!Number.isInteger(subjectId) || subjectId <= 0) {
            setError("Subject ID must be a positive number.");
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

        onCreateTask({
            subjectId,
            title: form.title.trim(),
            description: form.description.trim() || null,
            deliverDate: form.deliverDate,
        });

        resetAndClose();
    }

    return (
        <Modal
            isOpen={isOpen}
            title="New task"
            description="Create a task for the signed-in user."
            onClose={resetAndClose}
        >
            <form className={styles.form} onSubmit={handleSubmit}>
                <label className={styles.field}>
                    <LabelText>Subject ID</LabelText>
                    <input
                        className={styles.input}
                        type="number"
                        min="1"
                        value={form.subjectId}
                        onChange={event => updateField("subjectId", event.target.value)}
                        placeholder="1"
                    />
                </label>

                <label className={styles.field}>
                    <LabelText>Title</LabelText>
                    <input
                        className={styles.input}
                        value={form.title}
                        onChange={event => updateField("title", event.target.value)}
                        placeholder="Homework exercises"
                    />
                </label>

                <label className={styles.field}>
                    <LabelText>Description</LabelText>
                    <textarea
                        className={styles.textarea}
                        value={form.description}
                        onChange={event => updateField("description", event.target.value)}
                        placeholder="Optional details"
                    />
                </label>

                <label className={styles.field}>
                    <LabelText>Deliver date</LabelText>
                    <input
                        className={styles.input}
                        type="date"
                        value={form.deliverDate}
                        onChange={event => updateField("deliverDate", event.target.value)}
                    />
                </label>

                {error ? <SmallText className={styles.error}>{error}</SmallText> : null}

                <div className={styles.actions}>
                    <button className={styles.button} type="button" onClick={resetAndClose}>
                        Cancel
                    </button>
                    <button className={`${styles.button} ${styles.primaryButton}`} type="submit">
                        Create task
                    </button>
                </div>
            </form>
        </Modal>
    );
}

