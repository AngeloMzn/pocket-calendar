import { NextResponse } from "next/server";
import registerAction from "./registerAction";

export async function POST(request: Request) {
    try {
        const data = await registerAction(await request.json());
        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Erro ao processar a solicitação." }, { status: 500 });
    }
}
