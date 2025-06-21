

import { getDictionary } from '@/i18n/server'

import React from 'react'
import Login from '../components/Login';

 export default async function  LoginPage ({ params }){

    const locale = params?.locale || "en";
 
    
const dict=await getDictionary(locale)


  return <Login dict={dict.signup} locale={locale} />;
}


