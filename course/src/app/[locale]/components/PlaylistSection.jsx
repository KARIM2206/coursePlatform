import { Collapse, Button, List, Avatar, Typography, Space, Tag, Card, Popconfirm } from 'antd';
import { PlayCircleOutlined, FileTextOutlined, PlusOutlined, EditOutlined, DeleteOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { useState } from 'react';
import QuizSection from './QuizSection';
import { LogIn } from 'lucide-react';
import { FiVideo } from 'react-icons/fi';

const { Panel } = Collapse;
const { Text, Title } = Typography;

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
onAddQuestion
}) => {
  const [activeRows, setActiveRows] = useState(['videos']); // Default to videos open
  const [isOpenVideo,setIsOpenVideo]=useState(true) 
  const [isOpenQuiz,setIsOpenQuiz]=useState(false) 
console.log(playlist?.quizzes);


  const handleRowChange = (keys) => {
    setActiveRows(keys);
  };

  return (
    <Card 
      title={playlist.title}
      extra={
        <Button 
          type="primary" 
          icon={<PlusOutlined />}
          onClick={() => onAddQuiz(playlist._id)}
        >
          Add Quiz
        </Button>
      }
      bordered={false}
      className="playlist-card"
      style={{ marginBottom: 24 }}
    >

      <Collapse
        bordered={false}
        activeKey={activeRows}
        onChange={handleRowChange}
        expandIconPosition="end"
        className="playlist-collapse"
      >
        <div className='p-4 flex gap-4 items-center'>
          <div className='relative'>
              <div className='flex items-center gap-1 hover:text-blue-600'>
            <FiVideo />
          <button className={`font-extrabold  `} onClick={()=>{
            setIsOpenQuiz(false)
            setIsOpenVideo(true)
          }}>Video</button>
          </div>
          {/* <div className={`w-full absolute bottom-0 h-1 rounded-sm  mt-1   ${isOpenVideo?' bg-blue-400 ':'bg-transparent'}`}></div> */}
</div>
         <div className={`relative flex flex-col gap-2 ${isOpenQuiz?'text-blue-600':''}`}>
          <div className='flex items-center gap-1 hover:text-blue-600 '>
          <QuestionCircleOutlined />
               <button className={`font-extrabold  `} onClick={()=>{
            setIsOpenQuiz(true)
            setIsOpenVideo(false)
          }}>Quiz</button>  
          </div>
     
          {/* <div className={`w-full absolute bottom-0 h-1 rounded-sm    ${isOpenQuiz?' bg-blue-400 ':'bg-transparent'}`}></div> */}
</div>
        </div>
        {/* Videos Section */}
      { isOpenVideo&& <Panel
          header={
            <Space>
              <PlayCircleOutlined style={{ color: '#1890ff' }} />
              <Text strong>Videos</Text>
              <Tag color="blue">{playlist.videos?.length || 0}</Tag>
            </Space>
          }
          key="videos"
          extra={
            <Button 
              size="small" 
              type="text" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAddVideo(playlist._id);
                // Add your add video handler here
              }}
            />
          }
        >
          {playlist.videos?.length > 0 ? (
            <List
              dataSource={playlist.videos}
              renderItem={(video) => (
                <List.Item 
                  key={video._id}
                  actions={[
                    <Button 
                      type="text" 
                      icon={<EditOutlined />} 
                      onClick={() => onEditVideo(video,video._id)}
                    />,
                    <Popconfirm
                      title="Are you sure you want to delete this video?" 
                      onConfirm={() => onDeleteVideo(video._id)}
                      okText="Yes" 
                      cancelText="No"
                      >
                       <Button 
                      type="text" 
                      danger 
                      icon={<DeleteOutlined />} 
                  
                    />
                    </Popconfirm>
                   ,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        shape="square"
                        size={64}
                        src={
                          video.poster
                            ? `http://localhost:5000/${video.poster?.replace(/..\//, '')}`
                            : null
                        }
                        icon={<PlayCircleOutlined />}
                        style={{ backgroundColor: '#f0f2f5' }}
                      />
                    }
                    title={
                      <Link
                        href={`http://localhost:4000/${locale}/dashboard/course/${courseId}/playlist/${playlist._id}/video/${video._id}`}
                        target="_blank"
                      >
                        {video.title}
                      </Link>
                    }
                    description={
                      <Text ellipsis={{ tooltip: video.description }}>
                        {video.description || 'No description available'}
                      </Text>
                    }
                  />
                </List.Item>
              )}
            />
          ) : (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Text type="secondary">No videos added yet</Text>
            </div>
          )}
        </Panel>}

        {/* Quizzes Section */}
       {isOpenQuiz&& <Panel
          header={
            <Space>
              <FileTextOutlined style={{ color: 'transparent' }} />
              <Text strong>Quizzes</Text>
              <Tag color="blue">{playlist.quizzes?.length || 0}</Tag>
            </Space>
          }
          key="quizzes"
          extra={
            <Button 
              size="small" 
              type="text" 
              icon={<PlusOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                onAddQuiz(playlist._id);
                // Add your add quiz handler here
              }}
            />
          }
        >
          {playlist.quizzes?.length > 0 ? (
           <QuizSection quizzes={playlist.quizzes}  onAddQuestion={onAddQuestion} onDeleteQuiz={onDeleteQuiz}
            onDeleteQuestion={onDeleteQuestion} onEditQuestion={onEditQuestion}
            onEditQuiz={onEditQuiz}/>
          ) : (
            <div style={{ textAlign: 'center', padding: 16 }}>
              <Text type="secondary">No quizzes added yet</Text>
              <div style={{ marginTop: 8 }}>
                <Button
                  type="dashed"
                  icon={<PlusOutlined />}
                  onClick={() => onAddQuiz(playlist._id)}
                >
                  Create First Quiz
                </Button>
              </div>
            </div>
          )}
        </Panel>}
      </Collapse>
    </Card>
  );
};

export default PlaylistSection;