import { Collapse, List, Avatar, Button, Typography, Tabs } from 'antd'
import { PlayCircleOutlined, QuestionCircleOutlined } from '@ant-design/icons'
import Link from 'next/link'
import PlaylistVideoList from './PlaylistVideoList'
import PlaylistQuizList from './PlaylistQuizList'

const { Text } = Typography
const { TabPane } = Tabs

const CoursePlaylists = ({ playlistData, locale, courseId }) => {
  console.log(playlistData);
  
  const items = playlistData.map(playlist => ({
    key: playlist._id,
    label: (
      <span>
        {playlist.title}
        <span className="text-gray-500 ml-2">
          {playlist.videos?.length || 0} videos • {playlist.quizzes?.length || 0} quizzes
        </span>
      </span>
    ),
    children: (
      <Tabs defaultActiveKey="1">
        <TabPane
          tab={
            <span>
              <PlayCircleOutlined />
              Videos
            </span>
          }
          key="1"
        >
          <PlaylistVideoList
            videos={playlist.videos}
            locale={locale}
            courseId={courseId}
            playlistId={playlist._id}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <QuestionCircleOutlined className="mr-2" />
              Quizzes
            </span>
          }
          key="2"
        >
         
          <List
            dataSource={playlist.quizzes || []}
            renderItem={quiz => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar icon={<QuestionCircleOutlined />} />}
                  title={quiz.title}
                 
                />
                {
                  quiz?.progress==null?  <Link href={`/${locale}/course/${courseId}/quiz/${quiz._id}`}>
                  <Button type="primary">Take Quiz</Button>
                </Link>:
                <span>Your Aready get this quiz</span>
                }
              
              </List.Item>
            )}
          />
        </TabPane>
      </Tabs>
    ),
  }))

  return <Collapse accordion items={items} />
}

export default CoursePlaylists