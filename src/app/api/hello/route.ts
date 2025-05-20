import { NextResponse } from "next/server";

//manejador de la ruta POST para registrar usuarios

export function GET() {


    return NextResponse.json({ mesagge: "HOLA DESDE API " })

}