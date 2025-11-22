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

        if (data.accessToken && data.user) {
            return {
                id: data.user.id,
                email: data.user.email,
                accessToken: data.accessToken,
            };
        }

        return null;
    } catch (error) {
        console.error("[LoginWithCredentials]: ", error);
        return null;
    }
}