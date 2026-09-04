const ConfirmDeleteModal = ({
  isOpen,
  title = "Delete Item?",
  message = "Are you sure you want to delete this item? This action cannot be undone.",
  isDeleting = false,
  onCancel,
  onConfirm,
}) => {
  if (!isOpen) return null;

  return (
    <dialog open className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <h3 className="text-lg font-bold">{title}</h3>

        <p className="py-4 text-base-content/70">{message}</p>

        <div className="modal-action">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={onCancel}
            disabled={isDeleting}
          >
            Cancel
          </button>

          <button
            type="button"
            className="btn btn-error"
            onClick={onConfirm}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <span className="loading loading-spinner loading-sm" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </div>
    </dialog>
  );
};

export default ConfirmDeleteModal;
