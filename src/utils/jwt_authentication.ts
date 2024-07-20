import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken'
export default function verifyJWT(req: Request, res: Response, next: NextFunction) {
    var token: any = req.headers["auth-token"];

    if (token) {
        jwt.verify(token, process.env.SECRET_KEY, ((err: any, decoded: any) => {
            if (err) {
                return res.json({ message: "unauthorized access" })
            }
        }));

        next()

    }

    else {
        return res.json({ message: "forbidden access" });
    }
}