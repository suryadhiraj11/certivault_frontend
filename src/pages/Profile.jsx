import { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";

const MAX_PROFILE_IMAGE_SIZE_MB = 5;

const readFileAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const resizeImageToDataUrl = (file, maxWidth = 512, maxHeight = 512, quality = 0.8) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const ratio = Math.min(maxWidth / img.width, maxHeight / img.height, 1);
        const width = Math.round(img.width * ratio);
        const height = Math.round(img.height * ratio);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Failed to process image."));
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const parseCertFile = (file) => {
  if (!file) return {};
  if (typeof file === "string") {
    try {
      return JSON.parse(file);
    } catch {
      return {};
    }
  }
  return file;
};

function Profile() {
  const {
    currentUser,
    certifications,
    updateProfile,
    changePassword,
    updateCertification,
    deleteCertification,
  } = useContext(UserContext);

  const [editMode, setEditMode] = useState(false);
  const [newName, setNewName] = useState(currentUser?.name || "");
  const [newPassword, setNewPassword] = useState("");
  const [profilePic, setProfilePic] = useState(
    currentUser?.profilePic || null
  );
  const [selectedCert, setSelectedCert] = useState(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    setNewName(currentUser.name || "");
    setProfilePic(currentUser.profilePic || null);
  }, [currentUser?.id, currentUser?.name, currentUser?.profilePic]);

  if (!currentUser) return null;

  const userCerts = certifications.filter(
    (cert) => cert.ownerId === currentUser.id
  );

  const totalLikes = userCerts.reduce(
    (sum, cert) => sum + (cert.likes?.length || 0),
    0
  );
  const totalComments = userCerts.reduce(
    (sum, cert) => sum + (cert.comments?.length || 0),
    0
  );

  const handleProfileUpdate = async () => {
    if (!newName.trim()) {
      alert("Name cannot be empty.");
      return;
    }

    const payload = {
      name: newName.trim(),
    };

    if (profilePic !== (currentUser.profilePic || null)) {
      payload.profilePic = profilePic;
    }

    setIsSavingProfile(true);
    const result = await updateProfile(payload);
    setIsSavingProfile(false);

    if (!result || result.error) {
      alert(result?.error || "Failed to update profile.");
      return;
    }

    setEditMode(false);
    alert("Profile updated");
  };

  const handlePasswordChange = () => {
    if (!newPassword) return;
    changePassword(newPassword);
    setNewPassword("");
    alert("Password updated");
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file for profile picture.");
      return;
    }

    if (file.size > MAX_PROFILE_IMAGE_SIZE_MB * 1024 * 1024) {
      alert("Image is too large. Please choose an image under 5MB.");
      return;
    }

    try {
      const compressedDataUrl = await resizeImageToDataUrl(file);
      setProfilePic(compressedDataUrl);
    } catch {
      const fallbackDataUrl = await readFileAsDataUrl(file);
      setProfilePic(fallbackDataUrl);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 px-4 py-8 sm:px-6 lg:px-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* PROFILE HEADER */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
          <div className="h-24 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-400" />
          <div className="p-8 flex flex-col md:flex-row gap-8 items-start md:items-center">

            <div className="-mt-16 w-28 h-28 rounded-full overflow-hidden bg-gray-200 ring-4 ring-white shadow-lg">
              {profilePic ? (
                <img
                  src={profilePic}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-3xl font-bold text-white bg-gradient-to-br from-purple-500 to-pink-500">
                  {currentUser.name[0]}
                </div>
              )}
            </div>

            <div className="flex-1">
              {editMode ? (
                <>
                  <input
                    value={newName}
                    onChange={(e) =>
                      setNewName(e.target.value)
                    }
                    className="border-2 border-gray-200 focus:border-purple-400 rounded-xl px-4 py-2 w-full md:w-2/3"
                  />

                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="block mt-3 text-sm text-gray-500"
                  />

                  <div className="mt-4 flex gap-3">
                    <button
                      onClick={handleProfileUpdate}
                      disabled={isSavingProfile}
                      className="px-5 py-2 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition"
                    >
                      {isSavingProfile ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={() => setEditMode(false)}
                      className="px-5 py-2 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {currentUser.name}
                  </h1>
                  <p className="text-gray-500">
                    {currentUser.email}
                  </p>
                  <button
                    onClick={() => setEditMode(true)}
                    className="mt-3 inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium"
                  >
                    Edit Profile
                  </button>
                </>
              )}
            </div>

            <div className="grid grid-cols-3 gap-4 w-full md:w-auto">
              <div className="bg-purple-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-purple-700">
                  {userCerts.length}
                </div>
                <div className="text-xs text-purple-600">Certs</div>
              </div>
              <div className="bg-pink-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-pink-700">
                  {totalLikes}
                </div>
                <div className="text-xs text-pink-600">Likes</div>
              </div>
              <div className="bg-orange-50 rounded-2xl p-4 text-center">
                <div className="text-2xl font-bold text-orange-700">
                  {totalComments}
                </div>
                <div className="text-xs text-orange-600">Comments</div>
              </div>
            </div>
          </div>
        </div>

        {/* CHANGE PASSWORD */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <h3 className="font-semibold text-gray-800 mb-4">
            Change Password
          </h3>

          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) =>
                setNewPassword(e.target.value)
              }
              className="flex-1 border-2 border-gray-200 focus:border-orange-400 rounded-xl px-4 py-2"
            />

            <button
              onClick={handlePasswordChange}
              className="px-5 py-2 bg-orange-500 text-white rounded-xl hover:bg-orange-600 transition"
            >
              Update Password
            </button>
          </div>
        </div>

        {/* CERTIFICATIONS */}
        <div className="mt-2">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">
              Your Certifications
            </h2>
            <span className="text-sm text-gray-500">
              {userCerts.length} total
            </span>
          </div>

          {userCerts.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center shadow-md">
              <p className="text-gray-500">
                No certifications yet. Add your first one to get started.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {userCerts.map((cert, index) => (
                <CertificationCard
                  key={index}
                  cert={cert}
                  index={index}
                  updateCertification={updateCertification}
                  deleteCertification={deleteCertification}
                  onViewDetails={() => setSelectedCert(cert)}
                />
              ))}
            </div>
          )}
        </div>

      </div>

      {/* Certificate Detail Modal */}
      {selectedCert && (
        <CertificateDetailModal
          cert={selectedCert}
          onClose={() => setSelectedCert(null)}
        />
      )}
    </div>
  );
}

function CertificationCard({
  cert,
  index,
  updateCertification,
  deleteCertification,
  onViewDetails,
}) {
  const [edit, setEdit] = useState(false);
  const [name, setName] = useState(cert.name);
  const [issuer, setIssuer] = useState(cert.issuer);

  const saveEdit = () => {
    updateCertification(index, {
      ...cert,
      name,
      issuer,
    });
    setEdit(false);
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow border border-gray-100">
      <div className="flex items-start justify-between">
        <div>
          {edit ? (
            <>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border-2 border-gray-200 focus:border-purple-400 rounded-xl px-3 py-2 mr-2"
              />
              <input
                value={issuer}
                onChange={(e) => setIssuer(e.target.value)}
                className="border-2 border-gray-200 focus:border-purple-400 rounded-xl px-3 py-2"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800">
                {cert.name}
              </h3>
              <p className="text-gray-500 text-sm">
                Issued by {cert.issuer}
              </p>
            </>
          )}
        </div>

        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">
          {cert.visibility}
        </span>
      </div>

      <div className="flex gap-6 mt-4 text-sm text-gray-500">
        <span>Likes: {cert.likes?.length || 0}</span>
        <span>Comments: {cert.comments?.length || 0}</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          onClick={onViewDetails}
          className="px-4 py-2 rounded-xl bg-purple-50 text-purple-700 hover:bg-purple-100 transition"
        >
          View Details
        </button>

        {edit ? (
          <button
            onClick={saveEdit}
            className="px-4 py-2 rounded-xl bg-green-500 text-white hover:bg-green-600 transition"
          >
            Save
          </button>
        ) : (
          <button
            onClick={() => setEdit(!edit)}
            className="px-4 py-2 rounded-xl border border-blue-200 text-blue-600 hover:bg-blue-50"
          >
            Edit
          </button>
        )}

        <button
          onClick={() => deleteCertification(index)}
          className="px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>

    </div>
  );
}

function CertificateDetailModal({ cert, onClose }) {
  const file = parseCertFile(cert.file);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Certificate Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-500 font-medium">Certificate Name</label>
            <p className="text-lg font-semibold text-gray-800">{cert.name}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Issuing Organization</label>
            <p className="text-gray-800">{cert.issuer}</p>
          </div>

          {cert.description && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Description</label>
              <p className="text-gray-800">{cert.description}</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-500 font-medium">Issue Date</label>
              <p className="text-gray-800">{cert.issueDate}</p>
            </div>
            <div>
              <label className="text-sm text-gray-500 font-medium">Expiry Date</label>
              <p className="text-gray-800">{cert.expiryDate}</p>
            </div>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Certificate ID</label>
            <p className="text-gray-800 font-mono text-sm">{cert.certificateId}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Visibility</label>
            <p className="text-gray-800 capitalize">{cert.visibility}</p>
          </div>

          <div>
            <label className="text-sm text-gray-500 font-medium">Verification Status</label>
            <div className="flex items-center gap-2 mt-1">
              {cert.verificationStatus === "verified" && (
                <span className="text-green-600 font-semibold bg-green-100 px-3 py-1 rounded-full">
                  ✔ Verified
                </span>
              )}
              {cert.verificationStatus === "pending" && (
                <span className="text-yellow-600 font-semibold bg-yellow-100 px-3 py-1 rounded-full">
                  ⏳ Pending Verification
                </span>
              )}
              {cert.verificationStatus === "rejected" && (
                <span className="text-red-600 font-semibold bg-red-100 px-3 py-1 rounded-full">
                  ❌ Rejected
                </span>
              )}
            </div>
          </div>

          {cert.verifiedBy && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Verified At</label>
              <p className="text-gray-800">{new Date(cert.verifiedAt).toLocaleString()}</p>
            </div>
          )}

          <div>
            <label className="text-sm text-gray-500 font-medium">Renewal Status</label>
            <div className="mt-1">
              {cert.renewalStatus === "pending" && (
                <span className="text-yellow-600 font-medium">🕒 Renewal Request Pending</span>
              )}
              {cert.renewalStatus === "approved" && (
                <span className="text-green-600 font-medium">✅ Renewal Approved</span>
              )}
              {cert.renewalStatus === "rejected" && (
                <span className="text-red-600 font-medium">❌ Renewal Rejected</span>
              )}
              {(!cert.renewalStatus || cert.renewalStatus === "none") && (
                <span className="text-gray-600">No renewal request</span>
              )}
            </div>
          </div>

          {cert.renewalHistory && cert.renewalHistory.length > 0 && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Renewal History</label>
              <div className="mt-2 space-y-2">
                {cert.renewalHistory.map((renewal, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-lg text-sm">
                    <p><strong>Approved:</strong> {new Date(renewal.approvedOn).toLocaleDateString()}</p>
                    <p><strong>Previous Expiry:</strong> {renewal.previousExpiry}</p>
                    <p><strong>New Expiry:</strong> {renewal.newExpiry}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {cert.likes && cert.likes.length > 0 && (
            <div>
              <label className="text-sm text-gray-500 font-medium">Social Engagement</label>
              <div className="flex gap-6 mt-2 text-sm text-gray-600">
                <span>👍 {cert.likes?.length || 0} likes</span>
                <span>💬 {cert.comments?.length || 0} comments</span>
              </div>
            </div>
          )}

          {/* FILE PREVIEW */}
          {cert.file && (
            <div>
              <label className="text-sm text-gray-500 font-medium block mb-2">Certificate File</label>
              {file.type?.includes("image") && (
                <img
                  src={file.data}
                  alt="certificate"
                  className="rounded-2xl max-h-96 w-full object-contain border"
                />
              )}
              {file.type?.includes("pdf") && (
                <iframe
                  src={file.data}
                  className="w-full h-[500px] rounded-xl border"
                  title="PDF Preview"
                />
              )}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="mt-6 w-full py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-semibold hover:scale-105 transition"
        >
          Close
        </button>
      </div>
    </div>
  );
}

export default Profile;