import { getDictionary } from '@/i18n/server';
import TeacherHeroSection from '../components/TeacherHeroSection';

export default async function TeacherDashboard({params}) {
      const locale = params?.locale || "en";
   
    
const dict=await getDictionary(locale)
  const teacher = {
    name: 'أ. كريم',
    image: '/logo.jpg',
    imgLoaded:true
  };


  return (
    <div className="p-4">
      <TeacherHeroSection teacher={teacher} locale={locale} />
      {/* باقي مكونات الداشبورد */}
    </div>
  );
}
