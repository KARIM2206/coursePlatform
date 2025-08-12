// course handle fetch

export const getAllCourses=async(token,skip,limit,tag,keyword)=>{
  try {
      const response = await fetch(`http://localhost:5000/api/course/all?skip=${skip}&limit=${limit}&tag=${tag}&keyword=${keyword}`, {
          method: 'GET',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch courses')
        }
  
        const data = await response.json()
        return data 
      }
      catch (error) {
        console.error('Error fetching courses:', error)
        throw error
      }
}

export const getAllTeacherCourses=async (token)=>{
  try {
      const response = await fetch(`http://localhost:5000/api/course/teacher/courses`, {
          method: 'GET',
          headers: token ? { 'Authorization': `Bearer ${token}` } : {}
        })
  
        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.message || 'Failed to fetch courses')
        }
  
        const data = await response.json()
        return data 
      }
      catch (error) {
        console.error('Error fetching courses:', error)
        throw error
      }
}
export async function addQuiz(playlistId, token, title) {
  console.log('quiz title api',title);
  
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/playlists/${playlistId}/create`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
      cache: 'no-store', // مهم في صفحات السيرفر Next.js
    });
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // يمكنك تسجيل الخطأ أو إعادة إرساله
    throw error;
  }
}
export async function updateQuiz(quizId, token, title) {
  console.log('quiz title api',title);
  
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/${quizId}/update`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title }),
      cache: 'no-store', // مهم في صفحات السيرفر Next.js
    });
    if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    // يمكنك تسجيل الخطأ أو إعادة إرساله
    throw error;
  }
}

export async function getQuiz(playlistId,token){
   
   try{ const response=await fetch(`http://localhost:5000/api/quiz/playlists/${playlistId}/getAll`,{
        headers:{
     "Authorization": `Bearer ${token}`
        }
    })
     if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    const data = await response.json();
    
    
    return data.quiz;
  } catch (error) {
    // يمكنك تسجيل الخطأ أو إعادة إرساله
    throw error;
  }

}
export async function deleteQuiz(quizId, token) {
  try {
    const response = await fetch(`http://localhost:5000/api/quiz/${quizId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'Failed to delete quiz');
    return data;
  } catch (error) {
    throw error;
  }
}

export async function addQuestion(currentQuizId, token, questionData) {
  try {
    // Validate data before sending
    if (!questionData.questionText || 
        !questionData.options || 
        !questionData.correctAnswer) {
      throw new Error('Missing required fields');
    }

    if (!questionData.options.includes(questionData.correctAnswer)) {
      throw new Error('correctAnswer must match one of the options');
    }

    const response = await fetch(
      `http://localhost:5000/api/questions/quiz/${currentQuizId}/create`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData),
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Server error:', errorData);
      throw new Error(errorData.message || 'Failed to create question');
    }

    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}
export async function getQuestions(quizId,token,skip,limit){
   
   try{ const response=await fetch(`http://localhost:5000/api/questions/quiz/${quizId}/all?skip=${skip}&limit=${limit}`,{
        headers:{
     "Authorization": `Bearer ${token}`
        }
    })
     if (!response.ok) {
      throw new Error('Failed to create quiz');
    }
    const data = await response.json();
  
    
    return data;
  } catch (error) {
    // يمكنك تسجيل الخطأ أو إعادة إرساله
    throw error;
  }

}
// edit question
export const editQuestionInServer = async (questionId, token, questionData) => {
  try {
    // تحقق من الحقول المطلوبة
    if (
      !questionData.questionText ||
      !questionData.options ||
      !questionData.correctAnswer
    ) {
      // تجاهل الخطأ وأعد البيانات كما هي
      return { success: false, message: 'Missing required fields', questionData };
    }

    if (!questionData.options.includes(questionData.correctAnswer)) {
      // تجاهل الخطأ وأعد البيانات كما هي
      return { success: false, message: 'correctAnswer must match one of the options', questionData };
    }

    const response = await fetch(`http://localhost:5000/api/questions/${questionId}/edit`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(questionData)
    });

    // تحقق من نجاح الاستجابة
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // تجاهل الخطأ وأعد البيانات كما هي
      return { success: false, ...errorData, questionData };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // تجاهل الخطأ وأعد البيانات كما هي
    console.error('API Error:', error.message);
    return { success: false, message: error.message, questionData };
  }
};
export const deleteQuestionInServer = async (questionId, token) => {
  try {
  
  
    const response = await fetch(`http://localhost:5000/api/questions/${questionId}/delete`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
    });

    // تحقق من نجاح الاستجابة
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      // تجاهل الخطأ وأعد البيانات كما هي
      return { success: false, ...errorData, questionData };
    }

    const data = await response.json();
    return data;
  } catch (error) {
    // تجاهل الخطأ وأعد البيانات كما هي
    console.error('API Error:', error.message);
    return { success: false, message: error.message, questionData };
  }
};
// progress
export const postProgress= async(quizId,token,answers )=>{
console.log(answers);

  try {
 const response =await fetch(`http://localhost:5000/api/progress/${quizId}/submit`,{
  headers:{
    "Authorization":`Bearer ${token}`,
    "Content-Type": "application/json"

  },
  method:"POST",
  body:JSON.stringify({answers})


 })
 console.log(response);
 
 if (!response.ok) {
  const errorData = await response.json().catch(() => ({}));
  throw new Error(errorData.message || 'Failed to submit quiz');
  
}
  const data=await response.json();
  return data;
 
    
  } catch (error) {
    throw error;
  }
}
export const getProgress= async(quizId,token )=>{


  try {
 const response =await fetch(`http://localhost:5000/api/progress/${quizId}/get`,{
  headers:{
    "Authorization":`Bearer ${token}`

  },
  method:"GET",



 })
 console.log(response);
 
  if(!response.ok){
    throw new Error('Failed to create quiz');
  }
  const data=await response.json();
  console.log(data);
  
  return data;
 
    
  } catch (error) {
    throw error;
  }
}
const API_BASE_URL = 'http://localhost:5000/api';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  };
};

export const progressAPI = {
  // Submit quiz answers
  submitQuiz: async (quizId, answers) => {
    const response = await fetch(`${API_BASE_URL}/quizzes/${quizId}/submit`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ answers })
    });
    return handleResponse(response);
  },
  
  // Get progress by ID
  getProgress: async (progressId) => {
    const response = await fetch(`${API_BASE_URL}/progress/${progressId}`, {
      method: 'GET',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },
  
  // Get user's quiz progress
  getQuizProgress: async (userId, quizId) => {
    const response = await fetch(`${API_BASE_URL}/users/${userId}/quizzes/${quizId}`, {
      method: 'GET',
      headers: getAuthHeader()
    });
    return handleResponse(response);
  },
  
  // Send certificate
  sendCertificate: async (progressId) => {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      headers: getAuthHeader(),
      body: JSON.stringify({ progressId })
    });
    return handleResponse(response);
  }
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'API request failed');
  }
  return data;
};
//enrollment courses
// export const enrollCourse = async (courseId, token) => {
//   const response = await fetch('http://localhost:5000/api/enrollment/course', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${token}`
//     },
//     body: JSON.stringify({ courseId })
//   });

//   if (!response.ok) {
//     const data = await response.json().catch(() => ({}));
//     throw new Error(data.error || 'Failed to enroll in course');
//   }
//   return await response.json();
// };
export const getEnrollments = async (courseId,token) => {
  const response = await fetch(`http://localhost:5000/api/enrollment/course/${courseId}/get`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }

  });

  if (!response.ok) {
    const data = await response.json().catch(() => ({}));
    throw new Error(data.message || 'Failed to get enrollments');
  }
  const data=await response.json();
  return data;
};
// Student Stats 
export  const getStudentStatsPerCourse = async (studentId,token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/progress/student/${studentId}/get`, {
      method: 'GET',
      headers: {
        "Authorization": `Bearer ${token}`
      }
    });
  if(!response.ok){
    throw new Error('Failed to get student stats');
  }
  console.log(response);
  
  const data = await response.json();
  return data;
  } catch (error) {
    throw error;
  }

}
// your course student
export const getYourCourseStudents = async (token) => {
  try {
    const response = await fetch(`http://localhost:5000/api/course/student/courses`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Failed to fetch course data');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.log(error.message || error);
    return { success: false, error: error.message || 'Unknown error' };
  }
};

//  rating  course 
 export const submitRating = async (courseId, rating,token) => {
try{  const response = await fetch(`${API_BASE_URL}/course/${courseId}/rating`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ rating })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit rating');
  }
  return data}
  catch (error) {
    throw error;
  }
 }
 export const getStudentRating = async (courseId,token) => {
try{  const response = await fetch(`${API_BASE_URL}/course/${courseId}/ratingStudent`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit rating');
  }
  return data}
  catch (error) {
    throw error;
  }
 }
 export const getAvarageRating = async (courseId) => {
try{  const response = await fetch(`${API_BASE_URL}/course/${courseId}/avrRating`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      // 'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit rating');
  }
  return data}
  catch (error) {
    throw error;
  }
 }
 // secuirty Details
 export const loginSession=async(action, token)=>{
  try{  const response = await fetch(`${API_BASE_URL}/auth/log-session`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ action })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit rating');
  }
  return data}
  catch (error) {
    throw error;
  }
 }
 export const getSessionStats=async(token)=>{
  try{  const response = await fetch(`${API_BASE_URL}/auth/session-stats`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to submit rating');
  }
  return data}
  catch (error) {
    throw error;
  }
 }

 // check out course 

 export const checkOutCourse= async (courseId,token)=>{
 
  try {
    const res= await fetch(`http://localhost:5000/api/payment/create-checkout-session/${courseId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }
    return data
  } 
  catch (error) {
    console.error(error);
  }
 }
 export const checkOutCourseOfMultipleCourse= async (courseIds,token)=>{
 
  try {
    const res= await fetch(`http://localhost:5000/api/payment/create-checkout-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
    body: JSON.stringify({ courseIds })
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || 'Failed to create checkout session');
    }
    return data
  } 
  catch (error) {
    console.error(error);
    throw error;
  }
 }
 // cart method
export const addItemsToCart = async (courseId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ 
        courseId: courseId // تأكد أن الخادم يحوله إلى ObjectId
      })
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add item to cart');
    }
    return data;
  } catch (error) {
    throw error;
  }
}



export const getCartItems = async (token) => {
  try {
    // الخطوة الأولى: جلب السلة
    const response = await fetch(`${API_BASE_URL}/cart/get`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to get cart items');
    }

    console.log('Cart Response:', data);
    const courses = data?.cart?.courses ?? [];
    console.log('Courses in Cart:', courses);

    // الخطوة الثانية: جلب بيانات كل كورس
    const cartItems = await Promise.all(
      courses.map(async (item) => {
        try {
          const res = await fetch(`${API_BASE_URL}/course/${item.courseId}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            }
          });

          const courseData = await res.json();

          if (!res.ok || !courseData?.course) {
            throw new Error(courseData.error || 'Failed to fetch course');
          }

          // جلب الراتينج - لو مش موجود، نحط صفر
      const ratingData = await getAvarageRating(item.courseId);
const avrRating = ratingData?.ratingAvg || 0;

          // اختياري: delay للتجربة فقط (ممكن تحذفها)
          await new Promise((resolve) => setTimeout(resolve, 500));

          return {
            id: item.courseId,
            course: courseData.course || {},
            quantity: item.quantity,
            avrRating,
          };
        } catch (err) {
          console.error(`Error fetching course ${item.courseId}:`, err.message);
          return null;
        }
      })
    );

    // رجّع العناصر غير الفارغة فقط
    return cartItems.filter(item => item !== null);

  } catch (error) {
    console.error('Error in getCartItems:', error.message);
    throw error;
  }
};

 export const deleteCartItem = async (courseId, token) => {
  try {
    const response = await fetch(`${API_BASE_URL}/cart/deleteCourse/${courseId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Failed to delete course from cart');
    }
    return data;
  } catch (error) {
    console.error('Error in deleteCartItem:', error.message);
    throw error;
  }
};