import { Request, Response } from "express";
import User from "../../../models/User";
import { authenticateRequest } from "../../../utils/mongo";
import jwt from "jsonwebtoken"
import { TypeOf } from "yup";
const SECRET_KEY = "KisiKoNahiBtaonga"

export const getUser = async (req: Request, res: Response) => {
    try {
        const data = await authenticateRequest(req, res);
        // console.log("Checking Data in getUser", data)
        let user = await User.findOne({ _id: data.userId });
        if (user) {
            return res.status(200).json(user);
        }
        return res.status(404).json({ message: "User not found" })
    } catch (error: any) {
        console.log("Error | controller | user | getUser | catch", error)
        return res.status(error?.status || 500).json({ error: error?.error || "Something went wrong" });
        // return res.status(500).json({ message: "Something went wrong", error: error });
    }
}

export const getUserData = async (req: Request, res: Response) => {
    try {
        // console.log("inside get userData")
        await authenticateRequest(req, res);
        const { userId } = req.params;

        let user = await User.findOne({ _id: userId });
        if (user) {
            return res.status(200).json({ name: user.name, email: user.email });
        }
        return res.status(404).json({ message: "User not found!" })
    } catch (error) {
        console.log("Error | controller | user | getUser | catch", error)
        return res.status(500).json({ message: "Something went wrong", error: error });
    }
}

export const addUserTags = async (req: Request, res: Response) => {
    try {
        const data = await authenticateRequest(req, res);
        const user = await User.findOne({ _id: data.userId });
        if (user) {
            let updatedTags = user.tags;
            updatedTags = updatedTags.concat(req.body.tags);
            console.log("passing these", data.userId)
            await User.findOneAndUpdate({ _id: data.userId, tags: updatedTags })
            return res.status(200).json({ message: "Tags are Updated Successfully!" })
        }
        return res.status(404).json({ message: "User not found!" })

    } catch (error) {
        console.log("Error | controller | user | addUserTags | catch", error)
        return res.status(500).json({ message: "Something went wrong", error: error });
    }
}

export const getUserTags = async (req: Request, res: Response) => {
    try {
        const data = await authenticateRequest(req, res);
        const user = await User.findOne({ _id: data.userId });
        if (user) {
            return res.status(200).json({ tags: user.tags })
        }
        return res.status(404).json({ message: "User not found!" })
    } catch (error) {
        console.log("Error | controller | user | getUserTags | catch", error)
        return res.status(500).json({ message: "Something went wrong", error: error });
    }
}