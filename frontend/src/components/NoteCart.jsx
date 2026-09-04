import { PenSquareIcon, Trash2Icon } from "lucide-react";
import { Link } from "react-router";
import { useState } from "react";
import toast from "react-hot-toast";
import { formatDate } from "../lib/utils";
import api from "../lib/axios";
import ConfirmDeleteModal from "./ConfirmDeleteModal";

const NoteCart = ({ note, onDelete }) => {
  const [showModal, setShowModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      await api.delete(`/notes/${note._id}`);

      onDelete(note._id);

      setShowModal(false);

      toast.success("Note deleted successfully");
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Failed to delete note");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <Link
        to={`/note/${note._id}`}
        className="card border-t-4 border-solid border-[#00FF9D] transition-all duration-200 hover:shadow-lg"
      >
        <div className="card-body bg-base-300">
          <h3 className="card-title text-base-content">{note.title}</h3>

          <p className="text-base-content/70 line-clamp-3">{note.content}</p>

          <div className="card-actions mt-4 flex items-center justify-between">
            <span className="text-sm text-base-content/60">
              {formatDate(note.createdAt)}
            </span>

            <div className="flex items-center gap-1">
              <PenSquareIcon className="size-4" />

              <button
                type="button"
                className="btn btn-ghost btn-xs text-error"
                onClick={handleDelete}
              >
                <Trash2Icon className="size-4" />
              </button>
            </div>
          </div>
        </div>
      </Link>

      <ConfirmDeleteModal
        isOpen={showModal}
        title="Delete Note?"
        message={`Are you sure you want to delete "${note.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default NoteCart;
