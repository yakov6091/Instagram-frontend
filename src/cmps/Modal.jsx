

export function Modal({ children, isOpen, onClose }) {
    if (!isOpen) return null

    return (
        <div className="model-content" onClick={onClose}>
            <section className="modal-content" onClick={ev => ev.stopPropagation()}>
                {children}
            </section>
        </div>
    )
}