

export function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <modal className="model-content" onClick={onClose}>
            <section className="modal-content" onClick={ev => ev.stopPropagation()}>
                {children}
            </section>
        </modal>
    )
}