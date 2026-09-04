import { Link } from "react-router";
import { PlusIcon, LogInIcon, UserPlusIcon, LogOutIcon } from "lucide-react";

import { useAuth } from "../context/AuthContext";

const NavBar = () => {
  const { isAuthenticated, logout } = useAuth();

  return (
    <header className="bg-base-300 border-b border-base-content/10">
      <div className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="text-3xl font-bold text-primary font-mono tracking-tight"
          >
            TextBoard
          </Link>

          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                {/* New Note */}
                <Link to="/create" className="btn btn-primary">
                  <PlusIcon className="size-5" />

                  <span>New Note</span>
                </Link>

                {/* Logout */}
                <button onClick={logout} className="btn btn-outline btn-error">
                  <LogOutIcon className="size-5" />

                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                {/* Login */}
                <Link to="/login" className="btn btn-outline btn-primary">
                  <LogInIcon className="size-5" />

                  <span>Login</span>
                </Link>

                {/* Sign Up */}
                <Link to="/signup" className="btn btn-primary">
                  <UserPlusIcon className="size-5" />

                  <span>Sign Up</span>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default NavBar;
