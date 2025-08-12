'use client'
import Image from 'next/image'
import React, { useContext, useEffect, useState } from 'react'
import { FiHeart, FiLoader, FiMinus, FiPlus, FiTrash } from 'react-icons/fi'
import { motion, AnimatePresence } from 'framer-motion'
import { Context } from '../CONTEXT/ContextProvider'
import { toast } from 'react-toastify'
import { checkOutCourseOfMultipleCourse, getAvarageRating, getCartItems,deleteCartItem } from '../lib/server'
import { useRouter } from 'next/navigation'
// import { deleteCartItem } from '../lib/server'

const Cart = () => {
   const [arrayOfCoursesID, setArrayOfCoursesID] = useState([]);
    const {token,cart,setCart}=useContext(Context)
    const router=useRouter()

useEffect(() => {
  if (cart.length > 0) {
  cart?.map(e=>{
    if (e.course._id) {
      setArrayOfCoursesID(prev => [...prev, e.course._id]);
    }
  })
  }
}, [cart]);
const handleCheckout = async() => {
  if (!token) {
    toast.error('Please login to checkout');
    return;
  }
try {
    const res=await checkOutCourseOfMultipleCourse(arrayOfCoursesID,token);
    console.log(res);
    
    if (res.ok) {
        toast.success('Redirecting to payment...');
     router.push(res.url);
    } else {
      const data = await res.json();
      console.log(data);
      
      toast.error(data.error || 'Failed to create checkout session');
    }
} catch (error) {
    toast.error(error.message || 'Failed to create checkout session');
}
};

//   const handleGetAvarageRating = async () => {
//     try {
//      const newCart = await Promise.all(
//   cart.map(async (item) => {
//     const courseId = item.course?._id;
    
//     if (!courseId) {
//       console.warn('Course ID is undefined for item:', item);
//       return null; // أو قيمة افتراضية
//     }

//     const data = await getAvarageRating(courseId);
//     console.log(data);
    
//     return {...item, ratingAvg: data.ratingAvg };
//   })
// );

//       setCart(newCart);
//     } catch (error) {
//       throw new Error(error.message);
//     }
//   };

//   useEffect(() => {
//     handleGetAvarageRating();
//   }, [token, cart]);
// if (!token) return <FiLoader size={30} className='animate-span text-blue-600' />
    // const [cart, setCart] = React.useState([
    //     {
    //         id:1,
    //         name:"React Course",
    //         price:100,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },     {
    //         id:45,
    //         name:"React Course",
    //         price:100,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },     {
    //         id:1444,
    //         name:"React Course",
    //         price:100,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },     {
    //         id:156,
    //         name:"React Course",
    //         price:100,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },
    //     {
    //         id:2,
    //         name:"JavaScript Book",
    //         price:45,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },
    //     {
    //         id:3,
    //         name:"CSS Guide",
    //         price:30,
    //         image:'/images/avatar.jpg',
    //         quantity:1
    //     },
    // ])

    const subtotal = cart?.reduce((sum, item) => sum + (item.course.price * item.quantity), 0)
    const shipping = subtotal > 100 ? 0 : 15
    const total = subtotal + shipping

  

    const handleRemove = async(id) => {
       
        
        try{
            console.log('id', id);
            const data=await deleteCartItem(id,token); 
            console.log(data);
            if (data.ok) {
                setCart(prev => prev.filter(item => item.course._id !== id));
                toast.success('Item removed from cart');
            } else {
                console.log(data.error);
                
                toast.error(data.error || 'Failed to remove item from cart');
            }
        }
        catch(error){
            console.error('Error removing item:', error);
            
            toast.error(error.message || 'Failed to remove item from cart');
        }
      
    }

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0, 
            x: -50,
            transition: { duration: 0.2 }
        }
    }

    const buttonHover = {
        scale: 1.05,
        transition: { duration: 0.2 }
    }

    const buttonTap = {
        scale: 0.95
    }

    const quantityChange = {
        scale: [1, 1.2, 1],
        transition: { duration: 0.3 }
    }


    return (
        <motion.section 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-6xl mx-auto px-4 py-8"
        >
                <motion.h3 
                        className="text-2xl font-bold mb-6 text-gray-800"
                        initial={{ x: -20 }}
                        animate={{ x: 0 }}
                    >
                        Your Cart ({cart?.length})
                    </motion.h3>
            <div className="flex flex-col items-start   md:flex-row gap-8">
                {/* Cart Items */}
                <div className="md:w-2/3 w-full ">
                
                    
                    <AnimatePresence>
                    {cart?.length > 0 ? (
                        <div className="space-y-4 ">
                            {cart.map((item) => (
                                <motion.div 
                                    key={item.id}
                                    variants={itemVariants}
                                    initial="hidden"
                                    animate="visible"
                                    exit="exit"
                                    className="w-full bg-white rounded-lg shadow-md overflow-hidden border border-gray-100"
                                    layout
                                >
                                    <div className="flex items-center justify-between p-4">
                                        <div className="flex items-start space-x-4">
                                            <motion.div 
                                                className="relative w-20 h-20 rounded-md overflow-hidden"
                                                whileHover={{ scale: 1.05 }}
                                            >
                                                <Image 
                                                    src={`http:localhost:5000/${item.course?.image}`} 
                                                    alt={item.course?.title} 
                                                    layout="fill"
                                                    objectFit="cover"
                                                />
                                            </motion.div>
                                            
                                            <div className="flex flex-col">
                                                <h4 className="font-medium text-gray-800">{item.course?.title}</h4>
                                                <p className="text-gray-600">${item.course.price?.toFixed(2)}</p>
                                                 <div className="flex items-center">
              <div className="flex space-x-1 mr-2">
                { [...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className={`w-5 h-5 ${i < Math.floor(item?.avrRating) ? "text-yellow-400" : "text-gray-300"}`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-gray-500">
                ({item?.avrRating || 0}/5)
              </span>
            </div>
                                        </div>
                                        </div>
                                          <div className="flex items-center mt-2 space-x-3">
                                                    <motion.button 
                                                        whileHover={buttonHover}
                                                        whileTap={buttonTap}
                                                        className="text-gray-500 hover:text-blue-500"
                                                    >
                                                        <FiHeart size={16} />
                                                    </motion.button>
                                                    <motion.button 
                                                        whileHover={buttonHover}
                                                        whileTap={buttonTap}
                                                        className="text-gray-500 hover:text-red-500"
                                                        onClick={() => handleRemove(item.course._id)}
                                                    >
                                                        <FiTrash size={16} />
                                                    </motion.button>
                                                </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            className="text-center py-12"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                        >
                            <h4 className="text-xl font-medium text-gray-600">Your cart is empty</h4>
                            <p className="text-gray-500 mt-2">Start shopping to add items to your cart</p>
                        </motion.div>
                    )}
                    </AnimatePresence>
                </div>
                
                {/* Order Summary */}
                <div className="md:w-1/3 w-full">
                    <motion.div 
                        className="bg-white rounded-lg shadow-md p-6 sticky top-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <h3 className="text-xl font-bold mb-6 text-gray-800">Order Summary</h3>
                        
                        <div className="space-y-4 mb-6">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${subtotal?.toFixed(2)}</span>
                            </div>
                            
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">
                                    {shipping === 0 ? 'Free' : `$${shipping?.toFixed(2)}`}
                                </span>
                            </div>
                            
                            <div className="border-t border-gray-200 pt-4 flex justify-between">
                                <span className="font-bold text-gray-800">Total</span>
                                <span className="font-bold text-lg">${total?.toFixed(2)}</span>
                            </div>
                        </div>
                        
                        <motion.button onClick={handleCheckout}
                            whileHover={{ 
                                scale: 1.02,
                                boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)"
                            }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
                        >
                            Proceed to Checkout
                        </motion.button>
                        
                        {subtotal < 100 && (
                            <motion.p 
                                className="mt-4 text-sm text-center text-gray-500"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.3 }}
                            >
                                Spend ${(100 - subtotal)?.toFixed(2)} more for free shipping!
                            </motion.p>
                        )}
                    </motion.div>
                </div>
            </div>
        </motion.section>
    )
}

export default Cart