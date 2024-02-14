import * as questionRepository from "../data/question.js";

export async function getQuestions(req, res) {
  const questions = await questionRepository.getAllQuestions();
  res.status(200).json(questions);
}
