import React, { useEffect } from "react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";

const ProfileModel = ({ setShowEdit }) => {
  const { user, token } = useAuth();
  const [editForm, setEditForm] = useState({
    username: user?.username || "",
    bio: user?.bio || "",
    profile_picture: null,
    location: user?.location || "",
    full_name: user?.full_name || "",
    cover_photo: null,
  });

  const uploadToCloudinary = async (file) => {
    const formData2 = new FormData();
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_PRESET;
    formData2.append("file", file);
    formData2.append("upload_preset", uploadPreset);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      { method: "POST", body: formData2 },
    );
    const data = await res.json();
    if (!data.secure_url) throw new Error("Cloudinary upload failed");
    return data.secure_url;
  };

  const handleChange = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("username", editForm.username);
      formData.append("bio", editForm.bio);
      formData.append("location", editForm.location);
      formData.append("full_name", editForm.full_name);
      if (editForm.profile_picture) {
        const profileUrl = await uploadToCloudinary(editForm.profile_picture);
        formData.append("profile_picture", profileUrl);
      }
      if (editForm.cover_photo) {
        const coverUrl = await uploadToCloudinary(editForm.cover_photo);
        formData.append("cover_photo", coverUrl);
      }
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/me`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({  
        username: editForm.username,
        bio: editForm.bio,
        location: editForm.location,
        full_name: editForm.full_name,
        profile_picture: formData.get("profile_picture"),
        cover_photo: formData.get("cover_photo")
      }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEdit(false);
      }
    } catch (e) {
      console.error("Error updating profile:", e);
    }
  };
  useEffect(() => {
    setEditForm({
      username: user?.username || "",
      bio: user?.bio || "",
      profile_picture: null,
      location: user?.location || "",
      full_name: user?.full_name || "",
      cover_photo: null,
    });
  }, [user?._id]);

  return (
    <div className="fixed top-0 bottom-0 left-0 right-0 z-110 h-screen overflow-y-scroll bg-black/50">
      <div className="max-w-2xl sm:py-6 mx-auto">
        <div className="bg-white p-6 rounded-lg shadow">
          <h1>Edit Profile</h1>

          <form onSubmit={handleChange} className="space-y-4">
            {/* Profile Picture */}
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="profile_picture"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Profile Picture
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="profile_picture"
                  className="w-full p-3 border-gray-200 rounded-lg"
                  onChange={(e) =>
                    setEditForm({
                      ...editForm,
                      profile_picture: e.target.files[0],
                    })
                  }
                />
                <div className="group/profile relative">
                  <img
                    src={
                      editForm.profile_picture
                        ? URL.createObjectURL(editForm.profile_picture)
                        : user?.profile_picture || "/default-avatar.png"
                    }
                    alt=""
                    className="w-24 h-24 rounded-full object-cover"
                  />

                  <div
                    className="absolute hidden group-hover/profile:flex top-0 left-0 right-0 bottom-0 bg-black/20
                            rounded-full items-center justify-center"
                  >
                    <Pencil className="w-5  h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>
            {/* cover photo */}
            <div className="flex flex-col items-start gap-3">
              <label
                htmlFor="cover_photo"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                cover photo
                <input
                  hidden
                  type="file"
                  accept="image/*"
                  id="cover_photo"
                  className="w-full p-3 border-gray-200 rounded-lg"
                  onChange={(e) =>
                    setEditForm({ ...editForm, cover_photo: e.target.files[0] })
                  }
                />
                <div className="group/cover relative">
                  <img
                    src={
                      editForm.cover_photo
                        ? URL.createObjectURL(editForm.cover_photo)
                        : user?.cover_photo || ""
                    }
                    alt=""
                    className="w-80 h-40 rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 object-cover mt-2"
                  />
                  <div
                    className="absolute hidden group-hover/cover:flex top-0 left-0 right-0 bottom-0 bg-black/20 rounded-lg
                                items-center justify-center"
                  >
                    <Pencil className="w-5 h-5 text-white" />
                  </div>
                </div>
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                type="text"
                className="w-full p-3 border-gray-200 rounded-lg"
                placeholder="Please enter your full name"
                onChange={(e) =>
                  setEditForm({ ...editForm, full_name: e.target.value })
                }
                value={editForm.full_name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                className="w-full p-3 border-gray-200 rounded-lg"
                placeholder="Please enter your username"
                onChange={(e) =>
                  setEditForm({ ...editForm, username: e.target.value })
                }
                value={editForm.username}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Bio
              </label>
              <textarea
                rows={3}
                className="w-full p-3 border border-gray-200 rounded-lg"
                placeholder="Please enter your bio"
                onChange={(e) =>
                  setEditForm({ ...editForm, bio: e.target.value })
                }
                value={editForm.bio}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <input
                type="text"
                className="w-full p-3 border-gray-200 rounded-lg"
                placeholder="Please enter your location"
                onChange={(e) =>
                  setEditForm({ ...editForm, location: e.target.value })
                }
                value={editForm.location}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-3">
              <button
                type="button"
                onClick={() => setShowEdit(false)}
                className="px-4 py-2 border-gray-300 rounded-lg
                        text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg
                        hover:bg-indigo-700 transition-colors cursor-pointer"
              >
                Save
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModel;
