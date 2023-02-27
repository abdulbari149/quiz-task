import {
	IAddQuestionToQuiz,
	addQuestionToQuiz,
} from "./../services/quiz.service";
import { NextFunction, Request, Response, query } from "express";
import * as quizService from "../services/quiz.service";
import dataSource from "../database";
import HttpException from "../utils/HttpException";

export const createQuiz = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	const queryRunner = dataSource.createQueryRunner();
	try {
		await queryRunner.connect();
		await queryRunner.startTransaction();
		const quiz = await quizService.createQuiz(
			{
				title: req.body.title,
				description: req.body.description,
			},
			{ queryRunner }
		);

		const questionsPromises = req.body.questions.map(
			async (question: Omit<IAddQuestionToQuiz, "quizId">) =>
				await quizService.addQuestionToQuiz(
					{
						quizId: quiz.id,
						question: question.question,
						isMandatory: question.isMandatory,
						options: question.options,
					},
					{ queryRunner }
				)
		);

		const questions = await Promise.all<quizService.IAddQuestionToQuizReturn>(
			questionsPromises
		);
		
		await queryRunner.commitTransaction()

		res.status(201).json({
			error: null,
			success: true,
			data: {
				id: quiz.id,
				title: quiz.title,
				description: quiz.description,
				questions: questions.map(({ question, options }) => ({
					id: question.id,
					question: question.question,
					isMandatory: question.isMandatory,
					options: options.map((option) => ({
						id: option.id,
						option: option.option,
						isCorrect: option.isCorrect,
					})),
				})),
			},
		});
	} catch (error) {
		await queryRunner.rollbackTransaction();
		next(error);
	} finally {
		queryRunner.release();
	}
};

export const getQuizDetails = async (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const id = parseInt(req.params.id);

		if (isNaN(id)) {
			throw new HttpException("Invalid id, Id must be a number", 400, [1001]);
		}
		const data = await quizService.getQuizWithDetails(id);

		res.status(200).json({ data, error: null, success: true });
	} catch (error) {
		next(error);
	}
};
