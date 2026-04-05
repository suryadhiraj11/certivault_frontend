import { createContext, useState, useEffect } from "react";
import API from "../api";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  });

export const UserContext = createContext();

export function UserProvider({ children }) {

  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [certifications, setCertifications] = useState([]);

  // ================= LOAD DATA =================

  const fetchUsers = async () => {
    try {
      const res = await API.get("/auth/users");
      setUsers(res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCerts();
    fetchUsers();
  }, []);

  const fetchCerts = async () => {
    try {
      const res = await API.get("/certificates");

      const parsed = res.data.map(cert => ({
        ...cert,
        likes: JSON.parse(cert.likes || "[]"),
        comments: JSON.parse(cert.comments || "[]"),
        file: cert.file || null
      }));

      setCertifications(parsed);
    } catch (err) {
      console.error(err);
    }
  };

  // ================= AUTH =================

  const signup = async (name, email, password, role) => {
    try {
      const res = await API.post("/auth/register", {
        name,
        email,
        password,
        role
      });

      if (res.data.error) return { error: res.data.error };

      const user = res.data.user;

      setCurrentUser(user);
      setUsers(prev => [...prev, user]);

      return { success: true };

    } catch {
      return { error: "Server error" };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await API.post("/auth/login", {
        email,
        password
      });

      if (res.data.error) return { error: res.data.error };

      const user = res.data.user;

      setCurrentUser(user);
      setUsers(prev => {
        const exists = prev.some(u => String(u.id) === String(user.id));
        if (!exists) return [...prev, user];

        return prev.map(u =>
          String(u.id) === String(user.id) ? user : u
        );
      });

      return { success: true, user };

    } catch {
      return { error: "Server error" };
    }
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // ================= CERTIFICATIONS =================

  const addCertification = async (cert) => {
    try {
      const payload = {
        ...cert,
        likes: JSON.stringify(cert.likes || []),
        comments: JSON.stringify(cert.comments || [])
      };

      await API.post("/certificates", payload);

      fetchCerts(); // 🔥 FIX
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCertification = async (certId) => {
    await API.delete(`/certificates/${certId}`);
    fetchCerts();
  };

  const updateCertification = async (id, cert) => {
    await API.put(`/certificates/${id}`, cert);
    fetchCerts();
  };

  // ================= VERIFICATION =================

  const verifyCertificate = async (certId) => {
    await API.put(`/certificates/${certId}/verify?adminId=${currentUser.id}`);
    fetchCerts();
  };

  const rejectCertificate = async (certId) => {
    await API.put(`/certificates/${certId}/reject`);
    fetchCerts();
  };

  // ================= RENEWAL =================

  const requestRenewal = async (certId) => {
    await API.put(`/certificates/${certId}/renew`);
    fetchCerts();
  };

  const approveRenewal = async (certId, newExpiryDate) => {
    await API.put(`/certificates/${certId}/approve-renewal?expiryDate=${newExpiryDate}`);
    fetchCerts();
  };

  const rejectRenewal = async (certId) => {
    await API.put(`/certificates/${certId}/reject-renewal`);
    fetchCerts();
  };

  // ================= SOCIAL FEATURES =================

  const toggleLike = async (certId) => {
    if (!currentUser) return;

    const cert = certifications.find(c => String(c.id) === String(certId));
    if (!cert) return;

    let likes = [];

    if (Array.isArray(cert.likes)) {
      likes = cert.likes;
    } else if (typeof cert.likes === "string") {
      try {
        likes = JSON.parse(cert.likes);
      } catch {
        likes = [];
      }
    }

    const currentUserId = String(currentUser.id);

    const alreadyLiked = likes.some(id => String(id) === currentUserId);

    const updatedLikes = alreadyLiked
      ? likes.filter(id => String(id) !== currentUserId)
      : [...likes, currentUser.id];

    try {
      await API.put(`/certificates/${certId}/likes`, {
        likes: JSON.stringify(updatedLikes)
      });

      fetchCerts();
    } catch (err) {
      console.error(err);
    }
  };

  const addComment = async (certId, text) => {
    if (!currentUser) return;

    const cert = certifications.find(c => c.id === certId);

    const updatedComments = [
      ...cert.comments,
      {
        userId: currentUser.id,
        text,
        createdAt: new Date().toISOString()
      }
    ];

    await API.put(`/certificates/${certId}/comments`, {
      comments: JSON.stringify(updatedComments)
    });

    fetchCerts();
  };

  // ================= PROFILE =================

  const updateProfile = async (data) => {
    if (!currentUser) return { error: "You must be logged in." };

    try {
      const payload = { ...data };

      // Backend expects profilePic as base64 string, never File/Blob objects.
      if (payload.profilePic && typeof payload.profilePic !== "string") {
        payload.profilePic = await toBase64(payload.profilePic);
      }

      const res = await API.put(`/auth/update-profile/${currentUser.id}`, payload);
      const updatedUser = res.data;

      if (!updatedUser || updatedUser.id == null) {
        return { error: "Invalid profile response from server." };
      }

      setCurrentUser(updatedUser);
      setUsers(prev => {
        const exists = prev.some(u => String(u.id) === String(updatedUser.id));
        if (!exists) return [...prev, updatedUser];

        return prev.map(u =>
          String(u.id) === String(updatedUser.id) ? updatedUser : u
        );
      });

      return { success: true, user: updatedUser };
    } catch (err) {
      console.error(err);
      return {
        error:
          err?.response?.data?.error ||
          err?.response?.data?.message ||
          "Failed to update profile."
      };
    }
  };

  const changePassword = (newPassword) => {
    const updatedUsers = users.map(u =>
      u.id === currentUser.id ? { ...u, password: newPassword } : u
    );

    setUsers(updatedUsers);
  };

  return (
    <UserContext.Provider value={{
      users,
      setUsers,
      currentUser,
      certifications,
      setCertifications,
      signup,
      login,
      logout,
      addCertification,
      deleteCertification,
      updateCertification,
      verifyCertificate,
      rejectCertificate,
      requestRenewal,
      approveRenewal,
      rejectRenewal,
      toggleLike,
      addComment,
      updateProfile,
      changePassword
    }}>
      {children}
    </UserContext.Provider>
  );
}