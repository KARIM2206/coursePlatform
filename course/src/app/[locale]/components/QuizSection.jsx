'use client'
import { Collapse, Button, Tag, Popconfirm, Empty } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CheckOutlined } from '@ant-design/icons';
import Panel from 'antd/es/splitter/Panel';
import QuestionSection from './QuestionSection';
const QuizSection = ({ quizzes, locale,onEditQuiz, onDeleteQuiz
  , onAddQuestion,onEditQuestion,onDeleteQuestion }) => {
  // console.log(quizzes[0]?.questions[0].correctAnswer,"quizzes");
  
  return (
    <div className="quiz-section">
      
      <h3 className="text-lg font-semibold mb-4">Quizzes</h3>
      
      {quizzes?.length > 0 ? (
        <div className="space-y-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card p-4  rounded-lg">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-base">{quiz.title}</h4>
                  <p className="text-sm text-gray-500">
                    Created: {new Date(quiz.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <Tag color={quiz?.questions?.length > 0 ? "blue" : "orange"}>
                  {quiz?.questions?.length} questions
                </Tag>
              </div>

              {quiz?.questions?.length > 0 ? (
                <div className="mt-4">
                  <Collapse accordion >
                    {quiz?.questions?.map((question, qIndex) => (
                     <QuestionSection key={question._id}  question={question} qIndex={qIndex} onEditQuestion={onEditQuestion} onDeleteQuestion={onDeleteQuestion} /> 
                      
                    ))}
                  </Collapse>
                </div>
              ) : (
                <div className="mt-3 text-center py-4">
                  <Empty description="No questions added yet" />
                </div>
              )}

              <div className="mt-4 flex justify-end space-x-2">
                <Button 
                  icon={<PlusOutlined />}
                  onClick={() => onAddQuestion(quiz._id)}
                >
                  Add Question
                </Button>
                <Button 
                  icon={<EditOutlined />}
                  onClick={() => console.log('Edit quiz', quiz._id)}
                >
                  Edit
                </Button>
                <Popconfirm
                  title="Delete this quiz?"
                  // onCancel={}
                  
                  onConfirm={() =>onDeleteQuiz(quiz._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button danger icon={<DeleteOutlined />} />
                </Popconfirm>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Empty description="No quizzes created yet">
            <Button type="primary" icon={<PlusOutlined />}>
              Create First Quiz
            </Button>
          </Empty>
        </div>
      )}
    </div>
  );
};
export default QuizSection;
// Usage example:
// <QuizSection quizzes={data.quiz} />