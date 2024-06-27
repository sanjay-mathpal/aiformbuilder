"use client"
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../../components/ui/dialog"
import { Textarea } from "../../../components/ui/textarea"
import { AiChatSession } from '../../../../configs/AiModel'
import { Button } from '../../../components/ui/button'
import moment from 'moment'
import { useUser } from '@clerk/nextjs'
import { db } from '../../../../configs/index'
import { JsonForms } from '../../../../configs/schema'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react'

const PROMPT = ", On the basis of description please give form in JSON format with formTitle, formSubheading, formFields its name, label, type, placeholder for each field, also you can take any types like radio, text area, checkbox, etc . for test purpose provide with all types"

function CreateForm() {
    const [openDialog, setOpenDialog] = useState(false);
    const [userInput, setUserInput] = useState();
    const [loading, setLoading] = useState(false);
    const { user } = useUser();
    const route = useRouter();

    const onCreateForm = async () => {
        setLoading(true);

        try {
            const result = await AiChatSession.sendMessage("Description: " + userInput + PROMPT);
            console.log(result.response.text());
            if (result.response.text) {
                const resp = await db.insert(JsonForms)
                    .values({
                        jsonform: result.response.text(),
                        createdBy: user?.primaryEmailAddress?.emailAddress,
                        createdAt: moment().format('DD/MM/yyyy')
                    }).returning({ id: JsonForms.id });
                console.log('New Form ID', resp);
                if (resp[0].id) {
                    route.push('/edit-form/' + resp[0].id)
                }
                setLoading(false);
            }
            setLoading(false)
        } catch (error) {
            setLoading(false)
            console.log(error);
        }
    }
    return (
        <div>
            <Button onClick={() => setOpenDialog(true)}>+ Create Form</Button>
            <Dialog open={openDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Create New Form
                        </DialogTitle>
                        <DialogDescription>
                            <Textarea className="my-2" onChange={(event) => setUserInput(event.target.value)} placeholder="Write description of your form" />
                            <div className='flex gap-2 my-3 justify-end'>
                                <Button variant="destructive" onClick={() => setOpenDialog(false)}>Cancel</Button>
                                <Button disabled={loading} onClick={() => onCreateForm()}>
                                    {
                                        loading ? <Loader2 className='animate-spin' /> : 'Create'
                                    }
                                </Button>
                            </div>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default CreateForm