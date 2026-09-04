import { useEffect, useState } from "react";
import { Link } from "react-router";
import toast from "react-hot-toast";

import RateLimitedUI from "../components/RateLimitedUI";
import NavBar from "../components/NavBar";
import Loader from "../components/Loader";
import NoteCart from "../components/NoteCart";
import NoteNotFound from "../components/NoteNotFound";

import api from "../lib/axios";
import { useAuth } from "../context/AuthContext";

const HomePage = () => {
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [notes, setNotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const { isAuthenticated } = useAuth();

  useEffect(() => {
    // Don't fetch if user is not authenticated (route is now protected)
    if (!isAuthenticated) {
      setIsLoading(false);
      return;
    }

    const fetchNotes = async () => {
      try {
        const response = await api.get("/notes");

        setNotes(response.data.notes);

        setIsRateLimited(false);
      } catch (error) {
        console.error("Error fetching notes:", error);

        if (error.response?.status === 429) {
          setIsRateLimited(true);
        } else if (error.response?.status !== 401) {
          toast.error("Failed to fetch notes. Please try again later.");
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotes();
  }, [isAuthenticated]);

  return (
    <div className="min-h-screen">
      <NavBar />

      {isRateLimited ? (
        <RateLimitedUI />
      ) : isLoading ? (
        <Loader />
      ) : !isAuthenticated ? (
        /* Guest landing — user is not logged in */
        <div className="flex flex-col items-center justify-center py-24 space-y-6 text-center px-4">
          <h2 className="text-4xl font-bold">Welcome to TextBoard</h2>
          <p className="text-base-content/70 max-w-md text-lg">
            Organize your thoughts, ideas, and notes — all in one place.
          </p>
          <div className="flex gap-4">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/signup" className="btn btn-outline btn-primary">
              Sign Up
            </Link>
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-4 mt-6">
          {notes.length === 0 && <NoteNotFound />}

          {notes.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {notes.map((note) => (
                <NoteCart
                  key={note._id}
                  note={note}
                  onDelete={(deletedId) => {
                    setNotes((prevNotes) =>
                      prevNotes.filter((note) => note._id !== deletedId),
                    );
                  }}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default HomePage;
