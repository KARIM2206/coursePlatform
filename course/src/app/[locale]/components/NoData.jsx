import { FiInbox } from 'react-icons/fi';

const NoData = ({data}) => {
  return (
    <div className="flex flex-col items-center justify-center text-gray-500 mt-10">
      <FiInbox size={48} color='#3b82f6'/>
      <p className="mt-2 text-lg">No {data} yet</p>
    </div>
  );
};

export default NoData;
