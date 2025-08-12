import Link from 'next/link';
import { useState } from 'react';
import QuizSection from './QuizSection';
import { LogIn } from 'lucide-react';
import { FiPlus, FiVideo } from 'react-icons/fi';
import NoData from './NoData';
import PlaylistQuizList from './PlaylistQuizList';
import PlaylistVideoList from './PlaylistVideoList';
import PlaylistVideoListTeacherControll from './PlaylistVideoListTeacherControll';
import PlaylistQuizModelTeacherControll from './PlaylistQuizModelTeacherControll';



const PlaylistSection = ({
  playlist,
  locale,
  courseId,
  onAddQuiz,
onEditQuestion,
onDeleteQuestion,
onAddVideo,
  onEditVideo,
  onDeleteVideo,
  onEditQuiz,
  onDeleteQuiz,
onAddQuestion,
openAddQuestionModel,
  setOpenAddQuestionModel,
editQuestion,
setQuizModalVisible

}) => {
  const [activeRows, setActiveRows] = useState(['videos']); // Default to videos open
  const [isOpenVideo,setIsOpenVideo]=useState(true) 
  const [isOpenQuiz,setIsOpenQuiz]=useState(false) 
console.log(playlist?.quizzes);


  const handleRowChange = (keys) => {
    setActiveRows(keys);
  };

  return (
    <div>
<section className='flex flex-col gap-4 p-8 bg-white rounded-lg shadow-md'>
<div className='flex items-center justify-between mb-4 bg-white border-b-2 border-blue-400 p-4 rounded-lg'>
  <h3>{playlist.title}</h3>
  <button className='bg-blue-600 text-white px-4 flex gap-2 py-2 rounded'><FiPlus /><span className='hidden md:inline'>Add Quiz</span></button>
</div>
<div className='flex items-center gap-2 mb-4 bg-white p-4 rounded-lg'>
  <div className={`flex items-center gap-2 cursor-pointer ${activeRows.includes('videos') ? 'text-blue-600' : ''}`} 
  onClick={() => handleRowChange(['videos'])}><span>Videos</span>  <span className={`${activeRows.includes('videos') ? 'text-blue-600' : ''} border-blue-600 border-2 px-1 rounded-lg`}>{playlist.videos?.length || 0} </span></div>
  <div className={`flex items-center cursor-pointer gap-2 ${activeRows.includes('quizzes') ? 'text-blue-600' : ''}`} onClick={() => handleRowChange(['quizzes'])}><span>Quizzes</span>  <span className={`${activeRows.includes('quizzes') ? 'text-blue-600' : ''} border-blue-600 border-2 px-1 rounded-lg`}>{playlist.quizzes?.length || 0} </span></div>

</div>
{activeRows.includes('videos')&&(
  <div>
           <div className={`flex items-center gap-2 text-blue-600 rounded-lg`}  >
        <FiVideo size={20}/>
        <span>Videos</span>  </div>
{  playlist.videos?.length !== 0  ? (
playlist.videos?.map((video) => (
  <PlaylistVideoListTeacherControll onEditVideo={onEditVideo} onDeleteVideo={onDeleteVideo} key={video._id} videos={video} locale={locale} courseId={courseId} playlistId={playlist._id} />
))
 
  ):(
   <NoData data={'Videos'}/>
  )}
  </div>
)
}
{activeRows.includes('quizzes')&&
(  playlist.quizzes?.length !== 0 ? (

 
 
 <QuizSection quizzes={playlist.quizzes}  onAddQuestion={onAddQuestion} onDeleteQuiz={onDeleteQuiz}
            onDeleteQuestion={onDeleteQuestion} onEditQuestion={onEditQuestion}
            onEditQuiz={onEditQuiz} questionModelVisable={openAddQuestionModel} setQuizModalVisible={setQuizModalVisible} setQuestionModalVisible={setOpenAddQuestionModel} />

 
  ):(
   <NoData data={'Quizzes'}/>
  ))
}
</section>


    </div>
  );
};

export default PlaylistSection;