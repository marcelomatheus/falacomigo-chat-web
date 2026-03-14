"use server"

export async function loginWithCredentials(credentials: {
    email: string;
    password: string;
}) {
    const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
    });

    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const message =
            data && typeof data === "object" && "message" in data
                ? String((data as { message: unknown }).message)
                : `Login request failed with status ${res.status}`;

        throw new Error(message);
    }

    if (data?.access_token && data?.user) {
        return {
            id: data.user.id,
            email: data.user.email,
            profile: {
              id: data.user.profile.id,
              name: data.user.profile.name,
              photoUrl: data.user.profile?.photoUrl,
            },
            accessToken: data.access_token,
        };
    }

    return null;
}