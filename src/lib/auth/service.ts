"use server"

export async function loginWithCredentials(credentials: {
    email: string;
    password: string;
}) {
    try {
        const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(credentials),
        });

        if (!res.ok) throw new Error(`Login request failed with status ${res.status}`);

        const data = await res.json();
        console.log('data: ', data)
        if (data.access_token && data.user) {
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
    } catch (error) {
        console.error("[LoginWithCredentials]: ", error);
        return null;
    }
}