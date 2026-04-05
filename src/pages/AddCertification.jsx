import { useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

function AddCertification() {
  const { addCertification, currentUser } = useContext(UserContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    issuer: "",
    issueDate: "",
    expiryDate: "",
    visibility: "public",
    description: "",
  });

  const [fileData, setFileData] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFileData({
        type: file.type,
        data: reader.result,
        name: file.name,
      });
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!currentUser) {
      setError("You must be logged in.");
      return;
    }

    if (new Date(formData.issueDate) > new Date(formData.expiryDate)) {
      setError("Expiry date must be after issue date.");
      return;
    }

    await addCertification({
      ...formData,
      ownerId: currentUser.id,
      ownerName: currentUser.name,
      renewalStatus: "none",
      renewalRequestDate: null,
      renewalHistory: [],
      likes: [],
      comments: [],
      verificationStatus: "pending",
verifiedBy: null,
verifiedAt: null,
      file: JSON.stringify(fileData),
      createdAt: new Date().toISOString(),
    });

    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-orange-50 to-yellow-50 
                    dark:from-gray-900 dark:to-gray-800 dark:text-white 
                    flex justify-center items-center p-10 transition-colors duration-300">

      <div className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-3xl shadow-lg p-10">

        <h1 className="text-2xl font-bold mb-8">
          Add New Certification
        </h1>

        {error && (
          <p className="text-red-500 mb-4">{error}</p>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>

          <input
            type="text"
            name="name"
            placeholder="Certification Name"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
            required
          />

          <input
            type="text"
            name="issuer"
            placeholder="Issuing Organization"
            value={formData.issuer}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
            required
          />

          <textarea
            name="description"
            placeholder="Certificate Description (optional)"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          />

          <div className="grid grid-cols-2 gap-4">
            <input
              type="date"
              name="issueDate"
              value={formData.issueDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
              required
            />

            <input
              type="date"
              name="expiryDate"
              value={formData.expiryDate}
              onChange={handleChange}
              className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
              required
            />
          </div>

          <select
            name="visibility"
            value={formData.visibility}
            onChange={handleChange}
            className="w-full p-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
          >
            <option value="private">Private</option>
            <option value="public">Public</option>
          </select>

          {/* FILE UPLOAD */}
          <div>
            <label className="block mb-2 font-medium">
              Upload Certificate (Image / PDF)
            </label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              className="w-full"
            />
          </div>

          {/* FILE PREVIEW */}
          {fileData && (
            <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
              <p className="text-sm mb-2">Preview:</p>

              {fileData.type.includes("image") && (
                <img
                  src={fileData.data}
                  alt="Preview"
                  className="max-h-60 rounded-xl"
                />
              )}

              {fileData.type.includes("pdf") && (
                <iframe
                  src={fileData.data}
                  className="w-full h-64 rounded-xl"
                  title="PDF Preview"
                />
              )}
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-white 
                       bg-gradient-to-r from-pink-500 to-orange-500 
                       hover:scale-105 transition"
          >
            Save Certification
          </button>

        </form>
      </div>
    </div>
  );
}

export default AddCertification;