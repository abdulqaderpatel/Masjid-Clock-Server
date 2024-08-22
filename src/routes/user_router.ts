import express, {Request, Response} from "express";
import {db} from "../drizzle/db";
import {UserTable} from "../drizzle/schema";
import multer from "multer";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import {eq} from "drizzle-orm";
import * as nodemailer from "nodemailer";
import * as jwt from 'jsonwebtoken'
import createResponse from "../models/CreateResponse";
import verifyJWT from "../utils/jwt_authentication";

const upload = multer({dest: "uploads/"});
const userRouter = express.Router();


//register the user
userRouter.post('/register', async (req: Request, res: Response) => {
    const {name, email, password, address, country, state, city} = req.body;

    try {
        const userExists = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, email),
        });

        if (userExists) {
            throw Error("A user with this email already exists")
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await db.insert(UserTable).values({
            name,
            email,
            password: hashedPassword,
            address,
            country,
            state,
            city,

        })

        console.log(user);

        const id = user[0].insertId;

        const smtpTransport = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        console.log("timepas");


        const emailToken = jwt.sign(
            {
                id,
                name,
                email,
                address,
                country,
                state,
                city,
                isVerified: false

            },
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );

        const url = `http://localhost:3001/api/user/email/confirm/${emailToken}`;

        smtpTransport.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Verify your email',
            html: `<p>Click on the link below to verify</p><br><a href="${url}">${url}</a>`,
        });

        return res.status(201).json(
            createResponse({
                message: 'User created successfully',
                data: emailToken,
            })
        );
    } catch (error: any) {
        return res.status(400).json(
            createResponse({

                message: error.message,
                data: {},
            })
        );

    }
});


//login the user
userRouter.post('/login', async (req: Request, res: Response) => {
    const {email, password} = req.body;

    try {
        // Check if the user exists
        const user = await db.query.UserTable.findFirst({
            where: eq(UserTable.email, email),
        });

        if (!user) {
            return res.status(404).json(
                createResponse({
                    message: 'User with this email does not exist',
                    data: {},
                })
            );
        }

        // Compare the hashed password
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json(
                createResponse({
                    message: 'Invalid credentials',
                    data: {},
                })
            );
        }

        // Check if the email is verified
        if (!user.isVerified) {
            return res.status(401).json(
                createResponse({
                    message: 'Email is not verified. Please verify your email.',
                    data: {},
                })
            );
        }


        // Generate a JWT token
        const emailToken = jwt.sign(
            {
                id: user.id,
                name: user.name,
                email: email.name,
                address: user.address,
                country: user.country,
                state: user.state,
                city: user.city,
                isVerified: user.isVerified

            },
            process.env.SECRET_KEY,
            {expiresIn: '1d'}
        );


        return res.status(200).json(
            createResponse({
                message: 'Login successful',
                data: emailToken,
            })
        );
    } catch (error: any) {
        return res.status(500).json(
            createResponse({
                message: error.message,
                data: {},
            })
        );
    }
});

userRouter.get("/email/confirm/:token", async (req, res) => {
    const user: any = jwt.verify(req.params.token, process.env.SECRET_KEY);

    if (!user) {
        return res.status(400).json(createResponse({
            message: "Forbidden access", data: {}
        }))
    }

    await db.update(UserTable).set({isVerified: true}).where(eq(UserTable.id, user.id));

    return res.status(200).redirect(process.env.EMAIL_VERIFY_REDIRECT_LINK);
});

userRouter.get("/isVerified", verifyJWT, async (req, res) => {


    const token: any = req.headers["auth-token"]?.toString().split(" ")[1]

    const userId: any = jwt.verify(token, process.env.SECRET_KEY);

    const userIsVerified = await db.query.UserTable.findFirst({where: eq(UserTable.id, userId.id)});

    console.log(userIsVerified);


    if (userIsVerified?.isVerified) {
        return res.status(200).json(createResponse({
            message: "User email is verified", data: {}
        }))
    }

    return res.status(400).json(createResponse({
        message: "User email is not verified", data: {}
    }))
});


//api for user to follow a masjid (update the masjid_id inside user)

userRouter.put("/masjidId", async (req, res) => {
    const {id, masjidId} = req.body;

    const user = await db.update(UserTable).set({masjid_id: masjidId}).where(eq(UserTable.id, id));

    return res.json(createResponse({message: "Masjid id updated successfully", data: masjidId}))
});


userRouter.get("/masjidId/:id", async (req, res) => {
    const {id} = req.params;

    const userId = await db.select({id: UserTable.id}).from(UserTable).where(eq(UserTable.id, Number(id)));

    console.log(userId);
    if (userId.length == 0) {
        return res.status(400).json(createResponse({message: "No user exists with this id", data: null}))
    }
    const masjidId = await db.select({masjid_id: UserTable.masjid_id}).from(UserTable).where(eq(UserTable.id, Number(id)));

    console.log(masjidId)
    if (!masjidId[0].masjid_id) {
        return res.status(400).json(createResponse({message: "User has not followed a masjid", data: null}));
    }
    return res.json(createResponse({message: "received user masjid", data: masjidId[0].masjid_id}))
});


export default userRouter;
