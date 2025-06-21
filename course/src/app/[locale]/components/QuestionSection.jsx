import { CheckOutlined, DeleteOutlined, EditOutlined } from '@ant-design/icons';
import { Card, Tag, Space, Typography, Popconfirm, Button } from 'antd';
import React from 'react';
import { FiDelete } from 'react-icons/fi';

const { Text, Title } = Typography;

const QuestionSection = ({ question, qIndex,onEditQuestion,onDeleteQuestion }) => {
  return (
    <Card 
      className="question-card"
      style={{
        marginBottom: 16,
        borderRadius: 12,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)',
        transition: 'all 0.3s ease',
      
      }}
      hoverable
    >
      <div className="question-header flex items-center px-2 justify-between w-full " style={{ display: 'flex', alignItems: 'center', marginBottom: 12 }}>
       <div className='flex items-center'>
        <div className="question-index" style={{
          width: 32,
          height: 32,
          backgroundColor: '#1890ff',
          color: 'white',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: 16,
          flexShrink: 0
        }}>
          <Text strong style={{ color: 'white' }}>{qIndex + 1}</Text>
        </div>
        <Title level={5} style={{ margin: 0 }}>{question.questionText}</Title>
      </div>
      <div className='flex items-center gap-4 '>
    <EditOutlined className='text-blue-500 font-bold ' onClick={() => onEditQuestion(question._id, question)} />
   

<Popconfirm 
 title="Are you sure you want to delete this question?"

onConfirm={() => onDeleteQuestion(question._id)}
okText="Yes"
cancelText="No"
>
 <Button type="link" danger icon={<DeleteOutlined />} />
</Popconfirm>
</div>
</div>

      <div className="question-content" style={{ paddingLeft: 48 }}>
        <div className="options-section" style={{ marginBottom: 16 }}>
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Options:</Text>
          <Space size={[8, 8]} wrap>
            {question.options.map((option, index) => (
              <Tag 
                key={index}
                color={question.correctAnswer==option ? 'green' : 'default'}
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                  border: question.correctAnswer==option? 'none' : '1px solid #d9d9d9'
                }}
              >
                {question.correctAnswer==option && (
                  <CheckOutlined style={{ marginRight: 4 }} />
                )}
                {option}
              </Tag>
            ))}
          </Space>
        </div>

        <div className="answer-section">
          <Text strong style={{ display: 'block', marginBottom: 8 }}>Correct Answer:</Text>
          <Space size={[8, 8]} wrap>
            {Array.isArray(question.correctAnswer) ? (
              question.correctAnswer.map((answer, index) => (
                <Tag 
                  key={index}
                  color="green"
                  style={{
                    padding: '4px 12px',
                    borderRadius: 20,
                  }}
                >
                  {answer}
                </Tag>
              ))
            ) : (
              <Tag 
                color="green"
                style={{
                  padding: '4px 12px',
                  borderRadius: 20,
                }}
              >
                {question.correctAnswer}
              </Tag>
            )}
          </Space>
        </div>
      </div>
    </Card>
  );
};

export default QuestionSection;