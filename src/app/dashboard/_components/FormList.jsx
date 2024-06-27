"use client"
import { useUser } from '@clerk/nextjs'
import React, { useEffect, useState } from 'react'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import { desc, eq } from 'drizzle-orm'
import FormListItemResponse from '../_components/FormListItem'

function FormList() {
    const {user} = useUser()
    const [formList, setFormList] = useState([]);

    useEffect(()=>{
        user && GetFormList();
    },[user])

    const GetFormList = async() =>{
        const result = await db.select().from(JsonForms)
        .where(eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id));

        setFormList(result)
        console.log(result)
    }    
  return (
    <div className='mt-5 grid grid-cols-2 md:grid-cols-3 gap-5'>
        {formList.map((form,index)=>(
            <div key={index}>
                <FormListItemResponse jsonForm={JSON.parse(form.jsonform)} formRecord={form} refreshData={GetFormList}/>
            </div>
        ))}
    </div>
  )
}

export default FormList