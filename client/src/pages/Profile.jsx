import React from "react";
import useAuthStore from "../store/authStore.js";

function Profile() {
  const user = useAuthStore((state) => state.user);

  return (
    <section className="mx-auto max-w-4xl px-4 py-16">
      <div className="rounded-xl border bg-white p-8">
        <h1 className="text-3xl font-bold">My Profile</h1>

        <div className="mt-6 space-y-3">
          <p>
            <strong>Name:</strong> {user?.name}
          </p>

          <p>
            <strong>Email:</strong> {user?.email}
          </p>

          <p>
            <strong>Role:</strong> {user?.role}
          </p>
        </div>
      </div>
    </section>
  );
}

export default Profile;