import mongoose from "mongoose";


//obtener la URI de la base de datos desde las variables de entorno que se encuentra en .env
const { MONGODB_URI } = process.env;

//validamos que la URI de mongoDB este definida
//sino esta definida, lanzamos un error para evitar que la aplicacion se quede sin conexion

if (!MONGODB_URI) {
    throw new Error("MONGO_URI must be defined");
}

//creamos y exportamos la funcionm asincrona connectDB
//esta funcion intentara establecer la conexion con la BD

export const connectDB = async () => {
    try {
        //realizar la conexion y extramos la propiedad connection del resultado
        const { connection } = await mongoose.connect(MONGODB_URI);

        //verificar si la conexion fue exitosa
        //connection.readyState === 1 indica que la base de datos esta conectada
        if (connection.readyState === 1) {
            console.log("MongoDB connected");
            return Promise.resolve(true);
        }

    } catch (error) {
        console.log(error);
        return Promise.reject(false);
    }
};
