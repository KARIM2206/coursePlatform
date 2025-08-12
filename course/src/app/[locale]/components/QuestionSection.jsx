'use client'

import React from 'react';
import {  FiEdit, FiTrash } from 'react-icons/fi';
import ControlDeletemodel from './ControlDeletemodel';



const QuestionSection = ({ question, qIndex,onEditQuestion,onDeleteQuestion }) => {
  const [isDeleting, setIsDeleting] = React.useState(false);
  return (
    <section>
      <div className='w-full rounded-lg shadow-lg px-4 py-2 mb-4 flex flex-col gap-2'>
     <div className='flex justify-between items-center '>
        <div className='flex items-center gap-2 '>
      <span className='font-bold rounded-full bg-blue-500 text-white w-8 h-8 flex items-center justify-center'>{qIndex + 1}</span>
        <h3>{question?.questionText}</h3>
     </div>
     <div className='flex items-center gap-2 '>
      <button className='text-blue-600 '><FiEdit size={20} onClick={() => onEditQuestion(question._id,question)} /></button>
      <button className='text-red-600'  onClick={(e) =>{ e.preventDefault()
        setIsDeleting(true)}}><FiTrash size={20} /></button>
     </div>
     {
      isDeleting && (
        <ControlDeletemodel deleteModel={onDeleteQuestion} setDeleteModel={setIsDeleting} quizId={question._id}/>
      )}
     </div>
   
     <h4 className='font-semibold '>Options</h4>
     <div className='flex flex-col gap-2'>
      {question?.options?.map((option, index) => (
        <div key={index} className={`'flex items-center gap-2' ${question.correctAnswer === option ? 'text-blue-500' : 'text-gray-800'}`}>
          <span className='text-gray-600'>{String.fromCodePoint(65 + index)}.</span>
          <span>{option?.length>50?option.substring(0, 50)+"...":option.substring(0, 50)}</span>
        
        </div>
      ))}
      </div>
      </div>

    </section>
   
  );
};

export default QuestionSection;