import React, { useRef, useState } from 'react'
import { Input } from '../../../components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../../components/ui/select"
import { Label } from "../../../components/ui/label"
import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group"
import { Checkbox } from "../../../components/ui/checkbox"
import FieldEdit from "../_components/FieldEdit"
import { db } from '../../../../configs'
import { userResponses } from '../../../../configs/schema'
import moment from 'moment'
import { toast } from 'sonner'
import { SignInButton, useUser } from '@clerk/nextjs'
import { Button } from '../../../components/ui/button'


function FormUi({ jsonForm, onFieldUpdate, deleteField, selectedTheme, selectedStyle, editable = true, formId = 0, enableSignIn = false }) {

    const [formData, setFormData] = useState();
    let formRef = useRef()
    const { user, isSignedIn } = useUser()

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const handleCheckedChange = (fieldName, itemName, value) => {
        const list = formData?.[fieldName] ? formData?.[fieldName] : [];

        if (value) {
            list.push({
                label: itemName,
                value: value
            })
            setFormData({
                ...formData,
                [fieldName]: list
            })
        } else {
            const result = list.filter((item) => item.label == itemName);
            setFormData({
                ...formData,
                [fieldName]: result
            })
        }
    }

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        })
    }

    const onFormSubmit = async (event) => {
        event.preventDefault()
        console.log(formData)

        const result = await db.insert(userResponses)
            .values({
                jsonResponses: formData,
                createdAt: moment().format('DD/MM/yyy'),
                formRef: formId
            })

        if (result) {
            formRef.reset()
            toast('Response Submitted Successfully!')
        } else {
            toast('Error while saving the response!')
        }
    }
    return (
        <form ref={(e) => formRef = e} className='border p-5 md:w-[600px] rounded-lg' onSubmit={onFormSubmit} data-theme={selectedTheme} style={{
            border: selectedStyle
        }}>
            <h2 className='font-bold text-center text-2xl' >{jsonForm?.formTitle}</h2>
            <h2 className='text-sm text-gray-400 text-center'>{jsonForm?.formSubheading}</h2>

            {jsonForm?.formFields.map((field, index) => (
                <div key={index} className='flex items-center gap-2'>
                    {
                        field.type === "select" ?
                            <div className='my-3 w-full bg-transparent'>
                                <label className='text-xs text-gray-500'>{field?.label}</label>
                                <Select required={field?.required} onValueChange={(value) => handleSelectChange(field.name, value)}>
                                    <SelectTrigger className="w-full">
                                        <SelectValue placeholder={field.placeholder} />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {field.options.map((item, index) => (
                                            <SelectItem key={index} value={item.value}>{item.value}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            :
                            field.type === "radio" ?
                                <div className='my-3 w-full'>
                                    <label className='text-xs text-gray-500'>{field.label}</label>
                                    <RadioGroup required={field?.required}>
                                        {field.options.map((item, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <RadioGroupItem onClick={() => handleSelectChange(field.name, item.label)} value={item.value} id={item.value} />
                                                <Label htmlFor={item.value}>{item.value}</Label>
                                            </div>
                                        ))}

                                    </RadioGroup>

                                </div> :
                                field.type === "checkbox" ?
                                    <div className='my-3 w-full'>
                                        <label className='text-xs text-gray-500'>{field.label}</label>
                                        {field?.options ? field?.options?.map((item, index) => (
                                            <div key={index} className='flex gap-2 items-center'>
                                                <Checkbox onCheckedChange={(v) => handleCheckedChange(field?.label, item?.label, v)} />
                                                <h2>{item.value}</h2>
                                            </div>
                                        )) : <div className='flex gap-2 items-center'>
                                            <Checkbox />
                                            <h2>{field.label}</h2>
                                        </div>
                                        }
                                    </div> :
                                    <div className='my-3 w-full'>
                                        <label className='text-xs text-gray-500'>{field?.label}</label>
                                        <Input type={field?.type} placeholder={field?.placeholder} name={field?.name} onChange={(e) => handleInputChange(e)} required={field?.required} />
                                    </div>
                    }
                    {editable && <div>
                        <FieldEdit defaultValue={field} onUpdate={(value) => onFieldUpdate(value, index)} deleteField={() => deleteField(index)} />
                    </div>
                    }
                </div>
            ))}
            {
                !enableSignIn ?
                    <button type='submit' className="btn btn-primary">Submit</button> :
                    isSignedIn ?
                        <button type='submit' className="btn btn-primary">Submit</button> :
                        <Button>
                            <SignInButton mode='modal'>Sign In before Submit</SignInButton>
                        </Button>
            }
        </form>
    )
}

export default FormUi