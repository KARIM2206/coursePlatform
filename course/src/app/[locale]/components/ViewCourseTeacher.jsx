"use client";
import React, { use, useContext, useEffect, useRef, useState } from "react";
import { Context } from "../CONTEXT/ContextProvider";
import Image from "next/image";
import motion from "framer-motion";


import { toast } from "react-toastify";
import Link from "next/link";
import {
  addQuestion,
  addQuiz,
  deleteQuestionInServer,
  deleteQuiz,
  editQuestionInServer,
  getQuestions,
  getQuiz,
  updateQuiz,
} from "../lib/server";
import PlaylistSection from "./PlaylistSection";
import { useRouter } from "next/navigation";
import { FiDelete, FiEyeOff, FiLoader, FiPenTool, FiPlayCircle, FiPlus, FiX } from "react-icons/fi";
import Skeleton from "./Skeleton";
import ImageDropzone from "./ImageDropzone";
import ControlModelCourse from "./ControlModelCourse";
import ControlAddModel from "./ControlAddModels";
import ControlDeletemodel from "./ControlDeletemodel";
import AddQuestionModel from "./AddQuistionModel";
// import { s } from 'framer-motion/dist/types.d-CtuPurYT'



const ViewCourseTeacher = ({ dict, locale, id }) => {

  const { token, user } = useContext(Context);
  const [course, setCourse] = useState(null);
  const [playListDetails, setPlayListDetails] = useState({
    title: "",
    description: "",
    poster: "",
  });
  const [videoDetails, setVideoDetails] = useState({
    title: "",
 videoFile:null,
    poster: "",
  });
  const hasMounted= useRef(false)
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [playlistModalVisible, setPlaylistModalVisible] = useState(false);
  const [videoModalVisible, setVideoModalVisible] = useState(false);
  const [newVideoTitle, setNewVideoTitle] = useState("");
  const [newVideoUrl, setNewVideoUrl] = useState("");
  const [playListTitle, setPlayListTitle] = useState("");
  const [playListDescription, setPlayListDescription] = useState("");
  const [poster, setPoster] = useState("");
  const [posterPlaylist, setPosterPlaylist] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [videoPoster, setVideoPoster] = useState(null);
  const [playlistId, setPlaylistId] = useState(null);
  const [videoInPlaylist, setVideoInPlaylist] = useState(null);
  const [editPlaylistModalVisible, setEditPlaylistModalVisible] =
    useState(false);
    const [isSaving, setIsSaving] = useState(false);
  const [editVideoModalVisible, setEditVideoModalVisible] = useState(false);
  const [deleteModel, setDeleteModel] = useState(false);
  const [playlistDeleteModelVisible, setPlaylistDeleteModelVisible] = useState(false);
  const [editPlaylistId, setEditPlaylistId] = useState(null);
  const [deletePlaylistId, setDeletePlaylistId] = useState(null);
  const [editVideoId, setEditVideoId] = useState(null);
  const [editVideo, setEditVideo] = useState(null);
  const [posterPreview, setPosterPreview] = useState(null);
  const [quizData, setQuizData] = useState([]);
  const [quizTitle, setQuizTitle] = useState("");
  const [quizDetails,setQuizDetails]=useState({title:""})
  const [quizModalVisible, setQuizModalVisible] = useState(false);
  const [currentQuizPlaylistId, setCurrentQuizPlaylistId] = useState(null);
  const [currentQuizId, setCurrentQuizId] = useState(null);
  const [questionModelVisable, setQuestionModalVisible] = useState(false);
  const [playlistData, setPlaylistData] = useState([]);
  const [questionText, setQuestionText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState("");
  const [currentQuestionId, setCurrentQuestionId] = useState(null);
  const [editVisible, setEditVisible] = useState(false);
  const [isEditQuiz, setIsEditQuiz] = useState(false);
  const [editQuestionData, setEditQuestionData] = useState([]);
  const [playlistDataShow,setplaylistDataShow]=useState([])
  const [playListStateId,setPlayListStateId]=useState(false)
  const [refresh, setRefresh] = useState(false);
  const router = useRouter();
  useEffect(() => {
    getCourse(id);
  }, [user, id]);
 const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target)
      ) {
        setEditPlaylistModalVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  useEffect(() => {
    if (!user?.role || !course) {
      return;
    }

    if (user?.role !== "teacher") {
      toast.warn(`you are not a teacher mr ${user?.name}`);
    router.push(`/${locale}/`);
    } else if (user && course?.teacher && user._id !== course.teacher) {
      toast.warn("You are not authorized to view this course");
      router.push(`/${locale}/`);
    } else {
      toast.success(`welcome mr ${user?.name}`);
    }
  }, [user, course?.teacher, router]);

  const getCourse = async (id) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:5000/api/course/teacher/${id}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      //   if (!response.ok) {
      //     throw new Error(response.statusText || 'Failed to fetch course data')
      //   }

      const data = await response.json();
      console.log(data);
      setCourse(data.course || data); // Use data.course if it exists, otherwise use data directly
      return data;
    } catch (error) {
      console.error("Error fetching course:", error);
      setError(error.message);
      return null;
    } finally {
      setLoading(false);
    }
  };
  console.log("tech", course?.teacher, "user", user?._id);

  const addNewPlaylist = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      console.log("this playlist details", playListDetails);

      //     Object.entries(playListDetails).forEach(([key, value]) => {

      //    if (key !== 'poster')formData.append(key, value);
      // });
      if (poster && typeof poster !== "string") {
        setPlayListDetails((prev) => {
          return { ...prev, poster: poster };
        });
        formData.append("poster", poster);
      }
      // console.log(poster,playListDescription,playListTitle,localStorage?.getItem('courseToken'));
      formData.append("title", playListDetails?.title);
      formData.append("description", playListDetails?.description);
      // formData.append('poster', poster)
      formData.append("course", id);

      const response = await fetch(
        `http://localhost:5000/api/playlist/create`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            courseToken: `Bearer ${localStorage?.getItem("courseToken")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add video to playlist");
      }

      const data = await response.json();

      localStorage.setItem("playlistToken", data.playlistToken);
      setCourse(data);
      // setPlayListDescription('')
      // setPlayListTitle('')
      setPlayListDetails({ title: "", description: "", poster: "" });
      setPoster(null);
      setRefresh(!refresh);
      setPlaylistModalVisible(false);
      toast.success("Video added to playlist successfully");
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error(error.message);
    }
  };
  const getPlaylists = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/playlist/course/${id}/playlists`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch playlists");
      }
      const data = await response.json();

      const playlistsWithData = await Promise.all(
        data.playLists.map(async (playlist) => {
          let videos = [];
          let quizzes = [];

          // جلب الفيديوهات
          try {
            const res = await fetch(
              `http://localhost:5000/api/video/playlist/${playlist._id}/videos`,
              {
                method: "GET",
                headers: {
                  Authorization: `Bearer ${token}`,
                },
              }
            );
            if (res.ok) {
              const videoData = await res.json();
              videos = videoData.videos || [];
            }
          } catch (err) {
            // يمكن تجاهل الخطأ أو طباعته
          }

          // جلب الكويزات مع الأسئلة
          try {
            const quizData = await getQuiz(playlist._id, token); // يجب أن تعيد مصفوفة الكويزات
            console.log(quizData);

            quizzes = await Promise.all(
              (quizData || []).map(async (quiz) => {
                let questions = [];
                try {
                  const questionRes = await getQuestions(quiz._id, token);
                  questions = questionRes?.questions || [];
                } catch (err) {}
                return { ...quiz, questions };
              })
            );
          } catch (err) {
            console.error(err);
          }

          return { ...playlist, videos, quizzes };
        })
      );
      setPlaylistData(playlistsWithData);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    }
  };
  const deletePlaylist = async ( deletePlaylistId) => {
   
    try {
      const response = await fetch(
        `http://localhost:5000/api/playlist/${deletePlaylistId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete playlist");
      }
      console.log(response);

      const data = await response.json();
      setPlaylistData((prevData) =>
        prevData.filter((playlist) => playlist._id !== deletePlaylistId)
      );
      setPlaylistDeleteModelVisible(false);
      toast.success("Playlist deleted successfully");
    } catch (error) {
      console.error("Error deleting playlist:", error);
      toast.error(error.message);
    }
  };
  const handleEditPlaylist = (playlist) => {
    setEditPlaylistId(playlist._id);
    setPlayListTitle(playlist.title);
    setPlayListDescription(playlist.description);
    setPosterPlaylist(
      playlist.poster
        ? `http://localhost:5000/${playlist.poster.replace(/..\//, "")}`
        : null
    );
    setPosterPreview(
      playlist.poster
        ? `http://localhost:5000/${playlist.poster.replace(/..\//, "")}`
        : null
    );
setPlayListDetails({title:playlist?.title,description:playlist?.description,poster:playlist?.poster})
    // Or set to playlist.poster if you want to show current poster
    setEditPlaylistModalVisible(true);
  };
  const updatePlaylist = async () => {
 
    try {
      const formData = new FormData();
      // console.log(poster,playListDescription,playListTitle,localStorage?.getItem('courseToken'));
      Object.entries(playListDetails).forEach(([key, value]) => {
        if (key !== "poster") formData.append(key, value);
      });
      if (posterPlaylist && typeof posterPlaylist !== "string") {
        formData.append("poster", posterPlaylist);
      }
      formData.append("course", id);
      const response = await fetch(
        `http://localhost:5000/api/playlist/${editPlaylistId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            courseToken: `Bearer ${localStorage?.getItem("courseToken")}`,
          },
          body: formData,
        }
      );
      console.log(response,'tthis response');
      
      if (!response.ok) {
        throw new Error("Failed to update playlist");
      }
      console.log(response);

      const data = await response.json();
      // console.log(data);
      setPlayListDetails({title:"", description: "", poster: null});
      setPlaylistData((prevData) =>
        prevData.filter((playlist) => playlist._id !== editPlaylistId)
      );
      setEditPlaylistModalVisible(false)
      setRefresh(r=>!r)
      toast.success("Playlist update successfully");
    } catch (error) {
      console.error("Error update playlist:", error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (token == null) return;

    getPlaylists();

    //   getCourse(id)
    // getVideoInPlaylist(playlistId)
  }, [id, token, refresh]);
 

  const handlePosterChange = (info) => {
    if (info.fileList && info.fileList.length > 0) {
      const file = info.fileList[0].originFileObj;
      setPosterPlaylist(file);
      setPosterPreview(URL.createObjectURL(file)); // توليد معاينة مؤقتة
    } else {
      setPosterPlaylist(null);
      setPosterPreview(null);
    }
  };
  const updateCourse = async () => {
   
    try {
      const formData = new FormData();
     formData.append('title',course.title)
     formData.append('description',course.description)
     formData.append('isPublished',course.isPublished)
     formData.append('price',course.price)
      if (poster && typeof poster !== "string") {
        formData.append("image", poster);
      }
      const response = await fetch(
        `http://localhost:5000/api/course/${id}/update`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        console.log(response);

        throw new Error("Failed to update course");
      }

      const data = await response.json();
      // تحقق من شكل البيانات
      setCourse(null); // استخدم data.course إذا كان موجودًا
      console.log(data);

      toast.success("Course updated successfully");
      setEditModalVisible(false);
      // يمكنك أيضًا إعادة جلب البيانات من السيرفر للتأكد
      getCourse(id);
    } catch (error) {
      console.error("Error updating course:", error);
      toast.error(error.message);
    }
  };

  const deleteCourse = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/course/${id}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to delete course");
      }
      toast.success("Course deleted successfully");
      // يمكنك إعادة التوجيه لصفحة الدورات أو الرئيسية بعد الحذف
      window.location.href = "/courses"; // عدل المسار حسب مشروعك
    } catch (error) {
      console.error("Error deleting course:", error);
      toast.error(error.message);
    }
  };

  const handleAddVideo = (playlistId) => {
    setNewVideoTitle("");
    setVideoFile(null);
    setPlaylistId(playlistId);
    
    setVideoPoster(null);
    setVideoDetails({title:"",videoFile:null,poster:null});

  };

  const addVideoToPlaylist = async (e) => {
 e.preventDefault()
   console.log('video details',videoDetails);
   
    if (!videoDetails.title || !videoPoster  || !videoFile) {
      toast.error("Please fill all fields");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", videoDetails.title);
      formData.append("video", videoFile);
      formData.append("poster", videoPoster);
      formData.append("playList", playlistId); // Assuming you store the playlist token in localStorage
      const response = await fetch(`http://localhost:5000/api/video/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      console.log(response);

      if (!response.ok) {
        throw new Error("Failed to add video to playlist");
      }

      const data = await response.json();

      setNewVideoTitle("");
      setVideoFile(null);
      setVideoPoster(null);
          setVideoDetails({title:"",videoFile:null,poster:null});

      setVideoModalVisible(false);
      setRefresh(!refresh);
      getPlaylists();
      toast.success("Video added to playlist successfully");
    } catch (error) {
      console.error("Error adding video:", error);
      toast.error(error.message);
    }
  };

  const deleteVideoFromPlaylist = async (videoId) => {
    try {
      console.log("video id in delete api calling", videoId);

      const response = await fetch(
        `http://localhost:5000/api/video/${videoId}/delete`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            // 'Content-Type': 'application/json'
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete video from playlist");
      }

      setRefresh((r) => !r);

      toast.success("Video removed from playlist successfully");
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };
  const handleEditvideo = (video, videoId) => {
    setNewVideoTitle(video.title);
    setVideoPoster(
      video.poster
        ? `http://localhost:5000/${video.poster.replace(/..\//, "")}`
        : null
    );
    setEditVideo(video);
    setEditVideoId(videoId);
    setEditVideoModalVisible(true);
    setVideoDetails({title:video.title,videoFile:null,poster:video.poster})
  };
  const updateVideo = async () => {
  
    try {
      const formData = new FormData();
      formData.append("title", videoDetails.title);

      // إذا كان المستخدم رفع بوستر جديد أرسله، وإلا أرسل الرابط القديم (إذا كان موجود)
      if (videoPoster && typeof videoPoster !== "string") {
        formData.append("poster", videoPoster);
      }

      // إذا كنت تريد تحديث الـ playlistId أضفه هنا (حسب الحاجة)
      // formData.append('playList', playlistId);
      console.log("video id => ", editVideoId);

      const response = await fetch(
        `http://localhost:5000/api/video/${editVideoId}/update`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to edit video details");
      }

      const data = await response.json();
      // تحديث بيانات الفيديو في الواجهة مباشرة (اختياري)
      setPlaylistData((prevData) =>
        prevData.map((playlist) =>
          playlist.videos.some((video) => video._id === editVideoId)
            ? {
                ...playlist,
                videos: playlist.videos.map((video) =>
                  video._id === editVideoId
                    ? {
                        ...video,
                        title: newVideoTitle,
                        poster: data.videoCourse.poster
                          ? `http://localhost:5000/${data.videoCourse.poster.replace(/..\//, "")}`
                          : video.poster,
                      }
                    : video
                ),
              }
            : playlist
        )
      );
setEditPlaylistModalVisible(false);
          setNewVideoTitle("");
          setVideoPoster(null);
          setRefresh((r) => !r);
      getPlaylists(); // جلب البيانات من السيرفر لضمان التحديث
      toast.success("Video updated successfully");
    } catch (error) {
      console.error("Error editing video:", error);
      toast.error(error.message);
    }
  };
const togglePublishStatus = async () => {
  const updated = {
    ...course,
    isPublished: !course.isPublished,
  };
  
  // تحديث الحالة المحلية أولاً
  setCourse(updated);

  
  // ثم إرسال التحديث إلى الخادم
  setIsSaving(true);

};


// useEffect(() => {
//   // if (!hasMounted.current) {
//   //   hasMounted.current = true;
//   //   return;
//   // }

//   const update = async () => {
//     setIsSaving(true);
//     await updateCourse();
//     setIsSaving(false);
//   };

//   update();
// }, [course?.isPublished]);


useEffect(()=>{


    updateCourse(); // تأكد من أن updateCourse تقبل البيانات الجديدة
  setIsSaving(false);
},[isSaving])
  useEffect(() => {
    if (token == null) return;
    getCourse(id)
      .then((data) => {
        if (data.course) {
          setCourse(data.course);
         
        } else {
          message.error("Failed to load course data");
        }
      })
      .catch((error) => {
        console.error("Error in useEffect:", error);
        setError(error.message);
      });
  }, [id, token]);
  // quiz api calling
  const handleAddQuiz = async (playlistId) => {
    setCurrentQuizPlaylistId(playlistId);
    setQuizDetails({title:""})
    setQuizModalVisible(true);
  };

  const submitQuiz = async (e) => {
    e.preventDefault()
    console.log(quizDetails.title);
    const title=quizDetails.title
    if (!quizDetails.title) {
      toast.error("Please enter quiz title");
      return;
    }
    try {
      await addQuiz(currentQuizPlaylistId, token, title);
      toast.success("Quiz added successfully");
      setQuizModalVisible(false);
   
      setQuizDetails({title:""})
      setCurrentQuizPlaylistId(null);
      setRefresh((r) => !r);
    } catch (error) {
      toast.error(error.message || "Failed to add quiz");
    }
  };
  const handleDeleteQuiz = async (quizId) => {
   
    try {
      await deleteQuiz(quizId, token);
      toast.success("Quiz deleted successfully");
      setRefresh((r) => !r); // لإعادة تحميل البيانات
    } catch (error) {
      toast.error(error.message || "Failed to delete quiz");
    }
  };
  const handleEditQuiz = (quiz,quizId) => {
    setCurrentQuizId(quizId);
    setQuizDetails({title:quiz.title})
    setIsEditQuiz(true)
  };
  const editQuiz= async (e) => {
    e.preventDefault()
    if (!quizDetails.title) {
      toast.error("Please enter quiz title");
      return;
    }
    try {
      await updateQuiz(currentQuizId, token, quizDetails.title);
      toast.success("Quiz updated successfully");
      setQuizModalVisible(false);
      setCurrentQuizId(null)
      setRefresh((r) => !r); // لإعادة تحميل البيانات
    } catch (error) {
      toast.error(error.message || "Failed to update quiz");
    }
  }
  const handleOptionChange = (value, idx) => {
    const newOptions = [...options];
    newOptions[idx] = value;
    setOptions(newOptions);
  };

  const handleAddQuestion = (quizId) => {
    console.log(quizId);

    setCurrentQuizId(quizId);
    setQuestionModalVisible(true);
    setCorrectAnswer("");
    setQuestionText("");
    setOptions(["", "", "", ""]);
    setEditVisible(false);
  };

  const submitQuestion = async () => {
    if (
      !questionText.trim() ||
      options.some((opt) => !opt.trim()) ||
      !correctAnswer.trim()
    ) {
      // يمكنك عرض رسالة خطأ هنا
      return;
    }
    try {
      const questionData = {
        questionText,
        options,
        correctAnswer,
      };
    

      await addQuestion(currentQuizId, token, questionData);
      toast.success("Question added successfully");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setQuestionModalVisible(false);
      setCurrentQuizId(null)
      setRefresh((r) => !r);
    } catch (error) {}
  };
  const handleEditQuestion = (questionId, question) => {
    console.log(questionId);
    setEditQuestionData(question);
    setCurrentQuestionId(questionId);
    setQuestionModalVisible(true);
    setEditVisible(true);
    setCorrectAnswer(question.correctAnswer);
    options.forEach((option, index) => {
      options[index] = question.options[index];
    });
    setQuestionText(question.questionText);
  };

  const editQuestion = async () => {
    if (
      !questionText.trim() ||
      options.some((opt) => !opt.trim()) ||
      !correctAnswer.trim()
    ) {
      // يمكنك عرض رسالة خطأ هنا
      return;
    }
    try {
      const questionData = {
        questionText,
        options,
        correctAnswer,
      };
      console.log(currentQuestionId, questionData);

      await editQuestionInServer(currentQuestionId, token, questionData);
      toast.success("Question edited successfully");
      setQuestionText("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer("");
      setQuestionModalVisible(false);
      setRefresh((r) => !r);
      setEditVisible(false);
    } catch (error) {
      console.log({ error });
    }
  };
  const handleDeleteQuestion = async (questionId) => {
    try {
      await deleteQuestionInServer(questionId, token);
      toast.success("Question deleted successfully");

      setRefresh((r) => !r);
    } catch (error) {
      console.log({ error });
    }
  };
 

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <Skeleton rows={5} />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">
          <h3>Error Loading Course</h3>
          <p className="text-red-500">{error}</p>
          <div className="mt-4">
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded"
              onClick={() => window.location.reload()}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center">
          <h3>Course Not Found</h3>
          <p>The requested course could not be found.</p>
        </div>
      </div>
    );
  }

  if (!user && !course) <FiLoader className="animate-spin text-2xl" />;

  return (
    <div className=" max-w-6xl mx-auto p-2 md:p-4">
      {" "}
      {/* Edit Course Modal */}
      {/* <div className='-translate-x-1/2 transform  z-20 sticky top-[20%] left-1/2'> */}
      <ControlModelCourse
        course={course}
        setCourse={setCourse}
        className="absolute top-1/2 left-1/2"
        setImage={setPoster}
        editModalVisible={editModalVisible}
        setEditModalVisible={setEditModalVisible}
        updateModel={updateCourse}
        formLabel={{
          title: "Course Title",
          description: "Course Description",
          price: "Price",
          publishStatus: "Publish Status",
        }}
        titleModel={"Update Course Details"}
      />
      {/* </div>  Add PlayList Modal */}
     { playlistModalVisible&&<ControlAddModel
        course={playListDetails}
        setCourse={setPlayListDetails}
        setImage={setPoster}
        editModalVisible={playlistModalVisible}
        updateModel={addNewPlaylist}
        poster={poster}
        setEditModalVisible={setPlaylistModalVisible}
        formLabel={{
          title: "Playlist Title",
          description: "Playlist Description",
        }}
        titleModel={"Add Playlist Details"}
      />}
     { quizModalVisible&&<ControlAddModel
        course={quizDetails}
        setCourse={setQuizDetails}
        
        editModalVisible={quizModalVisible}
        updateModel={isEditQuiz?editQuiz:submitQuiz}
       isQuiz={true}
        setEditModalVisible={setQuizModalVisible}
        formLabel={{
          title: "Quiz Title"
        }}
        titleModel={"Add quiz Details"}
      />}
    
    {videoModalVisible&&  <ControlAddModel
        course={videoDetails}
        setCourse={setVideoDetails}
        setImage={setVideoPoster}
        editModalVisible={videoModalVisible}
        updateModel={addVideoToPlaylist}
        poster={videoPoster}
        isVideo={true}
       
        videoFile={videoFile}
        setVideoFile={setVideoFile} 
        setEditModalVisible={setVideoModalVisible}
        formLabel={{
          title: "Video Title",
          
        }}
        titleModel={"Add Video Details"}
      />}
      
{ editPlaylistModalVisible&& <ControlModelCourse
    course={playListDetails}
    setCourse={setPlayListDetails}
    setImage={setPosterPlaylist}
    editModalVisible={editPlaylistModalVisible}
    setEditModalVisible={setEditPlaylistModalVisible}
    updateModel={updatePlaylist}
    formLabel={{
      title: "Playlist Title",
      description: "playlist Description",
    }}
    titleModel={"Update Playlist Details"}
  />}

{
  playlistDeleteModelVisible && (
    <ControlDeletemodel deleteModel={deletePlaylist}
    setDeleteModel={setPlaylistDeleteModelVisible}
    quizId={deletePlaylistId}
     /> )
}

{
  editVideoModalVisible&& <ControlModelCourse
    course={videoDetails}
    setCourse={setVideoDetails}
    setImage={setVideoPoster}
    editModalVisible={editVideoModalVisible}
    setEditModalVisible={setEditVideoModalVisible}
    updateModel={updateVideo}
    isVideo={true}
    formLabel={{
      title: "Video Title",
    
    }}
    
    titleModel={"Update Video Details"}
  />
}
  {questionModelVisable && (
    <AddQuestionModel options={options} setOptions={setOptions} correctAnswer={correctAnswer} setCorrectAnswer={setCorrectAnswer}
    questionText={questionText}
    setQuestionText={setQuestionText}
    openAddQuestionModel={questionModelVisable}
    setOpenAddQuestionModel={setQuestionModalVisible} 
    onAddQuestion={editVisible?editQuestion:submitQuestion} />
    
  )
}

      {/* Main Course View */}
      <div className="flex flex-col  gap-4 md:gap-6">
        {/* Header Actions */}
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3 mb-4">
          <h2  className="!mb-0">
            Course Management
          </h2>
          <div>
            <button
              type="button"
             className="border-2 border-grey-500 border-dashed bg-blue-300 text-black  px-4 py-2 rounded mr-2"
              onClick={() => setPlaylistModalVisible(true)}
            >
              Add PlayList
            </button>
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              onClick={() => setEditModalVisible(true)}
            >
              Edit Course
            </button>
         
              <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={(e) => {
                e.stopPropagation();
                e.preventDefault()
                setDeleteModel(true)}}>
                Delete Course
              </button>
            {
            deleteModel && (
              <ControlDeletemodel
                deleteModel={deleteCourse}
                setDeleteModel={setDeleteModel}
                quizId={course.id}
              />
            )
          }
          </div>
         
        </div>

        {/* Course Card */}
      <div className="shadow-lg mb-4 rounded-lg overflow-hidden bg-white">
  {/* Cover Image */}
  {course.image ? (
    <div className="relative w-full h-48 bg-primary sm:h-64 md:h-96 overflow-hidden">
      <img
        src={`http://localhost:5000/${course.image}`}
        alt={course.title}
        className="object-cover w-full h-full"
      />
    </div>
  ) : (
    <div className="h-48 sm:h-64 bg-gray-200 flex items-center justify-center">
      <span className="text-gray-500">No Image Available</span>
    </div>
  )}

  {/* Card Content */}
  <div className="p-6">
    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
      {/* Course Info */}
      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-0">{course.title}</h2>

  <form 
  onClick={(e) => {
    e.preventDefault();
    togglePublishStatus();
  }} 
  className="w-28 h-8"
>
  <label className="relative inline-flex items-center cursor-pointer">
    <input 
      type="checkbox" 
      checked={course.isPublished}
      onChange={() => {}}
      className="sr-only peer" // مخفي ولكن يظل متاحًا للوحة المفاتيح
    />
    
    {/* التوجل سويتش (الجزء المرئي) */}
    <div className="
      w-28 h-8 
      bg-gray-200 
      rounded-full 
      peer-checked:bg-blue-600 
      transition-colors 
      duration-500
    ">
      {/* النقطة المتحركة */}
      <div className={`
        absolute 
        top-1 left-1 
        w-6 h-6 
        bg-white 
        rounded-full 
        shadow-md 
        transition-transform 
        duration-500
        ${course.isPublished ? 'translate-x-20' : 'translate-x-[2px]'}
      `}></div>
      
      {/* النص (Published/Unpublished) */}
      <span className={`
        text-sm font-medium 
        absolute top-1.5 
        pointer-events-none 
        ${course.isPublished ? 'text-white left-2' : 'text-gray-500 right-2'}
      `}>
        {course.isPublished ? 'Published' : 'Unpublished'}
      </span>
    </div>
  </label>
</form>

        </div>
        <div className="flex flex-wrap items-center gap-2 mb-4">
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Price: ${course.price}
          </span>
          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            Teacher ID: {course.teacher}
          </span>
        </div>
        <div className="border-t border-gray-200 my-4"></div>
        <h3 className="text-lg font-semibold mb-2">Description</h3>
      {/* <p 
  className="text-gray-700 whitespace-pre-line break-words 
             overflow-hidden 
             display: -webkit-box;
             -webkit-box-orient: vertical;
             -webkit-line-clamp: 6"
>
  {course.description?.length > 100 
    ? course.description.slice(0, 100) + '...' 
    : course.description || "No description provided"}
</p> */}
      </div>

      {/* Stats Card */}
      <div className="md:w-72 w-full flex-shrink-0">
        <div className="sticky top-4 bg-white rounded-lg shadow p-6">
          <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            Course Stats
          </h4>
          <div className="space-y-3 mb-6">
            <div>
              <p className="font-semibold">Status:</p>
              <div className="mt-1">
                {course.isPublished ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Published
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
                    Unpublished
                  </span>
                )}
              </div>
            </div>
            <div>
              <p className="font-semibold">Price:</p>
              <div className="mt-1">
                <p>${course.price}</p>
              </div>
            </div>
            <div>
              <p className="font-semibold">PlayLists:</p>
              <div className="mt-1">
                <p>{playlistData?.length || 0} playlist</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setPlaylistModalVisible(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add playList
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
        {/* Playlist Section */}
        <table className="min-w-full table-auto border border-gray-300">
          <thead className="bg-gray-100 ">
            <tr>
              <th></th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                Playlist Title
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                Poster
              </th>
              <th className="px-4 py-2 text-left font-semibold text-gray-700 border-b">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 ">
            {playlistData.map((playlist) => {
              return (
               <React.Fragment key={playlist._id} >
                <tr onClick={()=>{
                 
                  setplaylistDataShow((prev)=>prev.includes(playlist._id)?prev.filter(id=>id!==playlist._id):[...prev,playlist._id])
                }} className="even:bg-gray-100" >

                  <td className="text-blue-400 px-4">{playlistDataShow.includes(playlist._id) ?<FiEyeOff size={20}/>:<FiPlayCircle size={20}/>}</td>
                  <td className="px-4 py-2">{playlist?.title}</td>
                  <td className="px-4 py-2">
                    {" "}
                    <Image
                      width={50}
                      height={50}
                      alt={`${playlist.title}`}
                      src={`http://localhost:5000/${playlist?.poster}`}
                    />
                  </td>
                  <td className="px-4 py-2 flex items-center gap-2" >
                    {" "}
                    <div>
                    <button className="bg-blue-400 px-4 py-2 text-grey-300 flex gap-2 items-center hover:bg-blue-700 rounded-lg "
                    onClick={()=>{
                      handleAddVideo(playlist._id)
                      setVideoModalVisible(true)
                    }}> <FiPlus size={20}/> <span className="hidden sm:inline-block">Add video</span> </button>
                   </div>
                     <div  className=" ">
      <button
        onClick={() => {
          setEditPlaylistModalVisible(true);
          handleEditPlaylist(playlist);
        }}
        className="px-4 py-2 flex gap-2 text-grey-300 items-center rounded-lg"
      >
        <FiPenTool size={20} />
        <span className="hidden sm:inline-block">Edit</span>
      </button>

  
    </div>
        <button className=" px-4 py-2 flex gap-2 items-center text-grey-300 border border-dashed rounded-lg "
         onClick={() => {
          setQuizModalVisible(true);
          handleAddQuiz(playlist._id);
        }}> <FiPlus size={20}/> <span className="hidden sm:inline-block">Add Quiz</span> </button>

                    <button onClick={() =>{ 
                     
                      setPlaylistDeleteModelVisible(true)
                      setDeletePlaylistId(playlist._id)
                      }}>
                      <FiX size={20} scale={1.1} color="red"/>
                    </button>
                  </td>
                  <td>

                  </td>
                </tr>
                <tr className="bg-gray-300 min-w-full">
                  <td colSpan={4}>  {
playlistDataShow.includes(playlist._id) && <PlaylistSection
                    playlist={playlist}
                    locale={locale}
                    courseId={id}
                    onDeleteQuiz={handleDeleteQuiz} // دالة حذف كويز
                    onAddQuiz={handleAddQuiz} // دالة تفتح مودال إضافة كويز
                    onAddQuestion={handleAddQuestion} // دالة تفتح مودال إضافة سؤال
                    onEditQuestion={handleEditQuestion} // دالة تفتح مودال تحديث سؤال
                    onEditQuiz={handleEditQuiz} // دالة تفتح مودال تحديث كويز
                    onDeleteQuestion={handleDeleteQuestion}
                    onEditVideo={handleEditvideo}
                    onDeleteVideo={deleteVideoFromPlaylist}
                    onAddVideo={handleAddVideo}
                    openAddQuestionModel={questionModelVisable}
                    setOpenAddQuestionModel={setQuestionModalVisible}
                   editQuestion={editVisible}
                   setQuizModalVisible={setQuizModalVisible}
                  />
                }</td>
                     
                </tr>
              </React.Fragment>
              );
            })}
          </tbody>
        </table>

       
      </div>
    </div>
  );
};

export default ViewCourseTeacher;
