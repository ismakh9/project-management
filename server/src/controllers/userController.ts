import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs"

const prisma = new PrismaClient();

// Get all users
export const getUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving users: ${error.message}` });
  }
};

// Get user by cognitoId
export const getUser = async (req: Request, res: Response): Promise<void> => {
  const { cognitoId } = req.params;
  try {
    const user = await prisma.user.findUnique({
      where: {
        cognitoId: cognitoId,
      },
    });

    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error retrieving user: ${error.message}` });
  }
};

// Create a new user
export const postUser = async (req: Request, res: Response) => {
  try {
    const {
      username,
      cognitoId,
      email,
      password,
      profilePictureUrl = "i1.jpg",
      teamId = 1,
    } = req.body;

    // Hash the password before storing it
    const passwordHash = await bcrypt.hash(password, 10); // 10 is the salt rounds

    const newUser = await prisma.user.create({
      data: {
        username,
        cognitoId,
        email,
        passwordHash,  // Save the hashed password
        profilePictureUrl,
        teamId,
      },
    });

    res.json({ message: "User Created Successfully", newUser });
  } catch (error: any) {
    res
      .status(500)
      .json({ message: `Error creating user: ${error.message}` });
  }
};


// Helper function to send a reset token to the user's email
const sendPasswordResetEmail = (email: string, token: string) => {
  // Implement your email sending logic here
  console.log(`Password reset token sent to ${email}: ${token}`);
  
};

// Request a password reset
export const requestPasswordReset = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
     res.status(404).json({ message: "User not found" });
    }
    else{
       // Generate a reset token (valid for 1 hour)
      const resetToken = jwt.sign({ email: user.email }, "Khalid", { expiresIn: "1h" });

      // Send the reset token to the user's email
      sendPasswordResetEmail(email, resetToken);

      res.status(200).json({
        message: "Password reset email sent",
        resetToken: resetToken,  // Add the reset token to the response
      });

    }

   
  } catch (error: any) {
    res.status(500).json({ message: `Error requesting password reset: ${error.message}` });
  }
};

// Reset password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  const { token, newPassword } = req.body;

  try {
    // Verify the reset token
    const decoded: any = jwt.verify(token, "Khalid");

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    await prisma.user.update({
      where: { email: decoded.email },
      data: { passwordHash: hashedPassword },
    });

    res.status(200).json({ message: "Password has been reset successfully" });
  } catch (error: any) {
    res.status(500).json({ message: `Error resetting password: ${error.message}` });
  }
};