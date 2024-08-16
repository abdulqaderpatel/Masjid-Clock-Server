import express, { Request, Response } from "express";
import { db } from "../drizzle/db";
import { NamazTable, MasjidTable,} from "../drizzle/schema";
import multer from "multer";
import xlsx from "xlsx";
import bcrypt from "bcrypt";
import { eq } from "drizzle-orm";
import * as nodemailer from "nodemailer";
import * as jwt from 'jsonwebtoken'
import createResponse from "../models/CreateResponse";
import verifyJWT from "../utils/jwt_authentication";

const upload = multer({ dest: "uploads/" });
const masjidRouter = express.Router();


//register the masjid
masjidRouter.post('/register', async (req: Request, res: Response) => {
  const { name, email, password, address, country, state, city } = req.body;

  try {
    const userExists = await db.query.MasjidTable.findFirst({
      where: eq(MasjidTable.email, email),
    });

    if (userExists) {
      throw Error("A user with this email already exists")
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await db.insert(MasjidTable).values({
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
      { expiresIn: '1d' }
    );

    const url = `http://localhost:3001/api/masjid/email/confirm/${emailToken}`;

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



//login the masjid
masjidRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Check if the user exists
    const masjid = await db.query.MasjidTable.findFirst({
      where: eq(MasjidTable.email, email),
    });

    if (!masjid) {
      return res.status(404).json(
          createResponse({
            message: 'Masjid with this email does not exist',
            data: {},
          })
      );
    }

    // Compare the hashed password
    const passwordMatch = await bcrypt.compare(password, masjid.password);

    if (!passwordMatch) {
      return res.status(401).json(
          createResponse({
            message: 'Invalid credentials',
            data: {},
          })
      );
    }

    // Check if the email is verified
    if (!masjid.isVerified) {
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
          id:masjid.id,
          name:masjid.name,
          email:email.name,
          address:masjid.address,
          country:masjid.country,
          state:masjid.state,
          city:masjid.city,
          isVerified:masjid.isVerified

        },
        process.env.SECRET_KEY,
        { expiresIn: '1d' }
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

masjidRouter.get("/email/confirm/:token", async (req, res) => {
  const user: any = jwt.verify(req.params.token, process.env.SECRET_KEY);

  if (!user) {
    return res.status(400).json(createResponse({
      message: "Forbidden access", data: {}
    }))
  }

  await db.update(MasjidTable).set({ isVerified: true }).where(eq(MasjidTable.id, user.id));

  return res.status(200).redirect(process.env.EMAIL_VERIFY_REDIRECT_LINK);
});

masjidRouter.get("/isVerified", verifyJWT, async (req, res) => {


  const token: any = req.headers["auth-token"]?.toString().split(" ")[1]

  const userId: any = jwt.verify(token, process.env.SECRET_KEY);

  const userIsVerified = await db.query.MasjidTable.findFirst({ where: eq(MasjidTable.id, userId.id) });

  console.log(userIsVerified);


  if (userIsVerified?.isVerified) {
    return res.status(200).json(createResponse({
      message: "User email is verified", data: {

      }
    }))
  }

  return res.status(400).json(createResponse({
    message: "User email is not verified", data: {

    }
  }))
})

function ExcelDateToJSDate(date: any) {
  return new Date(Math.round((date - 25569) * 86400 * 1000));
}

masjidRouter.post("/upload", upload.single("file"), async (req, res) => {

  const { id } = req.body;

  if (!id) {
    return res.status(400).send("id is requried");
  }


  if (!req.file) {
    return res.status(400).send("No file uploaded.");
  }

  const workbook: any = xlsx.readFile(req.file.path);
  const worksheet: any = workbook.Sheets[workbook.SheetNames[0]];
  console.log(workbook);
  let data: any = xlsx.utils.sheet_to_json(worksheet, { header: 1 }).slice(1);

  try {
    for (const value of data) {
      const formattedDate: any = ExcelDateToJSDate(value[0])
        .toISOString()
        .split("T", 1)[0];
      console.log(formattedDate);
      console.log(typeof value[0]);
      await db.insert(NamazTable).values({
        user_id: id,
        date: formattedDate, // Default date if not provided
        fajr_namaz: value[1].toString(),
        fajr_jamat: value[2].toString(),
        zuhr_namaz: value[3].toString(),
        zuhr_jamat: value[4].toString(),
        asr_namaz: value[5].toString(),
        asr_jamat: value[6].toString(),
        maghrib_namaz: value[7].toString(),
        maghrib_jamat: value[8].toString(),
        isha_namaz: value[9].toString(),
        isha_jamat: value[10].toString(),
      });
    }
      return res.send("Data uploaded");
  } catch (e) {
    return res.send("some error occured");
  }
});

export default masjidRouter;
