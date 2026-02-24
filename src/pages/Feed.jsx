import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Feed() {
  const {
    certifications,
    users,
    setCertifications,
    currentUser,
    deleteCertification,
  } = useContext(UserContext);

  const getUserById = (id) =>
    users.find((u) => u.id === id);

  const handleLike = (certId) => {
    if (!currentUser) {
      alert("Login to like");
      return;
    }

    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      const alreadyLiked =
        cert.likes?.includes(currentUser.id);

      return {
        ...cert,
        likes: alreadyLiked
          ? cert.likes.filter(
              (id) => id !== currentUser.id
            )
          : [...(cert.likes || []), currentUser.id],
      };
    });

    setCertifications(updated);
  };

  const handleComment = (certId, text) => {
    if (!currentUser) {
      alert("Login to comment");
      return;
    }

    const updated = certifications.map((cert) => {
      if (cert.id !== certId) return cert;

      return {
        ...cert,
        comments: [
          ...(cert.comments || []),
          {
            userId: currentUser.id,
            text,
          },
        ],
      };
    });

    setCertifications(updated);
  };

  const handleDelete = (certId) => {
    if (!window.confirm("Delete this certification?")) return;
    deleteCertification(certId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 
                    dark:from-gray-900 dark:to-gray-800 
                    dark:text-white py-8 px-4 sm:px-6 lg:px-10 transition-colors duration-300">

      {/* Enhanced Header */}
      <div className="max-w-4xl mx-auto mb-10">
        <div className="text-center space-y-3">
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
            Certification Feed
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            Discover and celebrate verified achievements from the community
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {certifications.map((cert) => {
          if (cert.visibility !== "public") return null;

          const owner = getUserById(cert.ownerId);
          if (!owner) return null;

          const liked =
            currentUser &&
            cert.likes?.includes(currentUser.id);

          const canDelete =
            currentUser &&
            (currentUser.id === cert.ownerId ||
              currentUser.role === "admin");

          return (
            <div
              key={cert.id}
              className="bg-white dark:bg-gray-800 rounded-3xl shadow-md hover:shadow-2xl 
                         transition-all duration-300 overflow-hidden border border-gray-100 
                         dark:border-gray-700 transform hover:-translate-y-1"
            >
              {/* HEADER */}
              <div className="flex justify-between items-start p-6 pb-4 border-b border-gray-100 dark:border-gray-700">
                <Link
                  to={`/profile/${owner.id}`}
                  className="flex items-center gap-3 group"
                >
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-purple-400 to-pink-400 
                                  ring-2 ring-purple-200 dark:ring-purple-800 transition-transform group-hover:scale-110">
                    {owner.profilePic ? (
                      <img
                        src={owner.profilePic}
                        alt="profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full font-bold text-white text-lg">
                        {owner.name[0]}
                      </div>
                    )}
                  </div>

                  <div>
                    <span className="font-bold text-gray-800 dark:text-white group-hover:text-purple-600 
                                     dark:group-hover:text-purple-400 transition-colors block">
                      {owner.name}
                    </span>
                    <span className="text-xs text-gray-500 dark:text-gray-400">
                      {cert.createdAt ? new Date(cert.createdAt).toLocaleDateString('en-US', { 
                        month: 'short', 
                        day: 'numeric', 
                        year: 'numeric' 
                      }) : 'Recently'}
                    </span>
                  </div>
                </Link>

                {canDelete && (
                  <button
                    onClick={() => handleDelete(cert.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-lg 
                               hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Delete"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                )}
              </div>

              {/* CERT INFO */}
              <div className="p-6 pt-4">
                <h2 className="text-xl font-bold mt-2 text-gray-800 dark:text-white flex items-center gap-2 flex-wrap">
                  {cert.name}

                  {cert.verificationStatus === "verified" && (
                    <span className="text-green-600 text-sm font-semibold bg-green-100 dark:bg-green-900/50 
                                     dark:text-green-400 px-3 py-1 rounded-full inline-flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Verified
                    </span>
                  )}

                  {cert.verificationStatus === "pending" && (
                    <span className="text-yellow-600 text-xs font-medium bg-yellow-100 dark:bg-yellow-900/50 
                                     dark:text-yellow-400 px-2 py-1 rounded-full">
                      ⏳ Pending
                    </span>
                  )}
                </h2>

                <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-300">
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="font-medium">{cert.issuer}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Expires: {cert.expiryDate}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 font-mono">
                  ID: {cert.certificateId}
                </p>

              {/* FILE PREVIEW */}
              {cert.file && (
                <div className="mt-6 rounded-2xl overflow-hidden bg-gray-50 dark:bg-gray-900/50 p-2">
                  {cert.file.type.includes("image") && (
                    <img
                      src={cert.file.data}
                      alt="certificate"
                      className="rounded-xl max-h-96 w-full object-contain"
                    />
                  )}

                  {cert.file.type.includes("pdf") && (
                    <iframe
                      src={cert.file.data}
                      className="w-full h-[400px] rounded-xl"
                      title="PDF Preview"
                    />
                  )}
                </div>
              )}

              {/* ENGAGEMENT SECTION */}
              <div className="mt-6 pt-4 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <button
                    onClick={() => handleLike(cert.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-medium transition-all 
                               ${liked 
                                 ? "bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400" 
                                 : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                               }`}
                  >
                    {liked ? (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    )}
                    <span>{(cert.likes || []).length}</span>
                  </button>

                  <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <span>{(cert.comments || []).length} {(cert.comments || []).length === 1 ? 'comment' : 'comments'}</span>
                  </div>
                </div>

              {/* COMMENTS SECTION */}
              <div className="mt-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  Comments
                </h3>

                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {(cert.comments || []).length === 0 && (
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic text-center py-4">
                      No comments yet. Be the first to comment!
                    </p>
                  )}

                  {(cert.comments || []).map((c, i) => {
                    const commentUser = getUserById(c.userId);

                    return (
                      <div
                        key={i}
                        className="bg-gray-50 dark:bg-gray-700/50 p-3 rounded-xl flex gap-3 
                                   hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                      >
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 
                                        flex items-center justify-center text-white text-sm font-bold flex-shrink-0">
                          {commentUser?.name?.[0] || '?'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-purple-600 dark:text-purple-400 text-sm">
                            {commentUser?.name || 'Unknown User'}
                          </span>
                          <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 break-words">{c.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <CommentInput
                  onSubmit={(text) => handleComment(cert.id, text)}
                />
              </div>
              </div>
            </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CommentInput({ onSubmit }) {
  const [text, setText] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onSubmit(text);
    setText("");
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-3 bg-white dark:bg-gray-700 border-2 border-gray-200 
                     dark:border-gray-600 rounded-full focus:outline-none focus:border-purple-400 
                     dark:focus:border-purple-500 transition-colors text-sm
                     placeholder:text-gray-400 dark:placeholder:text-gray-500"
        />
        <button
          type="submit"
          disabled={!text.trim()}
          className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                     rounded-full font-medium hover:from-purple-600 hover:to-pink-600 
                     transition-all shadow-md hover:shadow-lg disabled:opacity-50 
                     disabled:cursor-not-allowed disabled:hover:from-purple-500 
                     disabled:hover:to-pink-500 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
          <span className="hidden sm:inline">Post</span>
        </button>
      </div>
    </form>
  );
}

export default Feed;