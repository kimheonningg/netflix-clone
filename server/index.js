import express from "express";
import cors from "cors";

import { version } from "./data.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Function to set delay
const delay = (ms) => new Promise((r) => setTimeout(r, ms));

app.get("/test/version", (req, res) => {
	delay(1000).then(() => {
		res.json({ version: version });
	});
});

app.listen(PORT, () => {
	console.log(`> API server listening on http://localhost:${PORT}`);
});
