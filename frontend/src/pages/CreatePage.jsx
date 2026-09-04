import { useState } from "react";
import { useNavigate, Link } from "react-router";
import { ArrowLeftIcon } from "lucide-react";
import toast from "react-hot-toast";

import api from "../lib/axios";

const CreatePage = () => {
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();

    if (!trimmedTitle || !trimmedContent) {
      toast.error("Please fill in all fields");
      return;
    }

    if (trimmedTitle.length < 5) {
      toast.error("Title must be at least 5 characters");
      return;
    }

    if (trimmedContent.length < 10) {
      toast.error("Content must be at least 10 characters");
      return;
    }

    try {
      setIsLoading(true);

      await api.post("/notes", {
        title: trimmedTitle,
        content: trimmedContent,
      });

      toast.success("Note created successfully");

      navigate("/");
    } catch (error) {
      console.error("Create note error:", error);

      if (error.response?.status === 401) {
        toast.error("Please login to create a note");
      } else if (error.response?.status === 400) {
        toast.error(error.response?.data?.message || "Invalid note data");
      } else if (error.response?.status === 429) {
        toast.error("Too many requests. Please try again later.");
      } else {
        toast.error("Failed to create note. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
          </div>

          {/* Card */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h1 className="card-title text-2xl mb-4">Create New Note</h1>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Title</span>
                  </label>

                  <input
                    type="text"
                    placeholder="Note title"
                    className="input input-bordered w-full"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Content */}
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Content</span>
                  </label>

                  <textarea
                    placeholder="Write your note here..."
                    className="textarea textarea-bordered w-full h-40"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    disabled={isLoading}
                  />
                </div>

                {/* Submit */}
                <div className="card-actions justify-end">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isLoading}
                  >
                    {isLoading ? "Creating..." : "Create Note"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePage;
