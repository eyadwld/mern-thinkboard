import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router";
import { ArrowLeftIcon, Trash2Icon } from "lucide-react";
import toast from "react-hot-toast";

import RateLimitedUI from "../components/RateLimitedUI";
import Loader from "../components/Loader";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";

import api from "../lib/axios";

const NoteDetailPage = () => {
  const [note, setNote] = useState(null);

  const [isLoading, setIsLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [isRateLimited, setIsRateLimited] = useState(false);

  const [showModal, setShowModal] = useState(false);

  const [isDeleting, setIsDeleting] = useState(false);

  const navigate = useNavigate();

  const { id } = useParams();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        setIsLoading(true);

        const response = await api.get(`/notes/${id}`);

        setNote(response.data.note);

        setIsRateLimited(false);
      } catch (error) {
        console.error("Fetch note error:", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else if (error.response?.status === 404) {
          toast.error("Note not found");
        } else if (error.response?.status !== 401) {
          toast.error("Failed to fetch note. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleDelete = (e) => {
    e.preventDefault();
    e.stopPropagation();

    setShowModal(true);
  };

  const confirmDelete = async () => {
    try {
      setIsDeleting(true);

      await api.delete(`/notes/${id}`);

      setShowModal(false);

      toast.success("Note deleted successfully");

      navigate("/");
    } catch (error) {
      console.error("Delete error:", error);

      if (error.response?.status === 404) {
        toast.error("Note not found");
      } else if (error.response?.status === 403) {
        toast.error("You are not allowed to delete this note");
      } else if (error.response?.status !== 401) {
        toast.error("Failed to delete note");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  const handleSave = async () => {
    if (!note) return;

    const title = note.title.trim();
    const content = note.content.trim();

    if (!title || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    if (title.length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }

    if (content.length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    try {
      setSaving(true);

      await api.put(`/notes/${id}`, {
        title,
        content,
      });

      toast.success("Note updated successfully");

      navigate("/");
    } catch (error) {
      console.error("Update error:", error);

      if (error.response?.status === 404) {
        toast.error("Note not found");
      } else if (error.response?.status === 403) {
        toast.error("You are not allowed to update this note");
      } else if (error.response?.status !== 401) {
        toast.error("Failed to update note");
      }
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="min-h-screen bg-base-200">
        {isRateLimited ? (
          <RateLimitedUI />
        ) : isLoading ? (
          <Loader />
        ) : !note ? (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              <Link to="/" className="btn btn-ghost">
                <ArrowLeftIcon className="h-5 w-5" />
                Back to Notes
              </Link>
            </div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-8">
            <div className="max-w-2xl mx-auto">
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <Link to="/" className="btn btn-ghost">
                  <ArrowLeftIcon className="h-5 w-5" />
                  Back to Notes
                </Link>

                <button
                  onClick={handleDelete}
                  className="btn btn-error btn-outline"
                  disabled={isDeleting}
                >
                  <Trash2Icon className=" size-5" />
                  Delete Note
                </button>
              </div>

              {/* Note */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  {/* Title */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Title</span>
                    </label>

                    <input
                      type="text"
                      placeholder="Note title"
                      className="input input-bordered w-full"
                      value={note.title}
                      onChange={(e) =>
                        setNote({
                          ...note,
                          title: e.target.value,
                        })
                      }
                      disabled={saving}
                    />
                  </div>

                  {/* Content */}
                  <div className="form-control mb-4">
                    <label className="label">
                      <span className="label-text">Content</span>
                    </label>

                    <textarea
                      placeholder="Write your note here..."
                      className="textarea textarea-bordered w-full h-32"
                      value={note.content}
                      onChange={(e) =>
                        setNote({
                          ...note,
                          content: e.target.value,
                        })
                      }
                      disabled={saving}
                    />
                  </div>

                  {/* Save */}
                  <div className="card-actions justify-end mt-2">
                    <button
                      className="btn btn-primary"
                      disabled={saving}
                      onClick={handleSave}
                    >
                      {saving ? "Saving..." : "Save Changes"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ConfirmDeleteModal
        isOpen={showModal}
        title="Delete Note?"
        message={`Are you sure you want to delete "${note?.title}"? This action cannot be undone.`}
        isDeleting={isDeleting}
        onCancel={() => setShowModal(false)}
        onConfirm={confirmDelete}
      />
    </>
  );
};

export default NoteDetailPage;
