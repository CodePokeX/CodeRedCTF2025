import Question from "@/models/Question";
import s from "./QuestionCard.module.css";

type Props = { question: Question; select: () => void };

export default function QuestionCard({ question, select }: Props) {
  // let text = question.text
  // if (text.length > 200) {
  //     text = text.slice(0, 200) + "..."
  // }
  return (
    <div
      className={`${s.card} ${question.is_answered ? s.answered : ""}`}
      onClick={select}
    >
      <h2>{question.title}</h2>
      <div className={s.description}>
        {question.text.trim().length < 90
          ? question.text.trim()
          : question.text.trim().slice(0, 90) + "..."}
      </div>
      <div className={s.footer}>
        <p className={s.teamsSolved}>
          {question.user_response_count} teams solved
        </p>
        <div className={s.points}>
          {question.is_answered ? (
            <div
              style={{
                backgroundColor: "#252525",
                borderRadius: "6px",
                color: "#22c55e",
                padding: "0px 12px",
                fontSize: "40px",
              }}
            >
              ✔
            </div>
          ) : (
            ""
          )}{" "}
          &nbsp;&nbsp;
          {question.points} Points
        </div>
      </div>
    </div>
  );
}
