'use client'

import QuestionSection from './QuestionSection';
import NoData from './NoData';
import { FiPlus } from 'react-icons/fi';
import { Trash } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import ControlDeletemodel from './ControlDeletemodel';
import AddQuestionModel from './AddQuistionModel';
const QuizSection = (
  { quizzes, onAddQuestion, onDeleteQuiz, onDeleteQuestion, onEditQuestion, onEditQuiz,setQuizModalVisible, questionModelVisable, setQuestionModalVisible}
  ) => {
  // console.log(quizzes[0]?.questions[0].correctAnswer,"quizzes");
  const [openDeleteModal, setOpenDeleteModal] = useState(false);
  const [openAddModal, setOpenAddModal] = useState(false);
  const deleteRef = useRef(null);

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
                <span className="text-sm" style={{ color: quiz?.questions?.length > 0 ? "blue" : "orange" }}>
                  {quiz?.questions?.length} questions
                </span>
              </div>

              {quiz?.questions?.length > 0 ? (
                <div className="mt-4">
                  <div className="flex flex-col gap-2">
                    {quiz?.questions?.map((question, qIndex) => (
                     <QuestionSection key={question._id}  question={question} qIndex={qIndex} onEditQuestion={onEditQuestion} onDeleteQuestion={onDeleteQuestion} /> 
                      
                    ))}
                  </div>
                </div>
              ) : (
                <div className="mt-3 text-center py-4">
                  <NoData data={'Questions'} />
                </div>
              )}

              <div className="mt-4 flex items-center  justify-end space-x-2">
                <button 
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  onClick={() =>{
                    setQuestionModalVisible(true);
                    onAddQuestion(quiz._id);
                  }}
                >
                 <FiPlus size={20} />
                  <span>Add Question</span>
                </button>
                <button
                  className="text-blue-600" 
               
                  onClick={(e) =>{
                    e.preventDefault()
                   setQuizModalVisible(true);
                    onEditQuiz(quiz,quiz._id);
                  } }
                >
                  Edit
                </button>
               <button>
                <Trash size={20} color='red' ref={deleteRef} onClick={() => setOpenDeleteModal(true)} />
               </button>
              </div>
              {
        openDeleteModal && (
          <ControlDeletemodel  deleteModel={onDeleteQuiz} setDeleteModel={setOpenDeleteModal} quizId={quiz._id}/>
        )

      }
    
  
            </div>
          ))}
        </div>
      ) : (
        <div className="mt-3 text-center py-4">
          <NoData data={'Quizzes'} />
        </div>
      )}
      
    </div>
  );
};
export default QuizSection;
// Usage example:
// <QuizSection quizzes={data.quiz} />