import type { ReactNode } from "react";
import { useEffect } from "react";
import { SystemIcon } from "@src/design/system/SystemIcon";
import { BodyText, SectionTitle } from "./Texts";
import styles from "@styles/components/Modal.module.css";

interface ModalProps {
    isOpen: boolean;
    title: string;
    description?: string;
    children: ReactNode;
    onClose: () => void;
}

export function Modal({ isOpen, title, description, children, onClose }: ModalProps) {
    useEffect(() => {
        if (!isOpen) {
            return;
        }

        function handleKeyDown(event: KeyboardEvent) {
            if (event.key === "Escape") {
                onClose();
            }
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) {
        return null;
    }

    return (
        <div className={styles.backdrop} onMouseDown={onClose}>
            <section
                className={styles.modal}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
                onMouseDown={event => event.stopPropagation()}
            >
                <header className={styles.header}>
                    <div>
                        <SectionTitle id="modal-title">{title}</SectionTitle>
                        {description ? (
                            <BodyText tone="secondary" style={{ marginTop: "var(--space-xs)" }}>
                                {description}
                            </BodyText>
                        ) : null}
                    </div>
                    <button className={styles.closeButton} type="button" onClick={onClose} aria-label="Close modal">
                        <SystemIcon type="delete" color="currentColor" size="small" />
                    </button>
                </header>
                <div className={styles.content}>{children}</div>
            </section>
        </div>
    );
}

