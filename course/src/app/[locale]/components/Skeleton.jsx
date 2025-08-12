

const Skeleton = ({rows}) => {

    return (
    <div>
      {
        Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded mb-1" ></div>
            
              <div className="mt-2 h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
            <div className="mt-2 h-4 bg-gray-200 rounded w-1/2 mb-1"></div>
        
            </div>
        ))

      }
    </div>
  )
}

export default Skeleton

