import { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { Link } from "react-router-dom";

function Directory() {
  const { users, certifications } = useContext(UserContext);
  const [search, setSearch] = useState("");

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  const getPublicCertCount = (userId) => {
    return certifications.filter(
      (cert) =>
        cert.ownerId === userId &&
        cert.visibility === "public"
    ).length;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 p-10">
      <div className="max-w-6xl mx-auto">

        <h1 className="text-4xl font-bold text-center text-purple-700 mb-10">
          Professional Directory
        </h1>

        {/* Search */}
        <div className="flex justify-center mb-10">
          <input
            type="text"
            placeholder="Search professionals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md p-3 rounded-2xl border shadow-sm"
          />
        </div>

        {/* User Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {filteredUsers.map((user) => (
            <div
              key={user.id}
              className="bg-white rounded-3xl shadow-lg p-6 hover:shadow-xl transition"
            >
              <div className="flex items-center gap-4">

                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200">
                  {user.profilePic ? (
                    <img
                      src={user.profilePic}
                      alt="profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-xl font-bold">
                      {user.name[0]}
                    </div>
                  )}
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-gray-800">
                    {user.name}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {user.role}
                  </p>
                </div>
              </div>

              <div className="mt-6 flex justify-between text-sm text-gray-600">
                <span>
                  {getPublicCertCount(user.id)} Public Certs
                </span>

                <Link
                  to={`/profile/${user.id}`}
                  className="text-purple-600 font-medium"
                >
                  View Profile →
                </Link>
              </div>

            </div>
          ))}

          {filteredUsers.length === 0 && (
            <p className="col-span-full text-center text-gray-500">
              No professionals found.
            </p>
          )}

        </div>

      </div>
    </div>
  );
}

export default Directory; 