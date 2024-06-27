"use client"
import { useUser } from '@clerk/nextjs'
import { eq } from 'drizzle-orm'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import FormListItemResponse from '../responses/_components/FormListitemResponse'

function page() {

    const [formList, setFormList] = useState()
    const {user} = useUser()

    useEffect(()=>{
        user && getFormList();
    })

    const getFormList = async() => {
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress))

        setFormList(result);
    }
  return (
    <div className='p-10 h-[1000px]'>
        <h2 className='font-bold text-3xl flex items-center justify-between'>Responses</h2>
        <div className='grid grid-cols-2 lg:grid-cols-3 gap-5'>
            {
                formList && formList?.map((form,index) => (
                    <FormListItemResponse key={index} formRecord={form} jsonForm={JSON.parse(form?.jsonform)}/>
                ))
            }
        </div>
    </div>
  )
}

export default page