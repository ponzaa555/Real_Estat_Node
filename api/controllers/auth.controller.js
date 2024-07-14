import bcrypt from "bcrypt";
import prisma from "../lib/prisma.js";
import jwt from "jsonwebtoken"
export const register = async (req, res) => {
    //put variable 
    const { username, email, password } = req.body;

    try {



        // HASH THE PASSWORD

        const hashedPassword = await bcrypt.hash(password, 10);

        console.log(hashedPassword);

        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        console.log(newUser);

        res.status(201).json({ message: "User Created successfully" });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "Failed to Create User!" });
    }
    // CREATE A NEW USER AND SAVE TO DB
}

export const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        //CHECK USE EXIST?
        const user = await prisma.user.findUnique({
            where: { username: username },
        });

        if (!user) return res.status(401).json({ message: "Invalid Credentials! " });
        //CHECK PASSWORD IS CORRECT

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(401).json({ message: "Invalid Credentials! " });

        //GENRATE COOKIE TOKEN AND SENT TO USER JWT
        const age = 1000 * 60 * 60 * 24 * 7 // 7 Day

        const token = jwt.sign({
            id: user.id,
            isAdmin:true,
        }, process.env.JWT_SECRET_KEY, { expiresIn: age })
        // cut password off
        const { password: userPassword, ...userInfo } = user;
        res
            .cookie("token", token, {
                httpOnly: true,
                // secure:true
                maxAge: age,
            })
            .status(200)
            .json(userInfo);

    } catch (err) {
        console.log(err)
        res.status(500).json({ message: "Failed to login!" })
    }
}

export const logout = (req, res) => {
    // ไม่ต้องเช็คหรอคนไหน Logout เนี่ย
    res.clearCookie("token").status(200).json({ message: "Logout Success" });
}