"use client";
import React, { useState } from "react";
import { FiArrowDown, FiArrowRight, FiPlus } from "react-icons/fi";

const PlaylistQuizModelTeacherControll = () => {
  const [arrowState, setArrowState] = useState(false);
  return (
    <section>
      <div>
        <div className="flex items-center gap-2  p-4 rounded-lg">
          <div className="flex items-center gap-2 flex-col ">
            
            <span className="font-semibold">quiz title</span>
            <p>quiz date</p>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <button className="text-blue-600  px-4 py-2 rounded">
                <FiPlus size={20} />
              </button>
              {arrowState ? (
                <button
                  className="text-blue-600  px-4 py-2 rounded"
                  onClick={() => setArrowState(false)}
                >
                  <FiArrowDown size={20} />
                </button>
              ) : (
                <button
                  className="text-blue-600  px-4 py-2 rounded"
                  onClick={() => setArrowState(true)}
                >
                  <FiArrowRight size={20} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PlaylistQuizModelTeacherControll;
