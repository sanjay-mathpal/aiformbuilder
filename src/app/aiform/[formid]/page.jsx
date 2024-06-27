"use client"
import React, { useEffect, useState } from 'react'
import FormUi from '../../edit-form/_components/FormUi'
import { JsonForms } from '../../../../configs/schema'
import { db } from '../../../../configs'
import { eq } from 'drizzle-orm'

function LiveAiForm({ params }) {
    const [record, setRecord] = useState([])
    const [jsonForm, setJsonForm] = useState()


    useEffect(() => {
        params && GetFormData()
    }, [params])

    const GetFormData = async () => {
        const result = await db.select().from(JsonForms)
            .where(eq(JsonForms.id, Number(params?.formid)))
        setRecord(result[0])
        setJsonForm(JSON.parse(result[0].jsonform))
        console.log(JSON.parse(result[0].jsonform))
    }

    return (
        <div className='p-10 flex justify-center items-center' style={{
            backgroundImage: record?.background
        }}>
            {record && <FormUi
                jsonForm={jsonForm}
                onFieldUpdate={() => console.log}
                deleteField={() => console.log}
                selectedTheme={record?.theme}
                selectedStyle={record?.style}
                editable={false}
                formId={record.id}
                enableSignIn={record?.enableSignIn}
            />
            }
            <div className='flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed bottom-5 left-5 cursor-pointer'>
                <h2>AI Form-Builder</h2>
            </div>
        </div>
    )
}

export default LiveAiForm