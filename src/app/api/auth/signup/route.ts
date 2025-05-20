//importamos utilidades de nextjs

//NextResponse se utila para generar respuestas http en formato JSON
import { NextResponse } from "next/server";

//Importar el modelo de user desde la carpeta models
import User from "@/models/user";

//importar la funcion connectDB
import { connectDB } from "@/libs/mongodb";

//Importar libreria para encriptar el password
import bcrypt from "bcryptjs";

//manejador de la ruta POST para registrar usuarios

export async function POST(request: Request) {
    //obtener datos del cuerpo de la peticion

    //1. extrare directamente las propiedades de fullname, email, passwords del body enviado

    const { fullname, email, password } = await request.json();

    //2. imprimimos los valores por consola para comprobar sui funcionamiento
    console.log(fullname, email, password);

    //3. validaciones de la contrasenia
    if (!password || password.length < 6) {
        return NextResponse.json(
            {
                message: "Password must be at last 6 characters",
            },
            {
                status: 400, //codigo de estado http(bad request)
            }
        );
    }

    // 4. establecer la conexion con la BD mongoDB
    try {
        await connectDB();
        //5. verificar si ya hay un usuario con el mismo email
        const userFound = await User.findOne({ email });
        //6. si existe nos responde con error 409 conflicto de datos
        if (userFound) return NextResponse.json(
            {
                message: "Email already exists"
            },
            {
                status: 409 //codigo http 409 - conflicto de datos
            }
        );

        //7. encripta el password con bycript 12 rondas = buena seguridad
        const hashedPassword = await bcrypt.hash(password, 12);

        //8. crear un nuevo objeto del modelo del User con los datos del formulario
        //nota: se guarda la password encriptada
        const user = new User({
            email,
            fullname,
            password: hashedPassword,
        });

        //9. guarda el usuarui en la BD y espera que termine el proceso
        const savedUser = await user.save();

        //10. imprime el usuario guardado
        console.log(savedUser);    

        //11. devuelve como respuesta el usuario guardado en formato JSON
        return NextResponse.json({
            _id: savedUser._id,
            email: savedUser.email,
            fullname: savedUser.fullname,
            password: savedUser.password,
        });

    } catch (error) {
        //12. si ocurre un error durante el proceso, se captura y se muestra por consola
        console.log(error);

        //13 verificar si el error es una instancia valida del objeto error
        if(error instanceof Error) {
            //14. devuelva un mensaje personalizado con el error capturado
            return NextResponse.json(
                {
                    message: error.message, //mensaje del error ocurrido
                },
                {
                    status: 400, //codigo de http 400 - solicitud invalida
                }
            );
        }
        
        // Si no es un error de tipo Error, devolver una respuesta genérica
        return NextResponse.json(
            {
                message: "An error occurred",
            },
            {
                status: 500,
            }
        );
    }
}