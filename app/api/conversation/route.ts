import { auth } from "@clerk/nextjs";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(req:Request) {
    try{
        const rr = await req.json();
        const {messages} = rr;

        const apiUrl =
            "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=" +
            process.env.GEMINI_API_TOKEN;

        const requestBody = {
            contents: [
                {
                    parts: [
                        {
                            text: messages,
                        },
                    ],
                },
            ],
        };
 
        const resp = await fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });
        
        const respData = await resp.json();
        return NextResponse.json(respData.candidates[0].content.parts[0].text);
    } catch (error) {
        console.log("[CONVERSATION_ERROR]",error);
        return new NextResponse("internal error",{status:500});
        
    }
}
