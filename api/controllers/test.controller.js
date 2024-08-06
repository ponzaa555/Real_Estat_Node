import jwt from "jsonwebtoken"

export const shouldBeLoggedIn = async (req, res) => {
    //verify token
    console.log(req.userId);
    res.status(200).json({ message: "You are Authenticated" });
};

export const shouldBeAdmin = async (req, res) => {
    //verify token
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "Not Authenticated!" });
    // Decode Token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Not Authenticated!" });
        if (!payload.isAdmin) {
            return res.status(403).json({ message: "Not authorized!" })
        }
    });

    res.status(200).json({ message: "You are Authenticated" });
}

/*
    เห็นได้ว่า ใช้ code verify token บ่อยมากๆ
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: "Not Authenticated!" });
    // Decode Token
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {
        if (err) return res.status(401).json({ message: "Not Authenticated!" });
        if(!payload.isAdmin){
            return res.status(403).json({message:"Not authorized!"})
        }
    });

    res.status(200).json({ message: "You are Authenticated" });
    ต่อจากนี้อย่างเช่น จะ post,del,หรือ อื่นๆก็ต้องมา verify ตลอดซ้ำซ้อน
    ใช้ middleware มาแก้
*/