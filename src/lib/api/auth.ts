"use server"

import { RegisterUser, ActionResponse } from "@/types";

export async function registerAction(payload: RegisterUser): Promise<ActionResponse> {
    try {
        const response = await fetch(`${process.env.BACKEND_API_URL}/auth/register`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
        })

        const responseData = await response.json()

        if (!response.ok) {
            return {
                status: false,
                error: responseData.message || "An error occurred while registering the user.",
            };
        }

        return {
            status: true,
            data: responseData
        }
    } catch(error) {
        console.error("Internal Server Error: ", error);
        return {
            status: false,
            error: "Internal Server Error"
        };
    }
}