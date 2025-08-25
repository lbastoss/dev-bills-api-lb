import app from "./app";

const PORT = 3001

const startServer = async () => {
    try {
        await app.listen({ port: PORT }).then(() => {
            console.log(`Server is running on port: ${PORT}`)
    
        });


    } catch (err) {
        console.error(err);
    }
}

startServer();