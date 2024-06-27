"use client"
import React, { useEffect, useState } from 'react'
import { db } from '../../../../configs'
import { JsonForms } from '../../../../configs/schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share2, SquareArrowOutUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import FormUi from '../_components/FormUi'
import { toast } from 'sonner'
import Controller from '../_components/Controller'
import { Button } from '../../../components/ui/button'
import Link from 'next/link'
import { RWebShare } from 'react-web-share'

function EditForm({ params }) {

  const { user } = useUser();
  const [jsonForm, setJsonForm] = useState();
  const router = useRouter();
  const [updateTrigger, setUpdateTrigger] = useState()
  const [record, setRecord] = useState([])
  const [selectedTheme, setSelectedTheme] = useState("light")
  const [selectedBackground, setSelectedBackground] = useState()
  const [selectedStyle, setSelectedStyle] = useState()


  const updateControllerFields = async (value, columnName) => {
    await db.update(JsonForms).set({
      [columnName]: value
    }).where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))

    toast("Successfully Updated!")
  }

  const onFieldUpdate = (value, index) => {
    jsonForm.formFields[index].label = value.label;
    jsonForm.formFields[index].placeholder = value.placeholder;
    setUpdateTrigger(Date.now())
  }

  const deleteField = (indexToRemove) => {
    const result = jsonForm.formFields.filter((item, index) => index != indexToRemove)
    jsonForm.formFields = result;
    setUpdateTrigger(Date.now())
  }

  useEffect(() => {
    if (updateTrigger) {
      setJsonForm(jsonForm)
      updateJsonFormDb();
    }
  }, [updateTrigger])

  useEffect(() => {
    user && GetFormData();
  }, [user])

  const updateJsonFormDb = async () => {
    const result = await db.update(JsonForms)
      .set({
        jsonform: jsonForm
      }).where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    console.log(result)
    toast('Form Updated Successfully!')
  }

  const GetFormData = async () => {
    const result = await db.select().from(JsonForms)
      .where(and(eq(JsonForms.id, params?.formId),
        eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    setRecord(result[0])
    setJsonForm(JSON.parse(result[0].jsonform))
    setSelectedBackground(result[0].background)
    setSelectedStyle(result[0].style)
  }
  return (
    <div className='p-10'>
      <div className='flex justify-between items-center'>
        <h2 className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold' onClick={() => router.back()}><ArrowLeft />Back</h2>
        <div className='flex gap-2'>
          <Link href={'/aiform/' + record?.id} target='_blank'>
            <Button className="flex gap-2"><SquareArrowOutUpRight className='h-5 w-5' />Live Preview</Button></Link>
          <RWebShare
            data={{
              text: jsonForm?.formSubheading + ", Build your form in seconds with AI Form Builder",
              url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
              title: jsonForm?.formTitle,
            }}
            onClick={() => console.log("shared successfully!")}
          >
            <Button className="flex gap-2 bg-green-600 hover:bg-green-700"><Share2 />Share</Button>
          </RWebShare>

        </div>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        <div className='p-5 border rounded-lg shadow-md'>
          <Controller selectedTheme={(value) => {
            setSelectedTheme(value),
              updateControllerFields(value, 'theme')
          }} selectedBackground={(value) => {
            setSelectedBackground(value),
              updateControllerFields(value, 'background')
          }} selectedStyle={(value) => {
            setSelectedStyle(value),
              updateControllerFields(value, 'style')
          }} setSignInEnable={(value)=>{
            updateControllerFields(value,'enableSignIn')
          }} />
        </div>
        <div className='md:col-span-2 border rounded-lg p-5 flex items-center justify-center' style={{
          backgroundImage: selectedBackground
        }}>
          <FormUi jsonForm={jsonForm} onFieldUpdate={onFieldUpdate} deleteField={(index) => deleteField(index)} selectedTheme={selectedTheme} selectedStyle={selectedStyle} />
        </div>
      </div>
    </div>
  )
}

export default EditForm