
'use client'
import { useEffect } from 'react'
import Image from 'next/image'
import { 
  Skeleton, Card, Tag, Button, Divider, Typography, 
  Modal, Form, Input, InputNumber, Switch, Upload, Table, 
  Space, Popconfirm, Avatar 
} from 'antd'
import { 
  DollarOutlined, UserOutlined, EyeInvisibleOutlined, 
  EditOutlined, DeleteOutlined, PlusOutlined, 
  UploadOutlined, PlayCircleOutlined, OrderedListOutlined 
} from '@ant-design/icons'
import { toast } from 'react-toastify'
import Link from 'next/link'
import { gsap } from 'gsap'

const { Title, Text, Paragraph } = Typography
const { TextArea } = Input

const ViewCourseTeacher = ({
  dict, locale, id, course, loading, error, playlistData,
  editModalVisible, setEditModalVisible, playlistModalVisible, setPlaylistModalVisible,
  videoModalVisible, setVideoModalVisible, editPlaylistModalVisible, setEditPlaylistModalVisible,
  editVideoModalVisible, setEditVideoModalVisible, form, newVideoTitle, setNewVideoTitle,
  playListTitle, setPlayListTitle, playListDescription, setPlayListDescription,
  poster, setPoster, posterPlaylist, setPosterPlaylist, videoFile, setVideoFile,
  videoPoster, setVideoPoster, playlistId, setPlaylistId, editPlaylistId, setEditPlaylistId,
  editVideoId, setEditVideoId, editVideo, setEditVideo, posterPreview, setPosterPreview,
  updateCourse, addNewPlaylist, deletePlaylist, handleEditPlaylist, updatePlaylist,
  addVideoToPlaylist, deleteVideoFromPlaylist, handleEditVideo, updateVideo, togglePublishStatus,
  deleteCourse
}) => {
  // GSAP Animations
  useEffect(() => {
    gsap.fromTo(
      '.course-card',
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }
    )
    gsap.fromTo(
      '.modal-content',
      { scale: 0.8, opacity: 0 },
      { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)', stagger: 0.2 }
    )
  }, [editModalVisible, playlistModalVisible, videoModalVisible, editPlaylistModalVisible, editVideoModalVisible])

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Skeleton active paragraph={{ rows: 8 }} />
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Card className="text-center shadow-lg rounded-xl">
          <Title level={4}>Error Loading Course</Title>
          <Text type="danger">{error}</Text>
          <div className="mt-4">
            <Button type="primary" className="bg-blue-600 hover:bg-blue-700">
              Retry
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Card className="text-center shadow-lg rounded-xl">
          <Title level={4}>Course Not Found</Title>
          <Text>The requested course could not be found.</Text>
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto p-2 md:p-4">
      {/* Edit Course Modal */}
      <Modal
        title="Edit Course Details"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        onOk={() => form.submit()}
        okText="Save Changes"
        footer={null}
        width={800}
        className="modal-content"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={updateCourse}
          initialValues={{
            title: course.title,
            description: course.description,
            price: course.price,
            isPublished: course.isPublished
          }}
        >
          <Form.Item
            label="Course Title"
            name="title"
            rules={[{ required: true, message: 'Please input course title!' }]}
          >
            <Input className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Description"
            name="description"
            rules={[{ required: true, message: 'Please input course description!' }]}
          >
            <TextArea rows={4} className="rounded-md" />
          </Form.Item>
          <Form.Item
            label="Price ($)"
            name="price"
            rules={[{ required: true, message: 'Please input course price!' }]}
          >
            <InputNumber min={0} className="w-full rounded-md" />
          </Form.Item>
          <Form.Item
            label="Publish Status"
            name="isPublished"
            valuePropName="checked"
          >
            <Switch className="bg-gray-300" />
          </Form.Item>
          <Form.Item label="Course Image">
            {course.image && typeof course.image === 'string' && (
              <div className="mb-3">
                <Avatar
                  shape="square"
                  src={`http://localhost:5000/${course.image}`}
                  size={80}
                  alt="Current Course Image"
                  className="border border-gray-200"
                />
              </div>
            )}
            <Upload
              name="image"
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              onChange={info => {
                if (info.fileList && info.fileList.length > 0) {
                  setPoster(info.fileList[0].originFileObj)
                } else {
                  setPoster(null)
                }
              }}
            >
              <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
                Click to upload
              </Button>
            </Upload>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit" className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Playlist Modal */}
      <Modal
        title="Add New Playlist"
        open={playlistModalVisible}
        onCancel={() => setPlaylistModalVisible(false)}
        onOk={addNewPlaylist}
        okText="Add Playlist"
        className="modal-content"
      >
        <Space direction="vertical" className="w-full">
          <Input
            placeholder="Playlist Title"
            value={playListTitle}
            onChange={(e) => setPlayListTitle(e.target.value)}
            className="rounded-md"
          />
          <Input
            placeholder="Playlist Description"
            value={playListDescription}
            onChange={(e) => setPlayListDescription(e.target.value)}
            className="rounded-md"
          />
          <Upload
            name="poster"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            onChange={info => {
              if (info.fileList && info.fileList.length > 0) {
                setPosterPlaylist(info.fileList[0].originFileObj)
                setPosterPreview(URL.createObjectURL(info.fileList[0].originFileObj))
              } else {
                setPosterPlaylist(null)
                setPosterPreview(null)
              }
            }}
          >
            <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Upload Poster
            </Button>
          </Upload>
        </Space>
      </Modal>

      {/* Edit Playlist Modal */}
      <Modal
        title="Edit Playlist"
        open={editPlaylistModalVisible}
        onCancel={() => setEditPlaylistModalVisible(false)}
        onOk={async () => {
          await updatePlaylist(editPlaylistId)
          setEditPlaylistModalVisible(false)
          setPlayListTitle('')
          setPlayListDescription('')
          setPosterPlaylist(null)
          setPosterPreview(null)
        }}
        okText="Update Playlist"
        className="modal-content"
      >
        <Form layout="vertical">
          <Form.Item label="Playlist Title" required>
            <Input
              value={playListTitle}
              onChange={e => setPlayListTitle(e.target.value)}
              placeholder="Enter playlist title"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item label="Playlist Description" required>
            <Input
              value={playListDescription}
              onChange={e => setPlayListDescription(e.target.value)}
              placeholder="Enter playlist description"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item label="Poster">
            {posterPreview && (
              <div className="mb-3">
                <Avatar
                  shape="square"
                  src={posterPreview}
                  size={80}
                  alt="Current Poster"
                  className="border border-gray-200"
                />
              </div>
            )}
            <Upload
              name="poster"
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              onChange={info => {
                if (info.fileList && info.fileList.length > 0) {
                  setPosterPlaylist(info.fileList[0].originFileObj)
                  setPosterPreview(URL.createObjectURL(info.fileList[0].originFileObj))
                } else {
                  setPosterPlaylist(null)
                  setPosterPreview(null)
                }
              }}
            >
              <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
                Upload Poster
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Add Video Modal */}
      <Modal
        title="Add New Playlist Video"
        open={videoModalVisible}
        onCancel={() => setVideoModalVisible(false)}
        onOk={addVideoToPlaylist}
        okText="Add Playlist Video"
        className="modal-content"
      >
        <Space direction="vertical" className="w-full">
          <Input
            placeholder="Video Title"
            value={newVideoTitle}
            onChange={(e) => setNewVideoTitle(e.target.value)}
            className="rounded-md"
          />
          <Upload
            name="poster"
            listType="picture"
            beforeUpload={() => false}
            maxCount={1}
            onChange={info => {
              if (info.fileList && info.fileList.length > 0) {
                setVideoPoster(info.fileList[0].originFileObj)
              } else {
                setVideoPoster(null)
              }
            }}
          >
            <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Upload Poster
            </Button>
          </Upload>
          <Upload
            name="video"
            accept="video/*"
            listType="text"
            beforeUpload={() => false}
            maxCount={1}
            onChange={info => {
              if (info.fileList && info.fileList.length > 0) {
                setVideoFile(info.fileList[0].originFileObj)
              } else {
                setVideoFile(null)
              }
            }}
          >
            <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
              Upload Video
            </Button>
          </Upload>
        </Space>
      </Modal>

      {/* Edit Video Modal */}
      <Modal
        title="Edit Video"
        open={editVideoModalVisible}
        onCancel={() => setEditVideoModalVisible(false)}
        onOk={async () => {
          await updateVideo(editVideoId)
          setEditVideoModalVisible(false)
          setNewVideoTitle('')
          setVideoPoster(null)
        }}
        okText="Update Video Details"
        className="modal-content"
      >
        <Form layout="vertical">
          <Form.Item label="Video Title" required>
            <Input
              value={newVideoTitle}
              onChange={e => setNewVideoTitle(e.target.value)}
              placeholder="Enter video title"
              className="rounded-md"
            />
          </Form.Item>
          <Form.Item label="Poster">
            {videoPoster && typeof videoPoster === 'string' && (
              <div className="mb-3">
                <Avatar
                  shape="square"
                  src={videoPoster}
                  size={80}
                  alt="Current Poster"
                  className="border border-gray-200"
                />
              </div>
            )}
            <Upload
              name="poster"
              listType="picture"
              beforeUpload={() => false}
              maxCount={1}
              onChange={info => {
                if (info.fileList && info.fileList.length > 0) {
                  setVideoPoster(info.fileList[0].originFileObj)
                  setPosterPreview(URL.createObjectURL(info.fileList[0].originFileObj))
                } else {
                  setVideoPoster(null)
                  setPosterPreview(null)
                }
              }}
            >
              <Button icon={<UploadOutlined />} className="border-blue-500 text-blue-500 hover:bg-blue-50">
                Upload Poster
              </Button>
            </Upload>
          </Form.Item>
        </Form>
      </Modal>

      {/* Main Course View */}
      <div className="flex flex-col gap-4 md:gap-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <Title level={2} className="!mb-0 text-gray-800">Course Management</Title>
          <Space wrap>
            <Button 
              type="primary" 
              icon={<PlusOutlined />}
              onClick={() => setPlaylistModalVisible(true)}
              className="bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
            >
              Add Playlist
            </Button>
            <Button 
              icon={<EditOutlined />}
              onClick={() => setEditModalVisible(true)}
              className="border-blue-500 text-blue-500 hover:bg-blue-50 transition-transform transform hover:scale-105"
            >
              Edit Course
            </Button>
            <Popconfirm
              title="Are you sure you want to delete this course?"
              onConfirm={() => deleteCourse(id)}
              okText="Yes"
              cancelText="No"
            >
              <Button 
                danger 
                icon={<DeleteOutlined />}
                className="border-red-500 text-red-500 hover:bg-red-50 transition-transform transform hover:scale-105"
              >
                Delete Course
              </Button>
            </Popconfirm>
          </Space>
        </div>

        {/* Course Card */}
        <Card
          cover={
            course.image ? (
              <div className="relative w-full h-48 sm:h-64 md:h-96 overflow-hidden">
                <Image
                  src={`http://localhost:5000/${course.image}`}
                  alt={course.title}
                  fill
                  className="object-cover transition-transform transform hover:scale-110"
                  priority
                />
              </div>
            ) : (
              <div className="h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
                <Text type="secondary">No Image Available</Text>
              </div>
            )
          }
          className="course-card shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
        >
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            {/* Course Info */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
                <Title level={2} className="!mb-0 text-gray-800">{course.title}</Title>
                <Switch
                  checkedChildren="Published"
                  unCheckedChildren="Unpublished"
                  checked={course.isPublished}
                  onChange={togglePublishStatus}
                  className="!mt-2 sm:!mt-0 w-fit px-2 bg-gray-300"
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Tag icon={<DollarOutlined />} color="green" className="rounded-md">
                  Price: ${course.price}
                </Tag>
                <Tag icon={<UserOutlined />} color="blue" className="rounded-md">
                  Teacher ID: {course.teacher}
                </Tag>
              </div>
              <Divider orientation="left" className="text-gray-600">Description</Divider>
              <Paragraph className="text-gray-700 whitespace-pre-line break-words">
                {course.description || 'No description provided'}
              </Paragraph>
            </div>
            {/* Stats Card */}
            <div className="md:w-72 w-full flex-shrink-0">
              <Card className="sticky top-4 shadow-md rounded-xl">
                <Title level={4} className="mb-4 flex items-center gap-2 text-gray-800">
                  <OrderedListOutlined /> Course Stats
                </Title>
                <div className="space-y-3 mb-6">
                  <div>
                    <Text strong>Status:</Text>
                    <div className="mt-1">
                      {course.isPublished ? (
                        <Tag color="green" className="rounded-md">Published</Tag>
                      ) : (
                        <Tag color="orange" className="rounded-md">Unpublished</Tag>
                      )}
                    </div>
                  </div>
                  <div>
                    <Text strong>Price:</Text>
                    <div className="mt-1">
                      <Text>${course.price}</Text>
                    </div>
                  </div>
                  <div>
                    <Text strong>Playlists:</Text>
                    <div className="mt-1">
                      <Text>{playlistData?.length || 0} playlist</Text>
                    </div>
                  </div>
                </div>
                <Button 
                  type="primary" 
                  block 
                  icon={<PlusOutlined />}
                  onClick={() => setPlaylistModalVisible(true)}
                  className="bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Add Playlist
                </Button>
              </Card>
            </div>
          </div>
        </Card>

        {/* Playlist Section */}
        <Card
          title={
            <div className="flex items-center gap-2 text-gray-800">
              <PlayCircleOutlined /> Course Playlists
            </div>
          }
          className="course-card shadow-lg rounded-xl hover:shadow-xl transition-shadow duration-300"
        >
          {playlistData?.length > 0 ? (
            <Table
              dataSource={playlistData}
              rowKey={pl => pl._id}
              pagination={false}
              scroll={{ x: true }}
              expandable={{
                expandedRowRender: (playlist) => (
                  <Table
                    dataSource={playlist.videos || []}
                    rowKey={v => v._id}
                    pagination={false}
                    scroll={{ x: true }}
                    columns={[
                      {
                        title: 'Video Title',
                        dataIndex: 'title',
                        key: 'title',
                        render: (text, record) => (
                          <a href={record.url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">{text}</a>
                        ),
                      },
                      {
                        title: 'Video URL',
                        dataIndex: 'url',
                        key: 'url',
                        render: (url, record) => (
                          url ? (
                            <Link
                              href={`http://localhost:4000/${locale}/dashboard/course/${id}/playlist/${record.playList}/video/${record._id}`}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <Avatar
                                shape="square"
                                src={
                                  record.poster
                                    ? `http://localhost:5000/${record.poster?.replace(/..\//, '')}`
                                    : undefined
                                }
                                icon={<PlayCircleOutlined />}
                                alt="Video Poster"
                                className="border border-gray-200 transition-transform transform hover:scale-110"
                              />
                            </Link>
                          ) : (
                            <Avatar shape="square" icon={<PlayCircleOutlined />} className="border border-gray-200" />
                          )
                        ),
                      },
                      {
                        title: 'Actions',
                        key: 'actions',
                        render: (_, video) => (
                          <Space>
                            <Button
                              icon={<EditOutlined />}
                              onClick={() => handleEditVideo(video)}
                              className="border-blue-500 text-blue-500 hover:bg-blue-50"
                            >
                              Edit
                            </Button>
                            <Popconfirm
                              title="Delete this video?"
                              onConfirm={() => deleteVideoFromPlaylist(video._id)}
                              okText="Yes"
                              cancelText="No"
                            >
                              <Button type="link" danger icon={<DeleteOutlined />} />
                            </Popconfirm>
                          </Space>
                        ),
                      },
                    ]}
                  />
                ),
                expandRowByClick: true,
                expandIcon: ({ expanded, onExpand, record }) =>
                  <Button
                    type="link"
                    icon={expanded ? <EyeInvisibleOutlined /> : <PlayCircleOutlined />}
                    onClick={e => { e.stopPropagation(); onExpand(record, e); }}
                    className="text-blue-500"
                  />
              }}
              columns={[
                {
                  title: 'Playlist Title',
                  dataIndex: 'title',
                  key: 'title',
                },
                {
                  title: 'Description',
                  dataIndex: 'description',
                  key: 'description',
                  render: (text) => {
                    const shortText = text && text.length > 40 ? text.slice(0, 40) + '...' : text
                    return shortText
                  },
                },
                {
                  title: 'Poster',
                  dataIndex: 'poster',
                  key: 'poster',
                  render: (poster) =>
                    poster && typeof poster === "string" && poster.trim() !== "" ? (
                      <Avatar
                        shape="square"
                        src={`http://localhost:5000/${poster.replace(/^(\.\.\/)+/, '')}`}
                        alt="Poster"
                        className="border border-gray-200 transition-transform transform hover:scale-110"
                      />
                    ) : (
                      <Avatar shape="square" src="/images/sana-avatar.png" alt="Default Avatar" className="border border-gray-200" />
                    ),
                },
                {
                  title: 'Actions',
                  key: 'actions',
                  render: (_, playlist) => (
                    <Space>
                      <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={() => {
                          setNewVideoTitle('')
                          setVideoFile(null)
                          setPlaylistId(playlist._id)
                          setVideoModalVisible(true)
                        }}
                        className="bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
                      >
                        Add Video
                      </Button>
                      <Button
                        icon={<EditOutlined />}
                        onClick={() => handleEditPlaylist(playlist)}
                        className="border-blue-500 text-blue-500 hover:bg-blue-50"
                      >
                        Edit
                      </Button>
                      <Popconfirm
                        title="Delete this playlist?"
                        onConfirm={() => deletePlaylist(playlist._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button type="link" danger icon={<DeleteOutlined />} />
                      </Popconfirm>
                    </Space>
                  ),
                },
              ]}
            />
          ) : (
            <div className="text-center py-8">
              <Text type="secondary">No playlists added to this course yet</Text>
              <div className="mt-4">
                <Button
                  type="primary"
                  icon={<PlusOutlined />}
                  onClick={() => setPlaylistModalVisible(true)}
                  className="bg-blue-600 hover:bg-blue-700 transition-transform transform hover:scale-105"
                >
                  Add First Playlist
                </Button>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}

export default ViewCourseTeacher
