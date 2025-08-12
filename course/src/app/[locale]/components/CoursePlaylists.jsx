"use client";
import { useState } from "react";
import PlaylistVideoList from "./PlaylistVideoList";
import PlaylistQuizList from "./PlaylistQuizList";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";
import { motion } from "framer-motion";
const CoursePlaylists = ({ playlistData, locale, courseId, isEnroll }) => {
  const [activeTab, setActiveTab] = useState({}); // { [playlistId]: 'video' | 'quiz' }
  const [activeOpenPlaylist, setActiveOpenPlaylist] = useState({});

  const togglePlaylist = (playlistId) => {
    setActiveOpenPlaylist((prev) => ({
      ...prev,
      [playlistId]: !prev[playlistId],
    }));
  };

  const handleTabClick = (playlistId, tab) => {
    setActiveTab((prev) => ({
      ...prev,
      [playlistId]: tab,
    }));
  };

  return (
    <div className="bg-transparent space-y-6">
      {playlistData.map((playlist) => (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          
        key={playlist._id} className="flex flex-col  rounded-lg">
          {/* Playlist Header */}
          <div
            className="flex items-center   px-4 justify-between bg-blue-200 shadow-lg border border-gray-300 rounded-lg py-4 cursor-pointer"
            onClick={() => togglePlaylist(playlist._id)}
          >
            <div className="flex items-center gap-4">
              <h2 className="text-lg font-semibold">{playlist.title}</h2>
              <div className="text-sm text-gray-600 flex gap-4">
                <span>{playlist?.videos?.length || 0} videos</span>
                <span>{playlist?.quizzes?.length || 0} quizzes</span>
              </div>
            </div>
            {activeOpenPlaylist[playlist._id] ? (
              <FiChevronDown className="w-6 h-6" />
            ) : (
              <FiChevronRight className="w-6 h-6" />
            )}
          </div>

          {/* Playlist Tabs & Content */}
          {activeOpenPlaylist[playlist._id] && (
            <div className="px-2">
              {/* Tab Buttons */}
              <motion.div 
              transition={{ duration: 0.9 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              
              className="flex items-center gap-4 my-2">
                <motion.span
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabClick(playlist._id, "video")}
                  className={`cursor-pointer px-4 py-1  ${
                    activeTab[playlist._id] === "video"
                      ? "border-b border-blue-500 text-blue-500"
                      : ""
                  }`}
                >
                  Videos
                </motion.span>
                <motion.span
                 initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handleTabClick(playlist._id, "quiz")}
                  className={`cursor-pointer px-4 py-1 ${
                    activeTab[playlist._id] === "quiz"
                      ? "border-b border-blue-500 text-blue-500"
                      : ""
                  }`}
                >
                  Quizzes
                </motion.span>
              </motion.div>

              <div className="mt-2">
                {activeTab[playlist._id] === "video" && (
                  <PlaylistVideoList
                    videos={playlist.videos}
                    locale={locale}
                    courseId={courseId}
                    playlistId={playlist._id}
                    isEnroll={isEnroll}
                  />
                )}
                {activeTab[playlist._id] === "quiz" && (
                  <PlaylistQuizList
                    quizzes={playlist.quizzes}
                    locale={locale}
                    courseId={courseId}
                    playlistId={playlist._id}
                    isEnroll={isEnroll}
                  />
                )}
              </div>
            </div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default CoursePlaylists;
