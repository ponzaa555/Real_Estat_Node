import jwt from "jsonwebtoken"

export const verifyToken = (req,res,next) =>{
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated!" });
    // Decode Token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Not Authenticated!" });

        //assign id into req เพื่อเอาไว้เช็คต่อว่า เราเป็นเจ้าของไหม
        req.userId = payload.id;
        
        //run next proceess => shoudl be login see in test.route
        next();
    });
}