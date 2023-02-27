import 'reflect-metadata';
import express, { type ErrorRequestHandler } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import config from "./config";

import "./database";
import quizRouter from "./routes/quiz.router";
import HttpException from "./utils/HttpException";

const app = express();


app.use(logger(config.loggerLevel));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/api/quiz", quizRouter);
const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
	if (err instanceof HttpException) {
		return res
			.status(err.statusCode)
			.json({ success: false, data: null, errors: err.errorCodes });
	}
	return res.status(500).json({ success: false, data: null, errors: [] });
};
app.use(errorHandler);

// export default app;

app.listen(config.port, () =>
	console.log(`Server started at PORT: ${config.port}`)
);
