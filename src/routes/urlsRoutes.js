import express from "express";

import { authToken } from "../middleware/authMiddleware.js";
import { createNewUrlMiddleware, deleteUrlMiddleware, selectUrlByIdMiddleware } from "../middleware/urlsMIddleware.js";
import {
    createNewUrlController,
    selectUrlByIdController,
    selectUrlByShortController,
    deleteUrlController
} from "../controllers/urlsControllers.js";

const router = express.Router();

router.post(
    "/urls/shorten",
    authToken,
    createNewUrlMiddleware,
    createNewUrlController
);
router.get("/urls/:id", selectUrlByIdMiddleware, selectUrlByIdController);

router.get("/urls/open/:shortUrl", selectUrlByShortController);

router.delete("/urls/:id", 
authToken, 
deleteUrlMiddleware, 
deleteUrlController);

export default router;
