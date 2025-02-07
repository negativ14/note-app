"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAuth = exports.deleteContent = exports.uploadAudio = exports.updateContent = exports.uploadImage = exports.createContent = exports.getContent = exports.signin = exports.signup = void 0;
const user_model_1 = require("../models/user.model");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const signUpSchema_1 = require("../schemas/signUpSchema");
const signInSchema_1 = require("../schemas/signInSchema");
const content_model_1 = require("../models/content.model");
const utility_1 = require("../lib/utility");
const cloudinary_1 = __importDefault(require("../lib/cloudinary"));
dotenv_1.default.config();
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = signUpSchema_1.signUpSchema;
        const parsedUSerInput = userInput.safeParse(req.body);
        if (!parsedUSerInput.success) {
            return res.status(400).json({
                message: "Bad request",
                error: parsedUSerInput.error.errors.map(err => err.message)
            });
        }
        const { username, password, email, fullName } = req.body;
        const response = yield user_model_1.UserModel.findOne({ email });
        if (response) {
            return res.status(409).json({
                message: "User Already exists"
            });
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield user_model_1.UserModel.create({
            username: username,
            password: hashedPassword,
            email: email,
            fullName: fullName,
        });
        if (!user) {
            return res.status(403).json({
                message: "User sign up failed"
            });
        }
        res.status(201).json({
            message: "User signed up successfully",
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Server side issue: ${error}`,
        });
    }
});
exports.signup = signup;
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userInput = signInSchema_1.signInSchema;
        const parsedUSerInput = userInput.safeParse(req.body);
        if (!parsedUSerInput.success) {
            return res.status(400).json({
                message: "Bad request",
                error: parsedUSerInput.error.errors.map(err => err.message)
            });
        }
        const { email, password } = req.body;
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!isEmail) {
            return res.status(400).json({
                message: "Invalid email"
            });
        }
        const user = yield user_model_1.UserModel.findOne({ email: email });
        if (!user) {
            return res.status(403).json({
                message: "Incorrect credantials"
            });
        }
        const passwordMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(403).json({
                message: "Incorrect Password"
            });
        }
        //new JWT way with cookie
        const JWT_SECRET = process.env.JWT_SECRET || "NEGATIV_SECRET";
        const token = jsonwebtoken_1.default.sign({ _id: user === null || user === void 0 ? void 0 : user._id.toString() }, JWT_SECRET, { expiresIn: "7d" });
        res.status(200).json({
            message: "Logged In successfully",
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
            },
            token: token,
        });
    }
    catch (error) {
        res.status(500).json({
            message: `Serer side issue ${error}`
        });
    }
});
exports.signin = signin;
const getContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const query = { creatorId: (_a = req.user) === null || _a === void 0 ? void 0 : _a._id };
        if (req.query.title) {
            const searchText = (0, utility_1.escapeRegex)(req.query.title);
            query.title = new RegExp(searchText, "i");
        }
        const response = yield content_model_1.ContentModel.find(query);
        // console.log("from searchContent controller3:", response);
        res.status(200).json({
            message: "Content fetched successfully",
            data: response
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error
        });
        console.log("Error in getContent controller", error);
    }
});
exports.getContent = getContent;
const createContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield content_model_1.ContentModel.create(req.body);
        if (!response) {
            return res.status(403).json({
                message: "Content creation failed"
            });
        }
        res.status(201).json({
            message: "Content created successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.createContent = createContent;
const uploadImage = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id, image } = req.body; // image is expected to be a base64 string (or valid URL) for upload
    if (!image || image.length < 1) {
        return res.status(400).json({ message: "No image provided" });
    }
    let uploadedImageUrl;
    try {
        // Upload the image to Cloudinary
        const uploadResponse = yield cloudinary_1.default.uploader.upload(image);
        uploadedImageUrl = uploadResponse.secure_url;
    }
    catch (error) {
        console.error("Cloudinary upload error:", error);
        return res.status(500).json({ message: "Failed to upload image." });
    }
    const response = yield content_model_1.ContentModel.updateOne({ _id }, { $push: { image: uploadedImageUrl } }, { new: true, runValidators: true });
    if (response.modifiedCount === 0) {
        return res.status(500).json({ message: "Failed to update content with image" });
    }
    return res.status(200).json({
        message: "Image uploaded successfully",
        imageUrl: uploadedImageUrl,
    });
});
exports.uploadImage = uploadImage;
const updateContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure _id and image from req.body so that image is not updated here.
        const _a = req.body, { _id, image } = _a, data = __rest(_a, ["_id", "image"]);
        // Update the document with the provided data (excluding image)
        const response = yield content_model_1.ContentModel.updateOne({ _id }, { $set: data }, { new: true, runValidators: true });
        if (response.modifiedCount === 0) {
            console.log("No change or content not found");
            return res.status(404).json({ message: "Content not found or no changes made" });
        }
        console.log("Modified Count:", response.modifiedCount);
        return res.status(200).json({ message: "Content updated successfully" });
    }
    catch (error) {
        console.error("Update content error:", error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});
exports.updateContent = updateContent;
const uploadAudio = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const audio = req.body.audio;
        // console.log(req.body.audio);
        // const { audio, fileName } = req.body;
        if (!req.file) {
            return res.status(400).json({ message: 'No audio data provided.' });
        }
        // Decode Base64 to Buffer
        // const buffer = Buffer.from(audio, 'base64');
        // Upload to Cloudinary
        // const uploadResponse = await cloudinary.uploader.upload_stream(
        //     { resource_type: 'video', public_id: fileName }, // Settings for Cloudinary
        //     (error, result) => {
        //         if (error) {
        //             console.error('Cloudinary upload error:', error);
        //             return res.status(500).json({ message: 'Failed to upload audio to Cloudinary.' });
        //         }
        //         res.status(200).json({
        //             message: 'Audio uploaded successfully',
        //             audioUrl: result?.secure_url, // URL of the uploaded audio file
        //         });
        //     }
        // );
        // // Pipe the buffer to Cloudinary upload stream
        // uploadResponse.end(buffer);
        // Upload audio to Cloudinary
        const result = yield cloudinary_1.default.uploader.upload_stream({ resource_type: 'video' }, // Using 'video' to handle audio files
        (error, result) => {
            if (error) {
                return res.status(500).send('Error uploading audio to Cloudinary');
            }
            if (result) {
                return res.status(200).send({ message: 'File uploaded successfully', audioUrl: result.secure_url });
            }
            else {
                return res.status(500).send('Error uploading audio to Cloudinary');
            }
        });
        result.end(req.file.buffer);
    }
    catch (error) {
        console.error('Cloudinary upload error:', error);
        return res.status(500).json({ message: 'Failed to upload audio.' });
    }
});
exports.uploadAudio = uploadAudio;
// const bytes = await audio.arrayBuffer();
// const buffer = Buffer.from(bytes);
// // const base64String = buffer.toString('base64');
// // const dataUri = `data:${mimetype};base64,${base64String}`;
// const base64String = buffer.toString('base64');
// const dataUri = `data:audio/mpeg;base64,${base64String}`;
// const uploadResponse = await cloudinary.uploader.upload(audio, { resource_type: 'auto' });
// const uploadedAudioUrl = uploadResponse.secure_url;
// return res.status(200).json({
//     message: 'Audio uploaded successfully',
//     audioUrl: uploadedAudioUrl,
// });
const deleteContent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield content_model_1.ContentModel.deleteOne({ _id: req.body._id });
        if (response.deletedCount === 0) {
            return res.status(404).json({
                message: "Content not found"
            });
        }
        res.status(200).json({
            message: "Content deleted successfully"
        });
    }
    catch (error) {
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
});
exports.deleteContent = deleteContent;
const checkAuth = (req, res) => {
    try {
        res.status(200).json(req.user);
        //console.log("from checkAuth controller:", req.user)
    }
    catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};
exports.checkAuth = checkAuth;
// // Flatten image array if it is nested
// const flattenImage = (img: any): any => {
//     if (Array.isArray(img)) {
//       return img.flat(Infinity); // Flat any level deep
//     }
//     return img;
//   };
// export const updateContent = async (req: Request, res: Response): Promise<any> => {
//       try {
//           let { _id, image, ...data } = req.body;
//           // Flatten the image data
//           image = flattenImage(image);
//           console.log("hi there");
//           // If image is a non-empty string or an array with content
//           if (typeof image === "string" && image.length > 1) {
//               // Upload image when it's a string (base64)
//               let uploadedImageUrl;
//               try {
//                   const uploadResponse = await cloudinary.uploader.upload(image);
//                   uploadedImageUrl = uploadResponse.secure_url;
//               } catch (error) {
//                   return res.status(500).json({ message: "Failed to upload image." });
//               }
//               // Append the new image URL into the image array
//               await ContentModel.updateOne(
//                   { _id },
//                   {
//                       ...data,
//                       $push: { image: uploadedImageUrl }, // Append image URL
//                   },
//                   { new: true, runValidators: true }
//               );
//           } else if (Array.isArray(image) && image.length > 0 && typeof image[0] === "string" && image[0].length > 1) {
//               // Alternatively, if image is a flat array of base64 strings
//               let uploadedImageUrl;
//               try {
//                   // For example, upload the first image; you could loop if you have multiple
//                   const uploadResponse = await cloudinary.uploader.upload(image[0]);
//                   uploadedImageUrl = uploadResponse.secure_url;
//               } catch (error) {
//                   return res.status(500).json({ message: "Failed to upload image." });
//               }
//               await ContentModel.updateOne(
//                   { _id },
//                   {
//                       ...data,
//                       $push: { image: uploadedImageUrl },
//                   },
//                   { new: true, runValidators: true }
//               );
//           } else {
//               // Directly update the document if no image to upload (or if image is not provided)
//               const response = await ContentModel.updateOne(
//                   { _id: req.body._id },
//                   req.body,
//                   { new: true, runValidators: true }
//               );
//               if (response.modifiedCount === 0) {
//                   console.log("no change");
//                   return res.status(404).json({
//                       message: "Content not found"
//                   });
//               }
//           }
//           res.status(200).json({
//               message: "Content updated successfully"
//           });
//       } catch (error) {
//           console.error(error);
//           res.status(500).json({
//               message: "Internal Server Error"
//           });
//       }
//   };
